<?php

/**
 * Tests for the Diffie-Hellman key exchange implementation in the
 * OpenID library.
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

require_once 'Auth/OpenID/DiffieHellman.php';
require_once 'Tests/Auth/OpenID/TestUtil.php';

class Tests_Auth_OpenID_DiffieHellman_CheckCases extends PHPUnit_Framework_TestCase {
    function Tests_Auth_OpenID_DiffieHellman_CheckCases($cases, $n)
    {
        $this->cases = $cases;
        $this->n = $n;
    }

    function runTest()
    {
        $this->assertEquals($this->n, count($this->cases));
    }
}

class Tests_Auth_OpenID_DiffieHellman_Private extends PHPUnit_Framework_TestCase {
    function Tests_Auth_OpenID_DiffieHellman_Private($name, $input, $expected)
    {
        $this->setName("$name");
        $this->input = $input;
        $this->expected = $expected;
    }

    function runTest()
    {
        $lib =& Auth_OpenID_getMathLib();
        $dh = new Auth_OpenID_DiffieHellman(null, null, $this->input);
        $this->assertEquals($lib->cmp($this->expected, $dh->getPublicKey()), 0);
    }
}

class Tests_Auth_OpenID_DiffieHellman_Exch extends PHPUnit_Framework_TestCase {
    function Tests_Auth_OpenID_DiffieHellman_Exch($name, $p1, $p2, $shared)
    {
        $this->setName("$name");
        $this->p1 = $p1;
        $this->p2 = $p2;
        $this->shared = $shared;
    }

    function runTest()
    {
        $lib = Auth_OpenID_getMathLib();
        $shared = $lib->init($this->shared);
        $dh1 = new Auth_OpenID_DiffieHellman(null, null, $this->p1);
        $dh2 = new Auth_OpenID_DiffieHellman(null, null, $this->p2);
        $sh1 = $dh1->getSharedSecret($dh2->getPublicKey());
        $sh2 = $dh2->getSharedSecret($dh1->getPublicKey());
        $this->assertEquals($lib->cmp($shared, $sh1), 0);
        $this->assertEquals($lib->cmp($shared, $sh2), 0);
    }
}

class Tests_Auth_OpenID_DiffieHellman extends PHPUnit_Framework_TestSuite {
    function _readPrivateTestCases()
    {
        $lines = Tests_Auth_OpenID_readlines('dhpriv');
        $cases = array();
        foreach ($lines as $line) {
            $case = array();
            if (!preg_match('/^(\d+) (\d+)\n$/', $line, $case)) {
                trigger_error("Bad test input: $line", E_USER_ERROR);
            }

            $c = count($case);
            if ($c != 3) {
                trigger_error("Wrong number of elements in parsed case: $c",
                              E_USER_ERROR);
            }

            array_shift($case);
            $cases[] = $case;
        }

        return $cases;
    }

    function _readExchTestCases()
    {
        $lines = Tests_Auth_OpenID_readlines('dhexch');
        $cases = array();
        foreach ($lines as $line) {
            $case = array();
            if (!preg_match('/^(\d+) (\d+) (\d+)\n$/', $line, $case)) {
                trigger_error("Bad test input: $line", E_USER_ERROR);
            }

            $c = count($case);
            if ($c != 4) {
                trigger_error("Wrong number of elements in parsed case: $c",
                              E_USER_ERROR);
            }

            array_shift($case);
            $cases[] = $case;
        }
        return $cases;
    }

    function Tests_Auth_OpenID_DiffieHellman($name)
    {
        $this->setName($name);

        $priv_cases = Tests_Auth_OpenID_DiffieHellman::_readPrivateTestCases();
        $sanity = new Tests_Auth_OpenID_DiffieHellman_CheckCases(
            $priv_cases, 29);
        $sanity->setName('Check parsing of priv test data');
        $this->addTest($sanity);

        $exch_cases = Tests_Auth_OpenID_DiffieHellman::_readExchTestCases();
        $sanity = new Tests_Auth_OpenID_DiffieHellman_CheckCases(
            $exch_cases, 25);
        $sanity->setName('Check parsing of exch test data');
        $this->addTest($sanity);

        if (!defined('Auth_OpenID_NO_MATH_SUPPORT')) {
            if (defined('Tests_Auth_OpenID_thorough')) {
                $npriv = count($priv_cases);
                $nexch = count($exch_cases);
            } else {
                $npriv = 1;
                $nexch = 3;
            }

            for ($i = 0; $i < $npriv; $i++) {
                list($input, $expected) = $priv_cases[$i];
                $one = new Tests_Auth_OpenID_DiffieHellman_Private(
                    "DHPriv $i", $input, $expected);
                $this->addTest($one);
            }

            for ($i = 0; $i < $nexch; $i++) {
                $case = $exch_cases[$i];
                $one = new Tests_Auth_OpenID_DiffieHellman_Exch(
                    $i, $case[0], $case[1], $case[2]);
                $this->addTest($one);
            }
        }
    }
}


