<?php

/**
 * BigMath: A math library wrapper that abstracts out the underlying
 * long integer library.
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
 * Needed for random number generation
 */
require_once 'Auth/OpenID/CryptUtil.php';

/**
 * Need Auth_OpenID::bytes().
 */
require_once 'Auth/OpenID.php';

/**
 * The superclass of all big-integer math implementations
 * @access private
 * @package OpenID
 */
class Auth_OpenID_MathLibrary {
    /**
     * Given a long integer, returns the number converted to a binary
     * string.  This function accepts long integer values of arbitrary
     * magnitude and uses the local large-number math library when
     * available.
     *
     * @param integer $long The long number (can be a normal PHP
     * integer or a number created by one of the available long number
     * libraries)
     * @return string $binary The binary version of $long
     */
    function longToBinary($long)
    {
        $cmp = $this->cmp($long, 0);
        if ($cmp < 0) {
            $msg = __FUNCTION__ . " takes only positive integers.";
            trigger_error($msg, E_USER_ERROR);
            return null;
        }

        if ($cmp == 0) {
            return "\x00";
        }

        $bytes = array();

        while ($this->cmp($long, 0) > 0) {
            array_unshift($bytes, $this->mod($long, 256));
            $long = $this->div($long, pow(2, 8));
        }

        if ($bytes && ($bytes[0] > 127)) {
            array_unshift($bytes, 0);
        }

        $string = '';
        foreach ($bytes as $byte) {
            $string .= pack('C', $byte);
        }

        return $string;
    }

    /**
     * Given a binary string, returns the binary string converted to a
     * long number.
     *
     * @param string $binary The binary version of a long number,
     * probably as a result of calling longToBinary
     * @return integer $long The long number equivalent of the binary
     * string $str
     */
    function binaryToLong($str)
    {
        if ($str === null) {
            return null;
        }

        // Use array_merge to return a zero-indexed array instead of a
        // one-indexed array.
        $bytes = array_merge(unpack('C*', $str));

        $n = $this->init(0);

        if ($bytes && ($bytes[0] > 127)) {
            trigger_error("bytesToNum works only for positive integers.",
                          E_USER_WARNING);
            return null;
        }

        foreach ($bytes as $byte) {
            $n = $this->mul($n, pow(2, 8));
            $n = $this->add($n, $byte);
        }

        return $n;
    }

    function base64ToLong($str)
    {
        $b64 = base64_decode($str);

        if ($b64 === false) {
            return false;
        }

        return $this->binaryToLong($b64);
    }

    function longToBase64($str)
    {
        return base64_encode($this->longToBinary($str));
    }

    /**
     * Returns a random number in the specified range.  This function
     * accepts $start, $stop, and $step values of arbitrary magnitude
     * and will utilize the local large-number math library when
     * available.
     *
     * @param integer $start The start of the range, or the minimum
     * random number to return
     * @param integer $stop The end of the range, or the maximum
     * random number to return
     * @param integer $step The step size, such that $result - ($step
     * * N) = $start for some N
     * @return integer $result The resulting randomly-generated number
     */
    function rand($stop)
    {
        static $duplicate_cache = array();

        // Used as the key for the duplicate cache
        $rbytes = $this->longToBinary($stop);

        if (array_key_exists($rbytes, $duplicate_cache)) {
            list($duplicate, $nbytes) = $duplicate_cache[$rbytes];
        } else {
            if ($rbytes[0] == "\x00") {
                $nbytes = Auth_OpenID::bytes($rbytes) - 1;
            } else {
                $nbytes = Auth_OpenID::bytes($rbytes);
            }

            $mxrand = $this->pow(256, $nbytes);

            // If we get a number less than this, then it is in the
            // duplicated range.
            $duplicate = $this->mod($mxrand, $stop);

            if (count($duplicate_cache) > 10) {
                $duplicate_cache = array();
            }

            $duplicate_cache[$rbytes] = array($duplicate, $nbytes);
        }

        do {
            $bytes = "\x00" . Auth_OpenID_CryptUtil::getBytes($nbytes);
            $n = $this->binaryToLong($bytes);
            // Keep looping if this value is in the low duplicated range
        } while ($this->cmp($n, $duplicate) < 0);

        return $this->mod($n, $stop);
    }
}

/**
 * Exposes BCmath math library functionality.
 *
 * {@link Auth_OpenID_BcMathWrapper} wraps the functionality provided
 * by the BCMath extension.
 *
 * @access private
 * @package OpenID
 */
class Auth_OpenID_BcMathWrapper extends Auth_OpenID_MathLibrary{
    var $type = 'bcmath';

    function add($x, $y)
    {
        return bcadd($x, $y);
    }

    function sub($x, $y)
    {
        return bcsub($x, $y);
    }

    function pow($base, $exponent)
    {
        return bcpow($base, $exponent);
    }

    function cmp($x, $y)
    {
        return bccomp($x, $y);
    }

    function init($number, $base = 10)
    {
        return $number;
    }

    function mod($base, $modulus)
    {
        return bcmod($base, $modulus);
    }

    function mul($x, $y)
    {
        return bcmul($x, $y);
    }

    function div($x, $y)
    {
        return bcdiv($x, $y);
    }

