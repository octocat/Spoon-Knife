<?php

/**
 * This is the PHP OpenID library by JanRain, Inc.
 *
 * This module contains core utility functionality used by the
 * library.  See Consumer.php and Server.php for the consumer and
 * server implementations.
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
 * The library version string
 */
define('Auth_OpenID_VERSION', '2.2.2');

/**
 * Require the fetcher code.
 */
require_once "Auth/Yadis/PlainHTTPFetcher.php";
require_once "Auth/Yadis/ParanoidHTTPFetcher.php";
require_once "Auth/OpenID/BigMath.php";
require_once "Auth/OpenID/URINorm.php";

/**
 * Status code returned by the server when the only option is to show
 * an error page, since we do not have enough information to redirect
 * back to the consumer. The associated value is an error message that
 * should be displayed on an HTML error page.
 *
 * @see Auth_OpenID_Server
 */
define('Auth_OpenID_LOCAL_ERROR', 'local_error');

/**
 * Status code returned when there is an error to return in key-value
 * form to the consumer. The caller should return a 400 Bad Request
 * response with content-type text/plain and the value as the body.
 *
 * @see Auth_OpenID_Server
 */
define('Auth_OpenID_REMOTE_ERROR', 'remote_error');

/**
 * Status code returned when there is a key-value form OK response to
 * the consumer. The value associated with this code is the
 * response. The caller should return a 200 OK response with
 * content-type text/plain and the value as the body.
 *
 * @see Auth_OpenID_Server
 */
define('Auth_OpenID_REMOTE_OK', 'remote_ok');

/**
 * Status code returned when there is a redirect back to the
 * consumer. The value is the URL to redirect back to. The caller
 * should return a 302 Found redirect with a Location: header
 * containing the URL.
 *
 * @see Auth_OpenID_Server
 */
define('Auth_OpenID_REDIRECT', 'redirect');

/**
 * Status code returned when the caller needs to authenticate the
 * user. The associated value is a {@link Auth_OpenID_ServerRequest}
 * object that can be used to complete the authentication. If the user
 * has taken some authentication action, use the retry() method of the
 * {@link Auth_OpenID_ServerRequest} object to complete the request.
 *
 * @see Auth_OpenID_Server
 */
define('Auth_OpenID_DO_AUTH', 'do_auth');

/**
 * Status code returned when there were no OpenID arguments
 * passed. This code indicates that the caller should return a 200 OK
 * response and display an HTML page that says that this is an OpenID
 * server endpoint.
 *
 * @see Auth_OpenID_Server
 */
define('Auth_OpenID_DO_ABOUT', 'do_about');

/**
 * Defines for regexes and format checking.
 */
