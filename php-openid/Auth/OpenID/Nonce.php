<?php

/**
 * Nonce-related functionality.
 *
 * @package OpenID
 */

/**
 * Need CryptUtil to generate random strings.
 */
require_once 'Auth/OpenID/CryptUtil.php';

/**
 * This is the characters that the nonces are made from.
 */
define('Auth_OpenID_Nonce_CHRS',"abcdefghijklmnopqrstuvwxyz" .
       "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");

// Keep nonces for five hours (allow five hours for the combination of
// request time and clock skew). This is probably way more than is
// necessary, but there is not much overhead in storing nonces.
global $Auth_OpenID_SKEW;
$Auth_OpenID_SKEW = 60 * 60 * 5;

define('Auth_OpenID_Nonce_REGEX',
       '/(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z(.*)/');

define('Auth_OpenID_Nonce_TIME_FMT',
       '%Y-%m-%dT%H:%M:%SZ');

function Auth_OpenID_splitNonce($nonce_string)
{
    // Extract a timestamp from the given nonce string
    $result = preg_match(Auth_OpenID_Nonce_REGEX, $nonce_string, $matches);
    if ($result != 1 || count($matches) != 8) {
        return null;
    }

    list($unused,
         $tm_year,
         $tm_mon,
         $tm_mday,
         $tm_hour,
         $tm_min,
         $tm_sec,
         $uniquifier) = $matches;

    $timestamp =
        @gmmktime($tm_hour, $tm_min, $tm_sec, $tm_mon, $tm_mday, $tm_year);

    if ($timestamp === false || $timestamp < 0) {
        return null;
    }

    return array($timestamp, $uniquifier);
}

function Auth_OpenID_checkTimestamp($nonce_string,
                                    $allowed_skew = null,
                                    $now = null)
{
    // Is the timestamp that is part of the specified nonce string
    // within the allowed clock-skew of the current time?
    global $Auth_OpenID_SKEW;

    if ($allowed_skew === null) {
        $allowed_skew = $Auth_OpenID_SKEW;
    }

    $parts = Auth_OpenID_splitNonce($nonce_string);
    if ($parts == null) {
        return false;
    }

    if ($now === null) {
        $now = time();
    }

    $stamp = $parts[0];

    // Time after which we should not use the nonce
    $past = $now - $allowed_skew;

    // Time that is too far in the future for us to allow
    $future = $now + $allowed_skew;

    // the stamp is not too far in the future and is not too far
    // in the past
    return (($past <= $stamp) && ($stamp <= $future));
}

function Auth_OpenID_mkNonce($when = null)
{
    // Generate a nonce with the current timestamp
    $salt = Auth_OpenID_CryptUtil::randomString(
        6, Auth_OpenID_Nonce_CHRS);
    if ($when === null) {
        // It's safe to call time() with no arguments; it returns a
        // GMT unix timestamp on PHP 4 and PHP 5.  gmmktime() with no
        // args returns a local unix timestamp on PHP 4, so don't use
        // that.
        $when = time();
    }
    $time_str = gmstrftime(Auth_OpenID_Nonce_TIME_FMT, $when);
    return $time_str . $salt;
}

