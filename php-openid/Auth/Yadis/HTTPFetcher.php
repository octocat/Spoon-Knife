<?php

/**
 * This module contains the HTTP fetcher interface
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
 * Require logging functionality
 */
require_once "Auth/OpenID.php";

define('Auth_OpenID_FETCHER_MAX_RESPONSE_KB', 1024);
define('Auth_OpenID_USER_AGENT', 
       'php-openid/'.Auth_OpenID_VERSION.' (php/'.phpversion().')');

class Auth_Yadis_HTTPResponse {
    function Auth_Yadis_HTTPResponse($final_url = null, $status = null,
                                         $headers = null, $body = null)
    {
        $this->final_url = $final_url;
        $this->status = $status;
        $this->headers = $headers;
        $this->body = $body;
    }
}

/**
 * This class is the interface for HTTP fetchers the Yadis library
 * uses.  This interface is only important if you need to write a new
 * fetcher for some reason.
 *
 * @access private
 * @package OpenID
 */
class Auth_Yadis_HTTPFetcher {

    var $timeout = 20; // timeout in seconds.

    /**
     * Return whether a URL can be fetched.  Returns false if the URL
     * scheme is not allowed or is not supported by this fetcher
     * implementation; returns true otherwise.
     *
     * @return bool
     */
    function canFetchURL($url)
    {
        if ($this->isHTTPS($url) && !$this->supportsSSL()) {
            Auth_OpenID::log("HTTPS URL unsupported fetching %s",
                             $url);
            return false;
        }

        if (!$this->allowedURL($url)) {
            Auth_OpenID::log("URL fetching not allowed for '%s'",
                             $url);
            return false;
        }

        return true;
    }

    /**
     * Return whether a URL should be allowed. Override this method to
     * conform to your local policy.
     *
     * By default, will attempt to fetch any http or https URL.
     */
    function allowedURL($url)
    {
        return $this->URLHasAllowedScheme($url);
    }

    /**
     * Does this fetcher implementation (and runtime) support fetching
     * HTTPS URLs?  May inspect the runtime environment.
     *
     * @return bool $support True if this fetcher supports HTTPS
     * fetching; false if not.
     */
    function supportsSSL()
    {
        trigger_error("not implemented", E_USER_ERROR);
    }

    /**
     * Is this an https URL?
     *
     * @access private
     */
    function isHTTPS($url)
    {
        return (bool)preg_match('/^https:\/\//i', $url);
    }

    /**
     * Is this an http or https URL?
     *
     * @access private
     */
    function URLHasAllowedScheme($url)
    {
        return (bool)preg_match('/^https?:\/\//i', $url);
    }

    /**
     * @access private
     */
    function _findRedirect($headers, $url)
    {
        foreach ($headers as $line) {
            if (strpos(strtolower($line), "location: ") === 0) {
                $parts = explode(" ", $line, 2);
                $loc = $parts[1];
                $ppos = strpos($loc, "://");
                if ($ppos === false || $ppos > strpos($loc, "/")) {
                  /* no host; add it */
                  $hpos = strpos($url, "://");
                  $prt = substr($url, 0, $hpos+3);
                  $url = substr($url, $hpos+3);
                  if (substr($loc, 0, 1) == "/") {
                    /* absolute path */
                    $fspos = strpos($url, "/");
                    if ($fspos) $loc = $prt.substr($url, 0, $fspos).$loc;
                    else $loc = $prt.$url.$loc;
                  } else {
                    /* relative path */
                    $pp = $prt;
                    while (1) {
                      $xpos = strpos($url, "/");
                      if ($xpos === false) break;
                      $apos = strpos($url, "?");
                      if ($apos !== false && $apos < $xpos) break;
                      $apos = strpos($url, "&");
                      if ($apos !== false && $apos < $xpos) break;
                      $pp .= substr($url, 0, $xpos+1);
                      $url = substr($url, $xpos+1);
                    }
                    $loc = $pp.$loc;
                  }
                }
                return $loc;
            }
        }
        return null;
    }

    /**
     * Fetches the specified URL using optional extra headers and
     * returns the server's response.
     *
     * @param string $url The URL to be fetched.
     * @param array $extra_headers An array of header strings
     * (e.g. "Accept: text/html").
     * @return mixed $result An array of ($code, $url, $headers,
     * $body) if the URL could be fetched; null if the URL does not
     * pass the URLHasAllowedScheme check or if the server's response
     * is malformed.
     */
    function get($url, $headers = null)
    {
        trigger_error("not implemented", E_USER_ERROR);
    }
}

