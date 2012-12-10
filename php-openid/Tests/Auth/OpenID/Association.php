<?php

/**
 * Tests for the Association implementation.
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

require_once 'Auth/OpenID/Association.php';

class Tests_Auth_OpenID_Association extends PHPUnit_Framework_TestCase {
    function test_me()
    {
        $issued = time();
        $lifetime = 600;
        $assoc = new Auth_OpenID_Association('handle', 'secret', $issued,
                                            $lifetime, 'HMAC-SHA1');
        $s = $assoc->serialize();
        $assoc2 = Auth_OpenID_Association::deserialize(
            'Auth_OpenID_Association', $s);

        if ($assoc2 === null) {
            $this->fail('deserialize returned null');
        } else {
            $this->assertTrue($assoc2->equal($assoc));
        }
    }
    function test_me256()
    {
        if(!Auth_OpenID_HMACSHA256_SUPPORTED) return;
        $issued = time();
        $lifetime = 600;
        $assoc = new Auth_OpenID_Association('handle', 'secret', $issued,
                                            $lifetime, 'HMAC-SHA256');
        $s = $assoc->serialize();
        $assoc2 = Auth_OpenID_Association::deserialize(
            'Auth_OpenID_Association', $s);

        if ($assoc2 === null) {
            $this->fail('deserialize returned null');
        } else {
            $this->assertTrue($assoc2->equal($assoc));
        }
    }
}


