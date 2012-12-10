<?php

/**
 * Tests for the Nonce implementation.
 *
 * PHP versions 4 and 5
 *
 * LICENSE: See the COPYING file included in this distribution.
 *
 * @package OpenID
 * @author JanRain, Inc. <openid@janrain.com>
 * @copyright 2006 Janrain, Inc.
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache
 */

require_once 'Auth/OpenID/Nonce.php';

define('Tests_Auth_OpenID_nonce_re',
       '/\A\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/');

class Tests_Auth_OpenID_Nonce extends PHPUnit_Framework_TestSuite {
    function Tests_Auth_OpenID_Nonce()
    {
        $this->addTestSuite('Tests_Auth_OpenID_NonceTests');
        $this->makeSplitTests();
        $this->makeCheckTimestampTests();
        $this->setName('Tests_Auth_OpenID_Nonce');
    }

    function makeSplitTests()
    {
        $cases = array(
                       '',
                       '1970-01-01T00:00:00+1:00',
                       '1969-01-01T00:00:00Z',
                       '1970-00-01T00:00:00Z',
                       '1970.01-01T00:00:00Z',
                       'Thu Sep  7 13:29:31 PDT 2006',
                       'monkeys',
                       );

        foreach ($cases as $nonce_str) {
            $this->_mkSplitTest($nonce_str);
        }
    }

    function _mkSplitTest($nonce_str)
    {
        $test = new Tests_Auth_OpenID_Nonce_BadSplitCase($nonce_str);
        $test->setName('BadNonceSplit ' . var_export($nonce_str, true));
        $this->addTest($test);
    }

    function makeCheckTimestampTests()
    {
        $cases = array(
                       // exact, no allowed skew
                       array('1970-01-01T00:00:00Z', 0, 0, true),

                       // exact, large skew
                       array('1970-01-01T00:00:00Z', 1000, 0, true),

                       // no allowed skew, one second old
                       array('1970-01-01T00:00:00Z', 0, 1, false),

                       // many seconds old, outside of skew
                       array('1970-01-01T00:00:00Z', 10, 50, false),

                       // one second old, one second skew allowed
                       array('1970-01-01T00:00:00Z', 1, 1, true),

                       // One second in the future, one second skew allowed
                       array('1970-01-01T00:00:02Z', 1, 1, true),

                       // two seconds in the future, one second skew allowed
                       array('1970-01-01T00:00:02Z', 1, 0, false),

                       // malformed nonce string
                       array('monkeys', 0, 0, false)
                       );

        foreach ($cases as $case) {
            $this->_mkCheckTest($case);
        }
    }

    function _mkCheckTest($case)
    {
        list($nonce_str, $skew, $now, $expected) = $case;
        $test = new Tests_Auth_OpenID_Nonce_TimestampCase(
            $nonce_str, $skew, $now, $expected);
        $test->setName('CheckTimestamp ' . var_export($nonce_str, true));
        $this->addTest($test);
    }
}

class Tests_Auth_OpenID_Nonce_TimestampCase extends PHPUnit_Framework_TestCase {
    function Tests_Auth_OpenID_Nonce_TimestampCase(
        $nonce_str, $skew, $now, $expected)
    {
        $this->nonce_string = $nonce_str;
        $this->allowed_skew = $skew;
        $this->now = $now;
        $this->expected = $expected;
    }

    function runTest()
    {
        $actual = Auth_OpenID_checkTimestamp($this->nonce_string,
                                             $this->allowed_skew,
                                             $this->now);
        $this->assertEquals($this->expected, $actual);
    }
}

class Tests_Auth_OpenID_NonceTests extends PHPUnit_Framework_TestCase {
    function test_mkNonce()
    {
        $nonce_str = Auth_OpenID_mkNonce();
        $this->assertTrue(preg_match(Tests_Auth_OpenID_nonce_re, $nonce_str));
    }

    function test_mkNonce_when()
    {
        $nonce_str = Auth_OpenID_mkNonce(0);
        $this->assertTrue(preg_match(Tests_Auth_OpenID_nonce_re, $nonce_str));
        $tpart = substr($nonce_str, 0, 20);
        $this->assertEquals('1970-01-01T00:00:00Z', $tpart);
    }

    function test_splitNonce()
    {
        $s = '1970-01-01T00:00:00Z';
        $expected_t = 0;
        $expected_salt = '';
        list($actual_t, $actual_salt) = Auth_OpenID_splitNonce($s);
        $this->assertEquals($expected_t, $actual_t);
        $this->assertEquals($expected_salt, $actual_salt);
    }


    function test_mkSplit()
    {
        $t = 42;;
        $nonce_str = Auth_OpenID_mkNonce($t);
        $this->assertTrue(preg_match(Tests_Auth_OpenID_nonce_re, $nonce_str));
        list($et, $salt) = Auth_OpenID_splitNonce($nonce_str);
        $this->assertEquals(6, strlen($salt));
        $this->assertEquals($et, $t);
    }
}

class Tests_Auth_OpenID_Nonce_BadSplitCase extends PHPUnit_Framework_TestCase {
    function Tests_Auth_OpenID_Nonce_BadSplitCase($nonce_str)
    {
        $this->nonce_str = $nonce_str;
    }

    function runTest()
    {
        $result = Auth_OpenID_splitNonce($this->nonce_str);
        $this->assertNull($result);
    }
}


