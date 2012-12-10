<?php

/**
 * Tests for the BigMath functions.
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

require_once 'Auth/OpenID/BigMath.php';
require_once 'Tests/Auth/OpenID/TestUtil.php';

class Tests_Auth_OpenID_BinLongConvertRnd extends PHPUnit_Framework_TestCase {
    var $lib;
    var $max;

    function Tests_Auth_OpenID_BinLongConvertRnd($lib, $max)
    {
        $this->lib =& $lib;
        $this->max = $max;
    }

    function runTest()
    {
        $n = $this->lib->init(0);
        foreach (range(0, 9) as $i) {
            $rnd = $this->lib->rand($this->max);
            $n = $this->lib->add($n, $rnd);
        }
        $s = $this->lib->longToBinary($n);
        $this->assertTrue(is_string($s));
        $n_prime = $this->lib->binaryToLong($s);
        $this->assertEquals($this->lib->cmp($n, $n_prime), 0);
    }
}

class Tests_Auth_OpenID_BinLongConvert extends PHPUnit_Framework_TestCase {
    var $lib;
    var $bin;
    var $lng;

    function Tests_Auth_OpenID_BinLongConvert($lib, $bin, $lng)
    {
        $this->lib =& $lib;
        $this->bin = $bin;
        $this->lng = $lng;
    }

    function runTest()
    {
        $n_prime = $this->lib->binaryToLong($this->bin);
        $s_prime = $this->lib->longToBinary($this->lng);
        $this->assertEquals($this->lib->cmp($this->lng, $n_prime), 0);
        $this->assertTrue($this->bin == $s_prime);
    }
}

class Tests_Auth_OpenID_Base64ToLong extends PHPUnit_Framework_TestCase {
    var $num;
    var $b64;
    var $lib;

    function Tests_Auth_OpenID_Base64ToLong($lib, $b64, $num)
    {
        $this->lib = $lib;
        $this->b64 = $b64;
        $this->num = $num;
    }

    function runTest()
    {
        $actual = $this->lib->base64ToLong($this->b64);
        $this->assertTrue($this->lib->cmp($this->num, $actual) == 0);
    }
}

class Tests_Auth_OpenID_LongToBase64 extends Tests_Auth_OpenID_Base64ToLong {
    function Tests_Auth_OpenID_LongToBase64($lib, $b64, $num)
    {
        $this->lib = $lib;
        $this->b64 = $b64;
        $this->num = $num;
    }

    function runTest()
    {
        $actual = $this->lib->longToBase64($this->num);
        $this->assertEquals($this->b64, $actual);
    }
}

class Tests_Auth_OpenID_Rand extends PHPUnit_Framework_TestCase {
    function Tests_Auth_OpenID_Rand($lib)
    {
        $this->lib =& $lib;
    }

    function runTest()
    {
        $stop = $this->lib->pow(2, 128);
        $a = $this->lib->rand($stop);
        $b = $this->lib->rand($stop);

        $this->assertFalse($this->lib->cmp($b, $a) == 0, "Same: $a $b");

        $n = $this->lib->init(Tests_Auth_OpenID_maxint());
        $n = $this->lib->add($n, 1);

        // Make sure that we can generate random numbers that are
        // larger than platform int size
        $result = $this->lib->rand($n);

        // What can we say about the result?
    }
}

/**
 * Computes the maximum integer value for this PHP installation.
 *
 * @return int $max_int_value The maximum integer value for this
 * PHP installation
 */
function Tests_Auth_OpenID_maxint()
{
    /* assumes largest integer is of form 2^n - 1 */
    $to_test = pow(2, 16);
    while (1) {
        $last = $to_test;
        $to_test = 2 * $to_test;
        if (($to_test < $last) || (!is_int($to_test))) {
            return($last + ($last - 1));
        }
    }
}


class Tests_Auth_OpenID_BigMath extends PHPUnit_Framework_TestSuite {
    function _parseBase64Data()
    {
        $lines = Tests_Auth_OpenID_readlines('n2b64');

        $data = array();
        foreach ($lines as $line) {
            $line = trim($line);
            if (!$line) {
                continue;
            }
            list($b64, $ascii) = explode(' ', $line);
            $data[$b64] = $ascii;
        }
        return $data;
    }

    function _addB64Tests()
    {
        $lib = Auth_OpenID_getMathLib();
        $count = defined('Tests_Auth_OpenID_thorough') ? -1 : 2;
        $data = $this->_parseBase64Data();
        foreach ($data as $b64 => $num_s) {
            // Only test the first few unless thorough is defined
            if (strlen($num_s) > 5) {
                if ($count == 0) {
                    break;
                } else {
                    $count -= 1;
                }
            }
            $num = $lib->init($num_s);
            $test = new Tests_Auth_OpenID_Base64ToLong($lib, $b64, $num);
            $test->setName("B64->Long $num_s");
            $this->addTest($test);

            $test = new Tests_Auth_OpenID_LongToBase64($lib, $b64, $num);
            $test->setName("Long->B64 $num_s");
            $this->addTest($test);
        }
    }

    function _addBinLongTests()
    {
        $lib =& Auth_OpenID_getMathLib();
        $max = Tests_Auth_OpenID_maxint();
        $upper = defined('Tests_Auth_OpenID_thorough') ? 499 : 3;

        foreach (range(0, $upper) as $iteration) {
            $test = new Tests_Auth_OpenID_BinLongConvertRnd($lib, $max);
            $test->setName("BinLongConvertRnd " . strval($iteration));
            $this->addTest($test);
        }

        $cases = array(
                       array("\x00", 0),
                       array("\x01", 1),
                       array("\x7F", 127),
                       array("\x00\x80", 128),
                       array("\x00\x81", 129),
                       array("\x00\xFF", 255),
                       array("\x00\x80\x00", 32768),
                       array("OpenID is cool",
                             "1611215304203901150134421257416556")
                       );

        foreach ($cases as $case) {
            list($bin, $lng_m) = $case;
            $lng = $lib->init($lng_m);
            $test = new Tests_Auth_OpenID_BinLongConvert($lib, $bin, $lng);
            $test->setName('BinLongConvert ' . bin2hex($bin));
            $this->addTest($test);
        }

    }

    function Tests_Auth_OpenID_BigMath($name)
    {
        $this->setName($name);

        if (defined('Auth_OpenID_NO_MATH_SUPPORT')) {
          return;
        }

        $this->_addB64Tests();
        $this->_addBinLongTests();
        $test = new Tests_Auth_OpenID_Rand(Auth_OpenID_getMathLib());
        $test->setName('Big number rand');
        $this->addTest($test);
    }
}

