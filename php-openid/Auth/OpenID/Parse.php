<?php

/**
 * This module implements a VERY limited parser that finds <link> tags
 * in the head of HTML or XHTML documents and parses out their
 * attributes according to the OpenID spec. It is a liberal parser,
 * but it requires these things from the data in order to work:
 *
 * - There must be an open <html> tag
 *
 * - There must be an open <head> tag inside of the <html> tag
 *
 * - Only <link>s that are found inside of the <head> tag are parsed
 *   (this is by design)
 *
 * - The parser follows the OpenID specification in resolving the
 *   attributes of the link tags. This means that the attributes DO
 *   NOT get resolved as they would by an XML or HTML parser. In
 *   particular, only certain entities get replaced, and href
 *   attributes do not get resolved relative to a base URL.
 *
 * From http://openid.net/specs.bml:
 *
 * - The openid.server URL MUST be an absolute URL. OpenID consumers
 *   MUST NOT attempt to resolve relative URLs.
 *
 * - The openid.server URL MUST NOT include entities other than &amp;,
 *   &lt;, &gt;, and &quot;.
 *
 * The parser ignores SGML comments and <![CDATA[blocks]]>. Both kinds
 * of quoting are allowed for attributes.
 *
 * The parser deals with invalid markup in these ways:
 *
 * - Tag names are not case-sensitive
 *
 * - The <html> tag is accepted even when it is not at the top level
 *
 * - The <head> tag is accepted even when it is not a direct child of
 *   the <html> tag, but a <html> tag must be an ancestor of the
 *   <head> tag
 *
 * - <link> tags are accepted even when they are not direct children
 *   of the <head> tag, but a <head> tag must be an ancestor of the
 *   <link> tag
 *
 * - If there is no closing tag for an open <html> or <head> tag, the
 *   remainder of the document is viewed as being inside of the
 *   tag. If there is no closing tag for a <link> tag, the link tag is
 *   treated as a short tag. Exceptions to this rule are that <html>
 *   closes <html> and <body> or <head> closes <head>
 *
 * - Attributes of the <link> tag are not required to be quoted.
 *
 * - In the case of duplicated attribute names, the attribute coming
 *   last in the tag will be the value returned.
 *
 * - Any text that does not parse as an attribute within a link tag
 *   will be ignored. (e.g. <link pumpkin rel='openid.server' /> will
 *   ignore pumpkin)
 *
 * - If there are more than one <html> or <head> tag, the parser only
 *   looks inside of the first one.
 *
 * - The contents of <script> tags are ignored entirely, except
 *   unclosed <script> tags. Unclosed <script> tags are ignored.
 *
 * - Any other invalid markup is ignored, including unclosed SGML
 *   comments and unclosed <![CDATA[blocks.
 *
 * PHP versions 4 and 5
 *
 * LICENSE: See the COPYING file included in this distribution.
 *
 * @access private
 * @package OpenID
 * @author JanRain, Inc. <openid@janrain.com>
 * @copyright 2005-2008 Janrain, Inc.
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache
 */

/**
 * Require Auth_OpenID::arrayGet().
 */
require_once "Auth/OpenID.php";

class Auth_OpenID_Parse {

    /**
     * Specify some flags for use with regex matching.
     */
    var $_re_flags = "si";

    /**
     * Stuff to remove before we start looking for tags
     */
    var $_removed_re =
           "<!--.*?-->|<!\[CDATA\[.*?\]\]>|<script\b(?!:)[^>]*>.*?<\/script>";

    /**
     * Starts with the tag name at a word boundary, where the tag name
     * is not a namespace
     */
    var $_tag_expr = "<%s\b(?!:)([^>]*?)(?:\/>|>(.*)(?:<\/?%s\s*>|\Z))";

    var $_attr_find = '\b(\w+)=("[^"]*"|\'[^\']*\'|[^\'"\s\/<>]+)';

    var $_open_tag_expr = "<%s\b";
    var $_close_tag_expr = "<((\/%s\b)|(%s[^>\/]*\/))>";

    function Auth_OpenID_Parse()
    {
        $this->_link_find = sprintf("/<link\b(?!:)([^>]*)(?!<)>/%s",
                                    $this->_re_flags);

        $this->_entity_replacements = array(
                                            'amp' => '&',
                                            'lt' => '<',
                                            'gt' => '>',
                                            'quot' => '"'
                                            );

        $this->_attr_find = sprintf("/%s/%s",
                                    $this->_attr_find,
                                    $this->_re_flags);

        $this->_removed_re = sprintf("/%s/%s",
                                     $this->_removed_re,
                                     $this->_re_flags);

        $this->_ent_replace =
            sprintf("&(%s);", implode("|",
                                      $this->_entity_replacements));
    }

    /**
     * Returns a regular expression that will match a given tag in an
     * SGML string.
     */
    function tagMatcher($tag_name, $close_tags = null)
    {
        $expr = $this->_tag_expr;

        if ($close_tags) {
            $options = implode("|", array_merge(array($tag_name), $close_tags));
            $closer = sprintf("(?:%s)", $options);
        } else {
            $closer = $tag_name;
        }

        $expr = sprintf($expr, $tag_name, $closer);
        return sprintf("/%s/%s", $expr, $this->_re_flags);
    }

    function openTag($tag_name)
    {
        $expr = sprintf($this->_open_tag_expr, $tag_name);
        return sprintf("/%s/%s", $expr, $this->_re_flags);
    }

