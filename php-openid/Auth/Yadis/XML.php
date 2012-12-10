<?php

/**
 * XML-parsing classes to wrap the domxml and DOM extensions for PHP 4
 * and 5, respectively.
 *
 * @package OpenID
 */

/**
 * The base class for wrappers for available PHP XML-parsing
 * extensions.  To work with this Yadis library, subclasses of this
 * class MUST implement the API as defined in the remarks for this
 * class.  Subclasses of Auth_Yadis_XMLParser are used to wrap
 * particular PHP XML extensions such as 'domxml'.  These are used
 * internally by the library depending on the availability of
 * supported PHP XML extensions.
 *
 * @package OpenID
 */
class Auth_Yadis_XMLParser {
    /**
     * Initialize an instance of Auth_Yadis_XMLParser with some
     * XML and namespaces.  This SHOULD NOT be overridden by
     * subclasses.
     *
     * @param string $xml_string A string of XML to be parsed.
     * @param array $namespace_map An array of ($ns_name => $ns_uri)
     * to be registered with the XML parser.  May be empty.
     * @return boolean $result True if the initialization and
     * namespace registration(s) succeeded; false otherwise.
     */
    function init($xml_string, $namespace_map)
    {
        if (!$this->setXML($xml_string)) {
            return false;
        }

        foreach ($namespace_map as $prefix => $uri) {
            if (!$this->registerNamespace($prefix, $uri)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Register a namespace with the XML parser.  This should be
     * overridden by subclasses.
     *
     * @param string $prefix The namespace prefix to appear in XML tag
     * names.
     *
     * @param string $uri The namespace URI to be used to identify the
     * namespace in the XML.
     *
     * @return boolean $result True if the registration succeeded;
     * false otherwise.
     */
    function registerNamespace($prefix, $uri)
    {
        // Not implemented.
    }

    /**
     * Set this parser object's XML payload.  This should be
     * overridden by subclasses.
     *
     * @param string $xml_string The XML string to pass to this
     * object's XML parser.
     *
     * @return boolean $result True if the initialization succeeded;
     * false otherwise.
     */
    function setXML($xml_string)
    {
        // Not implemented.
    }

    /**
     * Evaluate an XPath expression and return the resulting node
     * list.  This should be overridden by subclasses.
     *
     * @param string $xpath The XPath expression to be evaluated.
     *
     * @param mixed $node A node object resulting from a previous
     * evalXPath call.  This node, if specified, provides the context
     * for the evaluation of this xpath expression.
     *
     * @return array $node_list An array of matching opaque node
     * objects to be used with other methods of this parser class.
     */
    function &evalXPath($xpath, $node = null)
    {
        // Not implemented.
    }

    /**
     * Return the textual content of a specified node.
     *
     * @param mixed $node A node object from a previous call to
     * $this->evalXPath().
     *
     * @return string $content The content of this node.
     */
    function content($node)
    {
        // Not implemented.
    }

    /**
     * Return the attributes of a specified node.
     *
     * @param mixed $node A node object from a previous call to
     * $this->evalXPath().
     *
     * @return array $attrs An array mapping attribute names to
     * values.
     */
    function attributes($node)
    {
        // Not implemented.
    }
}

/**
 * This concrete implementation of Auth_Yadis_XMLParser implements
 * the appropriate API for the 'domxml' extension which is typically
 * packaged with PHP 4.  This class will be used whenever the 'domxml'
 * extension is detected.  See the Auth_Yadis_XMLParser class for
 * details on this class's methods.
 *
 * @package OpenID
 */
class Auth_Yadis_domxml extends Auth_Yadis_XMLParser {
    function Auth_Yadis_domxml()
    {
        $this->xml = null;
        $this->doc = null;
        $this->xpath = null;
        $this->errors = array();
    }

    function setXML($xml_string)
    {
        $this->xml = $xml_string;
        $this->doc = @domxml_open_mem($xml_string, DOMXML_LOAD_PARSING,
                                      $this->errors);

        if (!$this->doc) {
            return false;
        }

        $this->xpath = $this->doc->xpath_new_context();

        return true;
    }

    function registerNamespace($prefix, $uri)
    {
        return xpath_register_ns($this->xpath, $prefix, $uri);
    }

    function &evalXPath($xpath, $node = null)
    {
        if ($node) {
            $result = @$this->xpath->xpath_eval($xpath, $node);
        } else {
            $result = @$this->xpath->xpath_eval($xpath);
        }

        if (!$result) {
            $n = array();
            return $n;
        }

        if (!$result->nodeset) {
            $n = array();
            return $n;
        }

        return $result->nodeset;
    }

    function content($node)
    {
        if ($node) {
            return $node->get_content();
        }
    }

    function attributes($node)
    {
        if ($node) {
            $arr = $node->attributes();
            $result = array();

            if ($arr) {
                foreach ($arr as $attrnode) {
                    $result[$attrnode->name] = $attrnode->value;
                }
            }

            return $result;
        }
    }
}

/**
 * This concrete implementation of Auth_Yadis_XMLParser implements
 * the appropriate API for the 'dom' extension which is typically
 * packaged with PHP 5.  This class will be used whenever the 'dom'
 * extension is detected.  See the Auth_Yadis_XMLParser class for
 * details on this class's methods.
 *
 * @package OpenID
 */
class Auth_Yadis_dom extends Auth_Yadis_XMLParser {
    function Auth_Yadis_dom()
    {
        $this->xml = null;
        $this->doc = null;
        $this->xpath = null;
        $this->errors = array();
    }

    function setXML($xml_string)
    {
        $this->xml = $xml_string;
        $this->doc = new DOMDocument;

        if (!$this->doc) {
            return false;
        }

        if (!@$this->doc->loadXML($xml_string)) {
            return false;
        }

        $this->xpath = new DOMXPath($this->doc);

        if ($this->xpath) {
            return true;
        } else {
            return false;
        }
    }

    function registerNamespace($prefix, $uri)
    {
        return $this->xpath->registerNamespace($prefix, $uri);
    }

    function &evalXPath($xpath, $node = null)
    {
        if ($node) {
            $result = @$this->xpath->query($xpath, $node);
        } else {
            $result = @$this->xpath->query($xpath);
        }

        $n = array();

        if (!$result) {
            return $n;
        }

        for ($i = 0; $i < $result->length; $i++) {
            $n[] = $result->item($i);
        }

        return $n;
    }

    function content($node)
    {
        if ($node) {
            return $node->textContent;
        }
    }

    function attributes($node)
    {
        if ($node) {
            $arr = $node->attributes;
            $result = array();

            if ($arr) {
                for ($i = 0; $i < $arr->length; $i++) {
                    $node = $arr->item($i);
                    $result[$node->nodeName] = $node->nodeValue;
                }
            }

            return $result;
        }
    }
}

global $__Auth_Yadis_defaultParser;
$__Auth_Yadis_defaultParser = null;

/**
 * Set a default parser to override the extension-driven selection of
 * available parser classes.  This is helpful in a test environment or
 * one in which multiple parsers can be used but one is more
 * desirable.
 *
 * @param Auth_Yadis_XMLParser $parser An instance of a
 * Auth_Yadis_XMLParser subclass.
 */
function Auth_Yadis_setDefaultParser($parser)
{
    global $__Auth_Yadis_defaultParser;
    $__Auth_Yadis_defaultParser = $parser;
}

function Auth_Yadis_getSupportedExtensions()
{
    return array('dom'    => 'Auth_Yadis_dom',
                 'domxml' => 'Auth_Yadis_domxml');
}

/**
 * Returns an instance of a Auth_Yadis_XMLParser subclass based on
 * the availability of PHP extensions for XML parsing.  If
 * Auth_Yadis_setDefaultParser has been called, the parser used in
 * that call will be returned instead.
 */
function Auth_Yadis_getXMLParser()
{
    global $__Auth_Yadis_defaultParser;
    
    if (isset($__Auth_Yadis_defaultParser)) {
        return $__Auth_Yadis_defaultParser;
    }
    
    foreach(Auth_Yadis_getSupportedExtensions() as $extension => $classname)
    {
      if (extension_loaded($extension))
      {
        $p = new $classname();
        Auth_Yadis_setDefaultParser($p);
        return $p;
      }
    }
    
    return false;
}


