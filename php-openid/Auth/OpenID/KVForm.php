<?php

/**
 * OpenID protocol key-value/comma-newline format parsing and
 * serialization
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
 * Container for key-value/comma-newline OpenID format and parsing
 */
class Auth_OpenID_KVForm {
    /**
     * Convert an OpenID colon/newline separated string into an
     * associative array
     *
     * @static
     * @access private
     */
    static function toArray($kvs, $strict=false)
    {
        $lines = explode("\n", $kvs);

        $last = array_pop($lines);
        if ($last !== '') {
            array_push($lines, $last);
            if ($strict) {
                return false;
            }
        }

        $values = array();

        for ($lineno = 0; $lineno < count($lines); $lineno++) {
            $line = $lines[$lineno];
            $kv = explode(':', $line, 2);
            if (count($kv) != 2) {
                if ($strict) {
                    return false;
                }
                continue;
            }

            $key = $kv[0];
            $tkey = trim($key);
            if ($tkey != $key) {
                if ($strict) {
                    return false;
                }
            }

            $value = $kv[1];
            $tval = trim($value);
            if ($tval != $value) {
                if ($strict) {
                    return false;
                }
            }

            $values[$tkey] = $tval;
        }

        return $values;
    }

    /**
     * Convert an array into an OpenID colon/newline separated string
     *
     * @static
     * @access private
     */
    static function fromArray($values)
    {
        if ($values === null) {
            return null;
        }

        ksort($values);

        $serialized = '';
        foreach ($values as $key => $value) {
            if (is_array($value)) {
                list($key, $value) = array($value[0], $value[1]);
            }

            if (strpos($key, ':') !== false) {
                return null;
            }

            if (strpos($key, "\n") !== false) {
                return null;
            }

            if (strpos($value, "\n") !== false) {
                return null;
            }
            $serialized .= "$key:$value\n";
        }
        return $serialized;
    }
}