    function closeTag($tag_name)
    {
        $expr = sprintf($this->_close_tag_expr, $tag_name, $tag_name);
        return sprintf("/%s/%s", $expr, $this->_re_flags);
    }

    function htmlBegin($s)
    {
        $matches = array();
        $result = preg_match($this->openTag('html'), $s,
                             $matches, PREG_OFFSET_CAPTURE);
        if ($result === false || !$matches) {
            return false;
        }
        // Return the offset of the first match.
        return $matches[0][1];
    }

    function htmlEnd($s)
    {
        $matches = array();
        $result = preg_match($this->closeTag('html'), $s,
                             $matches, PREG_OFFSET_CAPTURE);
        if ($result === false || !$matches) {
            return false;
        }
        // Return the offset of the first match.
        return $matches[count($matches) - 1][1];
    }

    function headFind()
    {
        return $this->tagMatcher('head', array('body', 'html'));
    }

    function replaceEntities($str)
    {
        foreach ($this->_entity_replacements as $old => $new) {
            $str = preg_replace(sprintf("/&%s;/", $old), $new, $str);
        }
        return $str;
    }

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
    
    function match($regexp, $text, &$match)
    {
        if (!is_callable('mb_ereg_search_init')) {
            if (!preg_match($regexp, $text, $match)) {
                return false;
            }
            $match = $match[0];
            return true;
        }

        $regexp = substr($regexp, 1, strlen($regexp) - 2 - strlen($this->_re_flags));
        mb_ereg_search_init($text);
        if (!mb_ereg_search($regexp)) {
            return false;
        }
        $match = mb_ereg_search_getregs();
        return true;
    }

    /**
     * Find all link tags in a string representing a HTML document and
     * return a list of their attributes.
     *
     * @todo This is quite ineffective and may fail with the default
     *       pcre.backtrack_limit of 100000 in PHP 5.2, if $html is big.
     *       It should rather use stripos (in PHP5) or strpos()+strtoupper()
     *       in PHP4 to manage this.
     *
     * @param string $html The text to parse
     * @return array $list An array of arrays of attributes, one for each
     * link tag
     */
    function parseLinkAttrs($html)
    {
        $stripped = preg_replace($this->_removed_re,
                                 "",
                                 $html);

        $html_begin = $this->htmlBegin($stripped);
        $html_end = $this->htmlEnd($stripped);

        if ($html_begin === false) {
            return array();
        }

        if ($html_end === false) {
            $html_end = strlen($stripped);
        }

        $stripped = substr($stripped, $html_begin,
                           $html_end - $html_begin);

        // Workaround to prevent PREG_BACKTRACK_LIMIT_ERROR:
        $old_btlimit = ini_set( 'pcre.backtrack_limit', -1 );

        // Try to find the <HEAD> tag.
        $head_re = $this->headFind();
        $head_match = array();
        if (!$this->match($head_re, $stripped, $head_match)) {
                     ini_set( 'pcre.backtrack_limit', $old_btlimit );
                     return array();
        }

        $link_data = array();
        $link_matches = array();

        if (!preg_match_all($this->_link_find, $head_match[0],
                            $link_matches)) {
            ini_set( 'pcre.backtrack_limit', $old_btlimit );
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

        ini_set( 'pcre.backtrack_limit', $old_btlimit );
        return $link_data;
    }

    function relMatches($rel_attr, $target_rel)
    {
        // Does this target_rel appear in the rel_str?
        // XXX: TESTME
        $rels = preg_split("/\s+/", trim($rel_attr));
        foreach ($rels as $rel) {
            $rel = strtolower($rel);
            if ($rel == $target_rel) {
                return 1;
            }
        }

        return 0;
    }

    function linkHasRel($link_attrs, $target_rel)
    {
        // Does this link have target_rel as a relationship?
        // XXX: TESTME
        $rel_attr = Auth_OpeniD::arrayGet($link_attrs, 'rel', null);
        return ($rel_attr && $this->relMatches($rel_attr,
                                               $target_rel));
    }

    function findLinksRel($link_attrs_list, $target_rel)
    {
        // Filter the list of link attributes on whether it has
        // target_rel as a relationship.
        // XXX: TESTME
        $result = array();
        foreach ($link_attrs_list as $attr) {
            if ($this->linkHasRel($attr, $target_rel)) {
                $result[] = $attr;
            }
        }

        return $result;
    }

    function findFirstHref($link_attrs_list, $target_rel)
    {
        // Return the value of the href attribute for the first link
        // tag in the list that has target_rel as a relationship.
        // XXX: TESTME
        $matches = $this->findLinksRel($link_attrs_list,
                                       $target_rel);
        if (!$matches) {
            return null;
        }
        $first = $matches[0];
        return Auth_OpenID::arrayGet($first, 'href', null);
    }
}

function Auth_OpenID_legacy_discover($html_text, $server_rel,
                                     $delegate_rel)
{
    $p = new Auth_OpenID_Parse();

    $link_attrs = $p->parseLinkAttrs($html_text);

    $server_url = $p->findFirstHref($link_attrs,
                                    $server_rel);

    if ($server_url === null) {
        return false;
    } else {
        $delegate_url = $p->findFirstHref($link_attrs,
                                          $delegate_rel);
        return array($delegate_url, $server_url);
    }
}

