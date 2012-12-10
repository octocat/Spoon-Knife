<?php

/**
 * This module contains the CURL-based HTTP fetcher implementation.
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
 * Interface import
 */
require_once "Auth/Yadis/HTTPFetcher.php";

require_once "Auth/OpenID.php";

/**
 * A paranoid {@link Auth_Yadis_HTTPFetcher} class which uses CURL
 * for fetching.
 *
 * @package OpenID
 */
class Auth_Yadis_ParanoidHTTPFetcher extends Auth_Yadis_HTTPFetcher {
    function Auth_Yadis_ParanoidHTTPFetcher()
    {
        $this->reset();
    }

    function reset()
    {
        $this->headers = array();
        $this->data = "";
    }

    /**
     * @access private
     */
    function _writeHeader($ch, $header)
    {
        array_push($this->headers, rtrim($header));
        return strlen($header);
    }

    /**
     * @access private
     */
    function _writeData($ch, $data)
    {
        if (strlen($this->data) > 1024*Auth_OpenID_FETCHER_MAX_RESPONSE_KB) {
            return 0;
        } else {
            $this->data .= $data;
            return strlen($data);
        }
    }

    /**
     * Does this fetcher support SSL URLs?
     */
    function supportsSSL()
    {
        $v = curl_version();
        if(is_array($v)) {
            return in_array('https', $v['protocols']);
        } elseif (is_string($v)) {
            return preg_match('/OpenSSL/i', $v);
        } else {
            return 0;
        }
    }

    function get($url, $extra_headers = null)
    {
        if (!$this->canFetchURL($url)) {
            return null;
        }

        $stop = time() + $this->timeout;
        $off = $this->timeout;

        $redir = true;

        while ($redir && ($off > 0)) {
            $this->reset();

            $c = curl_init();

            if ($c === false) {
                Auth_OpenID::log(
                    "curl_init returned false; could not " .
                    "initialize for URL '%s'", $url);
                return null;
            }

            if (defined('CURLOPT_NOSIGNAL')) {
                curl_setopt($c, CURLOPT_NOSIGNAL, true);
            }

            if (!$this->allowedURL($url)) {
                Auth_OpenID::log("Fetching URL not allowed: %s",
                                 $url);
                return null;
            }

            curl_setopt($c, CURLOPT_WRITEFUNCTION,
                        array($this, "_writeData"));
            curl_setopt($c, CURLOPT_HEADERFUNCTION,
                        array($this, "_writeHeader"));

            if ($extra_headers) {
                curl_setopt($c, CURLOPT_HTTPHEADER, $extra_headers);
            }

            $cv = curl_version();
            if(is_array($cv)) {
              $curl_user_agent = 'curl/'.$cv['version'];
            } else {
              $curl_user_agent = $cv;
            }
            curl_setopt($c, CURLOPT_USERAGENT,
                        Auth_OpenID_USER_AGENT.' '.$curl_user_agent);
            curl_setopt($c, CURLOPT_TIMEOUT, $off);
            curl_setopt($c, CURLOPT_URL, $url);

            if (defined('Auth_OpenID_VERIFY_HOST')) {
                // set SSL verification options only if Auth_OpenID_VERIFY_HOST
                // is explicitly set, otherwise use system default.
                if (Auth_OpenID_VERIFY_HOST) {
                    curl_setopt($c, CURLOPT_SSL_VERIFYPEER, true);
                    curl_setopt($c, CURLOPT_SSL_VERIFYHOST, 2);
                    if (defined('Auth_OpenID_CAINFO')) {
                        curl_setopt($c, CURLOPT_CAINFO, Auth_OpenID_CAINFO);
                    }
                } else {
                    curl_setopt($c, CURLOPT_SSL_VERIFYPEER, false);
                }
            }
            if (defined('Auth_OpenID_HTTP_PROXY')) {
                curl_setopt($c, CURLOPT_PROXY, Auth_OpenID_HTTP_PROXY);
            }
            curl_exec($c);

            $code = curl_getinfo($c, CURLINFO_HTTP_CODE);
            $body = $this->data;
            $headers = $this->headers;

            if (!$code) {
                Auth_OpenID::log("Got no response code when fetching %s", $url);
                Auth_OpenID::log("CURL error (%s): %s",
                                 curl_errno($c), curl_error($c));
                return null;
            }

            if (in_array($code, array(301, 302, 303, 307))) {
                $url = $this->_findRedirect($headers, $url);
                $redir = true;
            } else {
                $redir = false;
                curl_close($c);

                if (defined('Auth_OpenID_VERIFY_HOST') &&
                    Auth_OpenID_VERIFY_HOST == true &&
                    $this->isHTTPS($url)) {
                    Auth_OpenID::log('OpenID: Verified SSL host %s using '.
                                     'curl/get', $url);
                }
                $new_headers = array();

                foreach ($headers as $header) {
                    if (strpos($header, ': ')) {
                        list($name, $value) = explode(': ', $header, 2);
                        $new_headers[$name] = $value;
                    }
                }

                Auth_OpenID::log(
                    "Successfully fetched '%s': GET response code %s",
                    $url, $code);

                return new Auth_Yadis_HTTPResponse($url, $code,
                                                    $new_headers, $body);
            }

            $off = $stop - time();
        }

        return null;
    }

