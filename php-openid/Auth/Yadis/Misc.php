<?php

/**
 * Miscellaneous utility values and functions for OpenID and Yadis.
 *
 * @package OpenID
 * @author JanRain, Inc. <openid@janrain.com>
 * @copyright 2005-2008 Janrain, Inc.
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache
 */

function Auth_Yadis_getUCSChars()
{
    return array(
                 array(0xA0, 0xD7FF),
                 array(0xF900, 0xFDCF),
                 array(0xFDF0, 0xFFEF),
                 array(0x10000, 0x1FFFD),
                 array(0x20000, 0x2FFFD),
                 array(0x30000, 0x3FFFD),
                 array(0x40000, 0x4FFFD),
                 array(0x50000, 0x5FFFD),
                 array(0x60000, 0x6FFFD),
                 array(0x70000, 0x7FFFD),
                 array(0x80000, 0x8FFFD),
                 array(0x90000, 0x9FFFD),
                 array(0xA0000, 0xAFFFD),
                 array(0xB0000, 0xBFFFD),
                 array(0xC0000, 0xCFFFD),
                 array(0xD0000, 0xDFFFD),
                 array(0xE1000, 0xEFFFD)
                 );
}

function Auth_Yadis_getIPrivateChars()
{
    return array(
                 array(0xE000, 0xF8FF),
                 array(0xF0000, 0xFFFFD),
                 array(0x100000, 0x10FFFD)
                 );
}

function Auth_Yadis_pct_escape_unicode($char_match)
{
    $c = $char_match[0];
    $result = "";
    for ($i = 0; $i < strlen($c); $i++) {
        $result .= "%".sprintf("%X", ord($c[$i]));
    }
    return $result;
}

function Auth_Yadis_startswith($s, $stuff)
{
    return strpos($s, $stuff) === 0;
}

