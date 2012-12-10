<?php

/**
 * This is the HTML pseudo-parser for the Yadis library.
 *
 * PHP versions 4 and 5
 *
 * LICENSE: See the COPYING file included in this distribution.
 *
 * @package OpenID
 * @author JanRain, Inc. <openid@janrain.com>
 * @copyright 2005-2008 Janrain, Inc.
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache
 */

/**
 * This class is responsible for scanning an HTML string to find META
 * tags and their attributes.  This is used by the Yadis discovery
 * process.  This class must be instantiated to be used.
 *
 * @package OpenID
 */
class Auth_Yadis_ParseHTML {

    /**
     * @access private
     */
    var $_re_flags = "si";

    /**
     * @access private
     */
    var $_removed_re =
           "<!--.*?-->|<!\[CDATA\[.*?\]\]>|<script\b(?!:)[^>]*>.*?<\/script>";

    /**
     * @access private
     */
    var $_tag_expr = "<%s%s(?:\s.*?)?%s>";

    /**
     * @access private
     */
    var $_attr_find = '\b([-\w]+)=(".*?"|\'.*?\'|.+?)[\/\s>]';

    function Auth_Yadis_ParseHTML()
    {
        $this->_attr_find = sprintf("/%s/%s",
                                    $this->_attr_find,
                                    $this->_re_flags);

        $this->_removed_re = sprintf("/%s/%s",
                                     $this->_removed_re,
                                     $this->_re_flags);

        $this->_entity_replacements = array(
                                            'amp' => '&',
                                            'lt' => '<',
                                            'gt' => '>',
                                            'quot' => '"'
                                            );

        $this->_ent_replace =
            sprintf("&(%s);", implode("|",
                                      $this->_entity_replacements));
    }

    /**
     * Replace HTML entities (amp, lt, gt, and quot) as well as
     * numeric entities (e.g. #x9f;) with their actual values and
     * return the new string.
     *
     * @access private
     * @param string $str The string in which to look for entities
     * @return string $new_str The new string entities decoded
     */
    function replaceEntities($str)
    {
        foreach ($this->_entity_replacements as $old => $new) {
            $str = preg_replace(sprintf("/&%s;/", $old), $new, $str);
        }

        // Replace numeric entities because html_entity_decode doesn't
        // do it for us.
        $str = preg_replace('~&#x([0-9a-f]+);~ei', 'chr(hexdec("\\1"))', $str);
        $str = preg_replace('~&#([0-9]+);~e', 'chr(\\1)', $str);

        return $str;
    }

    /**
     * Strip single and double quotes off of a string, if they are
     * present.
     *
     * @access private
     * @param string $str The original string
     * @return string $new_str The new string with leading and
     * trailing quotes removed
     */
    function removeQuotes($str)
    {
        $matches = array();
        $double = '/^"(.*)"$/';
        $single = "/^\'(.*)\'$/";

        if (preg_match($double, $str, $matches)) {
            return $matches[1];
        } else if (preg_match($single, $str, $matches)) {
            return $matches[1];
        } else {
            return $str;
        }
    }

    /**
     * Create a regular expression that will match an opening 
     * or closing tag from a set of names.
     *
     * @access private
     * @param mixed $tag_names Tag names to match
     * @param mixed $close false/0 = no, true/1 = yes, other = maybe
     * @param mixed $self_close false/0 = no, true/1 = yes, other = maybe
     * @return string $regex A regular expression string to be used
     * in, say, preg_match.
     */
    function tagPattern($tag_names, $close, $self_close)
    {
        if (is_array($tag_names)) {
            $tag_names = '(?:'.implode('|',$tag_names).')';
        }
        if ($close) {
            $close = '\/' . (($close == 1)? '' : '?');
        } else {
            $close = '';
        }
        if ($self_close) {
            $self_close = '(?:\/\s*)' . (($self_close == 1)? '' : '?');
        } else {
            $self_close = '';
        }
        $expr = sprintf($this->_tag_expr, $close, $tag_names, $self_close);

        return sprintf("/%s/%s", $expr, $this->_re_flags);
    }

