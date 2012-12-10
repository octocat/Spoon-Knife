<?php

/**
 * Tests for the CryptUtil functions.
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

require_once 'Auth/OpenID.php';
require_once 'Auth/OpenID/CryptUtil.php';

class Tests_Auth_OpenID_CryptUtil extends PHPUnit_Framework_TestCase {
    function test_length()
    {
        $cases = array(1, 10, 255);
        foreach ($cases as $length) {
            $data = Auth_OpenID_CryptUtil::getBytes($length);
            $this->assertEquals(Auth_OpenID::bytes($data), $length);
        }
    }

    function test_different()
    {
        $num_iterations = 100;
        $data_length = 20;

        $data = Auth_OpenID_CryptUtil::getBytes($num_iterations);
        for ($i = 0; $i < $num_iterations; $i++) {
            $last = $data;
            $data = Auth_OpenID_CryptUtil::getBytes($data_length);
            $this->assertFalse($data == $last);
        }
    }

    function test_cryptrand()
    {
        // It's possible, but HIGHLY unlikely that a correct
        // implementation will fail by returning the same number twice

        $s = Auth_OpenID_CryptUtil::getBytes(32);
        $t = Auth_OpenID_CryptUtil::getBytes(32);
        $this->assertEquals(Auth_OpenID::bytes($s), 32);
        $this->assertEquals(Auth_OpenID::bytes($t), 32);
        $this->assertFalse($s == $t);
    }
}