define('Auth_OpenID_letters',
       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

define('Auth_OpenID_digits',
       "0123456789");

define('Auth_OpenID_punct',
       "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");

Auth_OpenID_include_init();

/**
 * The OpenID utility function class.
 *
 * @package OpenID
 * @access private
 */
class Auth_OpenID {

    /**
     * Return true if $thing is an Auth_OpenID_FailureResponse object;
     * false if not.
     *
     * @access private
     */
    static function isFailure($thing)
    {
        return is_a($thing, 'Auth_OpenID_FailureResponse');
    }

    /**
     * Gets the query data from the server environment based on the
     * request method used.  If GET was used, this looks at
     * $_SERVER['QUERY_STRING'] directly.  If POST was used, this
     * fetches data from the special php://input file stream.
     *
     * Returns an associative array of the query arguments.
     *
     * Skips invalid key/value pairs (i.e. keys with no '=value'
     * portion).
     *
     * Returns an empty array if neither GET nor POST was used, or if
     * POST was used but php://input cannot be opened.
     *
     * See background:
     * http://lists.openidenabled.com/pipermail/dev/2007-March/000395.html
     *
     * @access private
     */
    static function getQuery($query_str=null)
    {
        $data = array();

        if ($query_str !== null) {
            $data = Auth_OpenID::params_from_string($query_str);
        } else if (!array_key_exists('REQUEST_METHOD', $_SERVER)) {
            // Do nothing.
        } else {
          // XXX HACK FIXME HORRIBLE.
          //
          // POSTing to a URL with query parameters is acceptable, but
          // we don't have a clean way to distinguish those parameters
          // when we need to do things like return_to verification
          // which only want to look at one kind of parameter.  We're
          // going to emulate the behavior of some other environments
          // by defaulting to GET and overwriting with POST if POST
          // data is available.
          $data = Auth_OpenID::params_from_string($_SERVER['QUERY_STRING']);

          if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $str = file_get_contents('php://input');

            if ($str === false) {
              $post = array();
            } else {
              $post = Auth_OpenID::params_from_string($str);
            }

            $data = array_merge($data, $post);
          }
        }

        return $data;
    }

    static function params_from_string($str)
    {
        $chunks = explode("&", $str);

        $data = array();
        foreach ($chunks as $chunk) {
            $parts = explode("=", $chunk, 2);

            if (count($parts) != 2) {
                continue;
            }

            list($k, $v) = $parts;
            $data[urldecode($k)] = urldecode($v);
        }

        return $data;
    }

    /**
     * Create dir_name as a directory if it does not exist. If it
     * exists, make sure that it is, in fact, a directory.  Returns
     * true if the operation succeeded; false if not.
     *
     * @access private
     */
    static function ensureDir($dir_name)
    {
        if (is_dir($dir_name) || @mkdir($dir_name)) {
            return true;
        } else {
            $parent_dir = dirname($dir_name);

            // Terminal case; there is no parent directory to create.
            if ($parent_dir == $dir_name) {
                return true;
            }

            return (Auth_OpenID::ensureDir($parent_dir) && @mkdir($dir_name));
        }
    }

    /**
     * Adds a string prefix to all values of an array.  Returns a new
     * array containing the prefixed values.
     *
     * @access private
     */
    static function addPrefix($values, $prefix)
    {
        $new_values = array();
        foreach ($values as $s) {
            $new_values[] = $prefix . $s;
        }
        return $new_values;
    }

    /**
     * Convenience function for getting array values.  Given an array
     * $arr and a key $key, get the corresponding value from the array
     * or return $default if the key is absent.
     *
     * @access private
     */
    static function arrayGet($arr, $key, $fallback = null)
    {
        if (is_array($arr)) {
            if (array_key_exists($key, $arr)) {
                return $arr[$key];
            } else {
                return $fallback;
            }
        } else {
            trigger_error("Auth_OpenID::arrayGet (key = ".$key.") expected " .
                          "array as first parameter, got " .
                          gettype($arr), E_USER_WARNING);

            return false;
        }
    }

    /**
     * Replacement for PHP's broken parse_str.
     */
    static function parse_str($query)
    {
        if ($query === null) {
            return null;
        }

        $parts = explode('&', $query);

        $new_parts = array();
        for ($i = 0; $i < count($parts); $i++) {
            $pair = explode('=', $parts[$i]);

            if (count($pair) != 2) {
                continue;
            }

            list($key, $value) = $pair;
            $new_parts[urldecode($key)] = urldecode($value);
        }

        return $new_parts;
    }

    /**
     * Implements the PHP 5 'http_build_query' functionality.
     *
     * @access private
     * @param array $data Either an array key/value pairs or an array
     * of arrays, each of which holding two values: a key and a value,
     * sequentially.
     * @return string $result The result of url-encoding the key/value
     * pairs from $data into a URL query string
     * (e.g. "username=bob&id=56").
     */
    static function httpBuildQuery($data)
    {
        $pairs = array();
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $pairs[] = urlencode($value[0])."=".urlencode($value[1]);
            } else {
                $pairs[] = urlencode($key)."=".urlencode($value);
            }
        }
        return implode("&", $pairs);
    }

    /**
     * "Appends" query arguments onto a URL.  The URL may or may not
     * already have arguments (following a question mark).
     *
     * @access private
     * @param string $url A URL, which may or may not already have
     * arguments.
     * @param array $args Either an array key/value pairs or an array of
     * arrays, each of which holding two values: a key and a value,
     * sequentially.  If $args is an ordinary key/value array, the
     * parameters will be added to the URL in sorted alphabetical order;
     * if $args is an array of arrays, their order will be preserved.
     * @return string $url The original URL with the new parameters added.
     *
     */
    static function appendArgs($url, $args)
    {
        if (count($args) == 0) {
            return $url;
        }

        // Non-empty array; if it is an array of arrays, use
        // multisort; otherwise use sort.
        if (array_key_exists(0, $args) &&
            is_array($args[0])) {
            // Do nothing here.
        } else {
            $keys = array_keys($args);
            sort($keys);
            $new_args = array();
            foreach ($keys as $key) {
                $new_args[] = array($key, $args[$key]);
            }
            $args = $new_args;
        }

        $sep = '?';
        if (strpos($url, '?') !== false) {
            $sep = '&';
        }

        return $url . $sep . Auth_OpenID::httpBuildQuery($args);
    }

    /**
     * Implements python's urlunparse, which is not available in PHP.
     * Given the specified components of a URL, this function rebuilds
     * and returns the URL.
     *
     * @access private
     * @param string $scheme The scheme (e.g. 'http').  Defaults to 'http'.
     * @param string $host The host.  Required.
     * @param string $port The port.
     * @param string $path The path.
     * @param string $query The query.
     * @param string $fragment The fragment.
     * @return string $url The URL resulting from assembling the
     * specified components.
     */
    static function urlunparse($scheme, $host, $port = null, $path = '/',
                        $query = '', $fragment = '')
    {

        if (!$scheme) {
            $scheme = 'http';
        }

        if (!$host) {
            return false;
        }

        if (!$path) {
            $path = '';
        }

        $result = $scheme . "://" . $host;

        if ($port) {
            $result .= ":" . $port;
        }

        $result .= $path;

        if ($query) {
            $result .= "?" . $query;
        }

        if ($fragment) {
            $result .= "#" . $fragment;
        }

        return $result;
    }

    /**
     * Given a URL, this "normalizes" it by adding a trailing slash
     * and / or a leading http:// scheme where necessary.  Returns
     * null if the original URL is malformed and cannot be normalized.
     *
     * @access private
     * @param string $url The URL to be normalized.
     * @return mixed $new_url The URL after normalization, or null if
     * $url was malformed.
     */
    static function normalizeUrl($url)
    {
        @$parsed = parse_url($url);

        if (!$parsed) {
            return null;
        }

        if (isset($parsed['scheme']) &&
            isset($parsed['host'])) {
            $scheme = strtolower($parsed['scheme']);
            if (!in_array($scheme, array('http', 'https'))) {
                return null;
            }
        } else {
            $url = 'http://' . $url;
        }

        $normalized = Auth_OpenID_urinorm($url);
        if ($normalized === null) {
            return null;
        }
        list($defragged, $frag) = Auth_OpenID::urldefrag($normalized);
        return $defragged;
    }

    /**
     * Replacement (wrapper) for PHP's intval() because it's broken.
     *
     * @access private
     */
    static function intval($value)
    {
        $re = "/^\\d+$/";

        if (!preg_match($re, $value)) {
            return false;
        }

        return intval($value);
    }

    /**
     * Count the number of bytes in a string independently of
     * multibyte support conditions.
     *
     * @param string $str The string of bytes to count.
     * @return int The number of bytes in $str.
     */
    static function bytes($str)
    {
        return strlen(bin2hex($str)) / 2;
    }

    /**
     * Get the bytes in a string independently of multibyte support
     * conditions.
     */
    static function toBytes($str)
    {
        $hex = bin2hex($str);

        if (!$hex) {
            return array();
        }

        $b = array();
        for ($i = 0; $i < strlen($hex); $i += 2) {
            $b[] = chr(base_convert(substr($hex, $i, 2), 16, 10));
        }

        return $b;
    }

    static function urldefrag($url)
    {
        $parts = explode("#", $url, 2);

        if (count($parts) == 1) {
            return array($parts[0], "");
        } else {
            return $parts;
        }
    }

    static function filter($callback, &$sequence)
    {
        $result = array();

        foreach ($sequence as $item) {
            if (call_user_func_array($callback, array($item))) {
                $result[] = $item;
            }
        }

        return $result;
    }

    static function update(&$dest, &$src)
    {
        foreach ($src as $k => $v) {
            $dest[$k] = $v;
        }
    }

    /**
     * Wrap PHP's standard error_log functionality.  Use this to
     * perform all logging. It will interpolate any additional
     * arguments into the format string before logging.
     *
     * @param string $format_string The sprintf format for the message
     */
    static function log($format_string)
    {
        $args = func_get_args();
        $message = call_user_func_array('sprintf', $args);
        error_log($message);
    }

    static function autoSubmitHTML($form, $title="OpenId transaction in progress")
    {
        return("<html>".
               "<head><title>".
               $title .
               "</title></head>".
               "<body onload='document.forms[0].submit();'>".
               $form .
               "<script>".
               "var elements = document.forms[0].elements;".
               "for (var i = 0; i < elements.length; i++) {".
               "  elements[i].style.display = \"none\";".
               "}".
               "</script>".
               "</body>".
               "</html>");
    }
}

/*
 * Function to run when this file is included.
 * Abstracted to a function to make life easier
 * for some PHP optimizers.
 */
function Auth_OpenID_include_init() {
  if (Auth_OpenID_getMathLib() === null) {
    Auth_OpenID_setNoMathSupport();
  }
}