    /**
     * Given an HTML document string, this finds all the META tags in
     * the document, provided they are found in the
     * <HTML><HEAD>...</HEAD> section of the document.  The <HTML> tag
     * may be missing.
     *
     * @access private
     * @param string $html_string An HTMl document string
     * @return array $tag_list Array of tags; each tag is an array of
     * attribute -> value.
     */
    function getMetaTags($html_string)
    {
        $html_string = preg_replace($this->_removed_re,
                                    "",
                                    $html_string);

        $key_tags = array($this->tagPattern('html', false, false),
                          $this->tagPattern('head', false, false),
                          $this->tagPattern('head', true, false),
                          $this->tagPattern('html', true, false),
                          $this->tagPattern(array(
                          'body', 'frameset', 'frame', 'p', 'div',
                          'table','span','a'), 'maybe', 'maybe'));
        $key_tags_pos = array();
        foreach ($key_tags as $pat) {
            $matches = array();
            preg_match($pat, $html_string, $matches, PREG_OFFSET_CAPTURE);
            if($matches) {
                $key_tags_pos[] = $matches[0][1];
            } else {
                $key_tags_pos[] = null;
            }
        }
        // no opening head tag
        if (is_null($key_tags_pos[1])) {
            return array();
        }
        // the effective </head> is the min of the following
        if (is_null($key_tags_pos[2])) {
            $key_tags_pos[2] = strlen($html_string);
        }
        foreach (array($key_tags_pos[3], $key_tags_pos[4]) as $pos) {
            if (!is_null($pos) && $pos < $key_tags_pos[2]) {
                $key_tags_pos[2] = $pos;
            }
        }
        // closing head tag comes before opening head tag
        if ($key_tags_pos[1] > $key_tags_pos[2]) {
            return array();
        }
        // if there is an opening html tag, make sure the opening head tag
        // comes after it
        if (!is_null($key_tags_pos[0]) && $key_tags_pos[1] < $key_tags_pos[0]) {
            return array();
        }
        $html_string = substr($html_string, $key_tags_pos[1],
                              ($key_tags_pos[2]-$key_tags_pos[1]));

        $link_data = array();
        $link_matches = array();
        
        if (!preg_match_all($this->tagPattern('meta', false, 'maybe'),
                            $html_string, $link_matches)) {
            return array();
        }

        foreach ($link_matches[0] as $link) {
            $attr_matches = array();
            preg_match_all($this->_attr_find, $link, $attr_matches);
            $link_attrs = array();
            foreach ($attr_matches[0] as $index => $full_match) {
                $name = $attr_matches[1][$index];
                $value = $this->replaceEntities(
                              $this->removeQuotes($attr_matches[2][$index]));

                $link_attrs[strtolower($name)] = $value;
            }
            $link_data[] = $link_attrs;
        }

        return $link_data;
    }

    /**
     * Looks for a META tag with an "http-equiv" attribute whose value
     * is one of ("x-xrds-location", "x-yadis-location"), ignoring
     * case.  If such a META tag is found, its "content" attribute
     * value is returned.
     *
     * @param string $html_string An HTML document in string format
     * @return mixed $content The "content" attribute value of the
     * META tag, if found, or null if no such tag was found.
     */
    function getHTTPEquiv($html_string)
    {
        $meta_tags = $this->getMetaTags($html_string);

        if ($meta_tags) {
            foreach ($meta_tags as $tag) {
                if (array_key_exists('http-equiv', $tag) &&
                    (in_array(strtolower($tag['http-equiv']),
                              array('x-xrds-location', 'x-yadis-location'))) &&
                    array_key_exists('content', $tag)) {
                    return $tag['content'];
                }
            }
        }

        return null;
    }
}

