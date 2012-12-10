<?php

/**
 * The OpenID library's Diffie-Hellman implementation.
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

require_once 'Auth/OpenID.php';
require_once 'Auth/OpenID/BigMath.php';

function Auth_OpenID_getDefaultMod()
{
    return '155172898181473697471232257763715539915724801'.
        '966915404479707795314057629378541917580651227423'.
        '698188993727816152646631438561595825688188889951'.
        '272158842675419950341258706556549803580104870537'.
        '681476726513255747040765857479291291572334510643'.
        '245094715007229621094194349783925984760375594985'.
        '848253359305585439638443';
}

function Auth_OpenID_getDefaultGen()
{
    return '2';
}

/**
 * The Diffie-Hellman key exchange class.  This class relies on
 * {@link Auth_OpenID_MathLibrary} to perform large number operations.
 *
 * @access private
 * @package OpenID
 */
class Auth_OpenID_DiffieHellman {

    var $mod;
    var $gen;
    var $private;
    var $lib = null;

    function Auth_OpenID_DiffieHellman($mod = null, $gen = null,
                                       $private = null, $lib = null)
    {
        if ($lib === null) {
            $this->lib = Auth_OpenID_getMathLib();
        } else {
            $this->lib = $lib;
        }

        if ($mod === null) {
            $this->mod = $this->lib->init(Auth_OpenID_getDefaultMod());
        } else {
            $this->mod = $mod;
        }

        if ($gen === null) {
            $this->gen = $this->lib->init(Auth_OpenID_getDefaultGen());
        } else {
            $this->gen = $gen;
        }

        if ($private === null) {
            $r = $this->lib->rand($this->mod);
            $this->private = $this->lib->add($r, 1);
        } else {
            $this->private = $private;
        }

        $this->public = $this->lib->powmod($this->gen, $this->private,
                                           $this->mod);
    }

    function getSharedSecret($composite)
    {
        return $this->lib->powmod($composite, $this->private, $this->mod);
    }

    function getPublicKey()
    {
        return $this->public;
    }

    function usingDefaultValues()
    {
        return ($this->mod == Auth_OpenID_getDefaultMod() &&
                $this->gen == Auth_OpenID_getDefaultGen());
    }

    function xorSecret($composite, $secret, $hash_func)
    {
        $dh_shared = $this->getSharedSecret($composite);
        $dh_shared_str = $this->lib->longToBinary($dh_shared);
        $hash_dh_shared = $hash_func($dh_shared_str);

        $xsecret = "";
        for ($i = 0; $i < Auth_OpenID::bytes($secret); $i++) {
            $xsecret .= chr(ord($secret[$i]) ^ ord($hash_dh_shared[$i]));
        }

        return $xsecret;
    }
}


