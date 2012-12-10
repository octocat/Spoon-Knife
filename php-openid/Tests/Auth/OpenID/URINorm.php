<?php

/**
 * Tests for the URI normalization routines used by the OpenID
 * library.
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

require_once 'Auth/OpenID/URINorm.php';
require_once 'Tests/Auth/OpenID/TestUtil.php';

class Tests_Auth_OpenID_URINorm_TestCase extends PHPUnit_Framework_TestCase {
    function Tests_Auth_OpenID_URINorm_TestCase(
                               $name, $uri, $expected)
    {

        $this->setName($name);
        $this->uri = $uri;
        $this->expected = $expected;
    }

    function runTest()
    {
        $actual = Auth_OpenID_urinorm($this->uri);
        $this->assertEquals($this->expected, $actual);
    }
}

class Tests_Auth_OpenID_URINorm extends PHPUnit_Framework_TestSuite {
    function _readTestCases()
    {
        $lines = Tests_Auth_OpenID_readlines('urinorm.txt');
        $cases = array();
        $case = array();
        for ($i = 0; $i < count($lines) && ($i + 3 <= count($lines)); $i += 4) {
            $name = trim($lines[$i]);
            $uri = trim($lines[$i + 1]);
            $expected = trim($lines[$i + 2]);
            if ($expected == 'fail') {
                $expected = null;
            }
            $cases[] = array($name, $uri, $expected);
        }

        return $cases;
    }

    function Tests_Auth_OpenID_URINorm($name)
    {
        $this->setName($name);
        $cases = $this->_readTestCases();
        foreach ($cases as $case) {
            list($name, $uri, $expected) = $case;
            $this->addTest(new Tests_Auth_OpenID_URINorm_TestCase($name, $uri, $expected));
        }
    }
}