    function post($url, $body, $extra_headers = null)
    {
        if (!$this->canFetchURL($url)) {
            return null;
        }

        $this->reset();

        $c = curl_init();

        if (defined('CURLOPT_NOSIGNAL')) {
            curl_setopt($c, CURLOPT_NOSIGNAL, true);
        }

        if (defined('Auth_OpenID_HTTP_PROXY')) {
            curl_setopt($c, CURLOPT_PROXY, Auth_OpenID_HTTP_PROXY);
        }

        curl_setopt($c, CURLOPT_POST, true);
        curl_setopt($c, CURLOPT_POSTFIELDS, $body);
        curl_setopt($c, CURLOPT_TIMEOUT, $this->timeout);
        curl_setopt($c, CURLOPT_URL, $url);
        curl_setopt($c, CURLOPT_WRITEFUNCTION,
                    array($this, "_writeData"));

        if (defined('Auth_OpenID_VERIFY_HOST')) {
            // set SSL verification options only if Auth_OpenID_VERIFY_HOST
            // is explicitly set, otherwise use system default.
            if (Auth_OpenID_VERIFY_HOST) {
                curl_setopt($c, CURLOPT_SSL_VERIFYPEER, true);
                curl_setopt($c, CURLOPT_SSL_VERIFYHOST, 2);
                if (defined('Auth_OpenID_CAINFO')) {
                    curl_setopt($c, CURLOPT_CAINFO, Auth_OpenID_CAINFO);
                }
            } else {
                curl_setopt($c, CURLOPT_SSL_VERIFYPEER, false);
            }
        }

        curl_exec($c);

        $code = curl_getinfo($c, CURLINFO_HTTP_CODE);

        if (!$code) {
            Auth_OpenID::log("Got no response code when fetching %s", $url);
            Auth_OpenID::log("CURL error (%s): %s",
                             curl_errno($c), curl_error($c));
            return null;
        }

        if (defined('Auth_OpenID_VERIFY_HOST') &&
            Auth_OpenID_VERIFY_HOST == true &&
            $this->isHTTPS($url)) {
            Auth_OpenID::log('OpenID: Verified SSL host %s using '.
                             'curl/post', $url);
        }
        $body = $this->data;

        curl_close($c);

        $new_headers = $extra_headers;

        foreach ($this->headers as $header) {
            if (strpos($header, ': ')) {
                list($name, $value) = explode(': ', $header, 2);
                $new_headers[$name] = $value;
            }

        }

        Auth_OpenID::log("Successfully fetched '%s': POST response code %s",
                         $url, $code);

        return new Auth_Yadis_HTTPResponse($url, $code,
                                           $new_headers, $body);
    }
}