    /**
     * Same as bcpowmod when bcpowmod is missing
     *
     * @access private
     */
    function _powmod($base, $exponent, $modulus)
    {
        $square = $this->mod($base, $modulus);
        $result = 1;
        while($this->cmp($exponent, 0) > 0) {
            if ($this->mod($exponent, 2)) {
                $result = $this->mod($this->mul($result, $square), $modulus);
            }
            $square = $this->mod($this->mul($square, $square), $modulus);
            $exponent = $this->div($exponent, 2);
        }
        return $result;
    }

    function powmod($base, $exponent, $modulus)
    {
        if (function_exists('bcpowmod')) {
            return bcpowmod($base, $exponent, $modulus);
        } else {
            return $this->_powmod($base, $exponent, $modulus);
        }
    }

    function toString($num)
    {
        return $num;
    }
}

/**
 * Exposes GMP math library functionality.
 *
 * {@link Auth_OpenID_GmpMathWrapper} wraps the functionality provided
 * by the GMP extension.
 *
 * @access private
 * @package OpenID
 */
class Auth_OpenID_GmpMathWrapper extends Auth_OpenID_MathLibrary{
    var $type = 'gmp';

    function add($x, $y)
    {
        return gmp_add($x, $y);
    }

    function sub($x, $y)
    {
        return gmp_sub($x, $y);
    }

    function pow($base, $exponent)
    {
        return gmp_pow($base, $exponent);
    }

    function cmp($x, $y)
    {
        return gmp_cmp($x, $y);
    }

    function init($number, $base = 10)
    {
        return gmp_init($number, $base);
    }

    function mod($base, $modulus)
    {
        return gmp_mod($base, $modulus);
    }

    function mul($x, $y)
    {
        return gmp_mul($x, $y);
    }

    function div($x, $y)
    {
        return gmp_div_q($x, $y);
    }

    function powmod($base, $exponent, $modulus)
    {
        return gmp_powm($base, $exponent, $modulus);
    }

    function toString($num)
    {
        return gmp_strval($num);
    }
}

/**
 * Define the supported extensions.  An extension array has keys
 * 'modules', 'extension', and 'class'.  'modules' is an array of PHP
 * module names which the loading code will attempt to load.  These
 * values will be suffixed with a library file extension (e.g. ".so").
 * 'extension' is the name of a PHP extension which will be tested
 * before 'modules' are loaded.  'class' is the string name of a
 * {@link Auth_OpenID_MathWrapper} subclass which should be
 * instantiated if a given extension is present.
 *
 * You can define new math library implementations and add them to
 * this array.
 */
function Auth_OpenID_math_extensions()
{
    $result = array();

    if (!defined('Auth_OpenID_BUGGY_GMP')) {
        $result[] =
            array('modules' => array('gmp', 'php_gmp'),
                  'extension' => 'gmp',
                  'class' => 'Auth_OpenID_GmpMathWrapper');
    }

    $result[] = array('modules' => array('bcmath', 'php_bcmath'),
                      'extension' => 'bcmath',
                      'class' => 'Auth_OpenID_BcMathWrapper');

    return $result;
}

/**
 * Detect which (if any) math library is available
 */
function Auth_OpenID_detectMathLibrary($exts)
{
    $loaded = false;

    foreach ($exts as $extension) {
        if (extension_loaded($extension['extension'])) {
            return $extension;
        }
    }

    return false;
}

/**
 * {@link Auth_OpenID_getMathLib} checks for the presence of long
 * number extension modules and returns an instance of
 * {@link Auth_OpenID_MathWrapper} which exposes the module's
 * functionality.
 *
 * Checks for the existence of an extension module described by the
 * result of {@link Auth_OpenID_math_extensions()} and returns an
 * instance of a wrapper for that extension module.  If no extension
 * module is found, an instance of {@link Auth_OpenID_MathWrapper} is
 * returned, which wraps the native PHP integer implementation.  The
 * proper calling convention for this method is $lib =
 * Auth_OpenID_getMathLib().
 *
 * This function checks for the existence of specific long number
 * implementations in the following order: GMP followed by BCmath.
 *
 * @return Auth_OpenID_MathWrapper $instance An instance of
 * {@link Auth_OpenID_MathWrapper} or one of its subclasses
 *
 * @package OpenID
 */
function Auth_OpenID_getMathLib()
{
    // The instance of Auth_OpenID_MathWrapper that we choose to
    // supply will be stored here, so that subseqent calls to this
    // method will return a reference to the same object.
    static $lib = null;

    if (isset($lib)) {
        return $lib;
    }

    if (Auth_OpenID_noMathSupport()) {
        $null = null;
        return $null;
    }

    // If this method has not been called before, look at
    // Auth_OpenID_math_extensions and try to find an extension that
    // works.
    $ext = Auth_OpenID_detectMathLibrary(Auth_OpenID_math_extensions());
    if ($ext === false) {
        $tried = array();
        foreach (Auth_OpenID_math_extensions() as $extinfo) {
            $tried[] = $extinfo['extension'];
        }
        $triedstr = implode(", ", $tried);

        Auth_OpenID_setNoMathSupport();

        $result = null;
        return $result;
    }

    // Instantiate a new wrapper
    $class = $ext['class'];
    $lib = new $class();

    return $lib;
}

function Auth_OpenID_setNoMathSupport()
{
    if (!defined('Auth_OpenID_NO_MATH_SUPPORT')) {
        define('Auth_OpenID_NO_MATH_SUPPORT', true);
    }
}

function Auth_OpenID_noMathSupport()
{
    return defined('Auth_OpenID_NO_MATH_SUPPORT');
}


