<?php

/**
 * This module contains code for dealing with associations between
 * consumers and servers.
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

/**
 * @access private
 */
require_once 'Auth/OpenID/CryptUtil.php';

/**
 * @access private
 */
require_once 'Auth/OpenID/KVForm.php';

/**
 * @access private
 */
require_once 'Auth/OpenID/HMAC.php';

/**
 * This class represents an association between a server and a
 * consumer.  In general, users of this library will never see
 * instances of this object.  The only exception is if you implement a
 * custom {@link Auth_OpenID_OpenIDStore}.
 *
 * If you do implement such a store, it will need to store the values
 * of the handle, secret, issued, lifetime, and assoc_type instance
 * variables.
 *
 * @package OpenID
 */
class Auth_OpenID_Association {

    /**
     * This is a HMAC-SHA1 specific value.
     *
     * @access private
     */
    var $SIG_LENGTH = 20;

    /**
     * The ordering and name of keys as stored by serialize.
     *
     * @access private
     */
    var $assoc_keys = array(
                            'version',
                            'handle',
                            'secret',
                            'issued',
                            'lifetime',
                            'assoc_type'
                            );

    var $_macs = array(
                       'HMAC-SHA1' => 'Auth_OpenID_HMACSHA1',
                       'HMAC-SHA256' => 'Auth_OpenID_HMACSHA256'
                       );

    /**
     * This is an alternate constructor (factory method) used by the
     * OpenID consumer library to create associations.  OpenID store
     * implementations shouldn't use this constructor.
     *
     * @access private
     *
     * @param integer $expires_in This is the amount of time this
     * association is good for, measured in seconds since the
     * association was issued.
     *
     * @param string $handle This is the handle the server gave this
     * association.
     *
     * @param string secret This is the shared secret the server
     * generated for this association.
     *
     * @param assoc_type This is the type of association this
     * instance represents.  The only valid values of this field at
     * this time is 'HMAC-SHA1' and 'HMAC-SHA256', but new types may
     * be defined in the future.
     *
     * @return association An {@link Auth_OpenID_Association}
     * instance.
     */
    static function fromExpiresIn($expires_in, $handle, $secret, $assoc_type)
    {
        $issued = time();
        $lifetime = $expires_in;
        return new Auth_OpenID_Association($handle, $secret,
                                           $issued, $lifetime, $assoc_type);
    }

    /**
     * This is the standard constructor for creating an association.
     * The library should create all of the necessary associations, so
     * this constructor is not part of the external API.
     *
     * @access private
     *
     * @param string $handle This is the handle the server gave this
     * association.
     *
     * @param string $secret This is the shared secret the server
     * generated for this association.
     *
     * @param integer $issued This is the time this association was
     * issued, in seconds since 00:00 GMT, January 1, 1970.  (ie, a
     * unix timestamp)
     *
     * @param integer $lifetime This is the amount of time this
     * association is good for, measured in seconds since the
     * association was issued.
     *
     * @param string $assoc_type This is the type of association this
     * instance represents.  The only valid values of this field at
     * this time is 'HMAC-SHA1' and 'HMAC-SHA256', but new types may
     * be defined in the future.
     */
    function Auth_OpenID_Association(
        $handle, $secret, $issued, $lifetime, $assoc_type)
    {
        if (!in_array($assoc_type,
                      Auth_OpenID_getSupportedAssociationTypes(), true)) {
            $fmt = 'Unsupported association type (%s)';
            trigger_error(sprintf($fmt, $assoc_type), E_USER_ERROR);
        }

        $this->handle = $handle;
        $this->secret = $secret;
        $this->issued = $issued;
        $this->lifetime = $lifetime;
        $this->assoc_type = $assoc_type;
    }

    /**
     * This returns the number of seconds this association is still
     * valid for, or 0 if the association is no longer valid.
     *
     * @return integer $seconds The number of seconds this association
     * is still valid for, or 0 if the association is no longer valid.
     */
    function getExpiresIn($now = null)
    {
        if ($now == null) {
            $now = time();
        }

        return max(0, $this->issued + $this->lifetime - $now);
    }

    /**
     * This checks to see if two {@link Auth_OpenID_Association}
     * instances represent the same association.
     *
     * @return bool $result true if the two instances represent the
     * same association, false otherwise.
     */
    function equal($other)
    {
        return ((gettype($this) == gettype($other))
                && ($this->handle == $other->handle)
                && ($this->secret == $other->secret)
                && ($this->issued == $other->issued)
                && ($this->lifetime == $other->lifetime)
                && ($this->assoc_type == $other->assoc_type));
    }

    /**
     * Convert an association to KV form.
     *
     * @return string $result String in KV form suitable for
     * deserialization by deserialize.
     */
    function serialize()
    {
        $data = array(
                     'version' => '2',
                     'handle' => $this->handle,
                     'secret' => base64_encode($this->secret),
                     'issued' => strval(intval($this->issued)),
                     'lifetime' => strval(intval($this->lifetime)),
                     'assoc_type' => $this->assoc_type
                     );

        assert(array_keys($data) == $this->assoc_keys);

        return Auth_OpenID_KVForm::fromArray($data, $strict = true);
    }

    /**
     * Parse an association as stored by serialize().  This is the
     * inverse of serialize.
     *
     * @param string $assoc_s Association as serialized by serialize()
     * @return Auth_OpenID_Association $result instance of this class
     */
    static function deserialize($class_name, $assoc_s)
    {
        $pairs = Auth_OpenID_KVForm::toArray($assoc_s, $strict = true);
        $keys = array();
        $values = array();
        foreach ($pairs as $key => $value) {
            if (is_array($value)) {
                list($key, $value) = $value;
            }
            $keys[] = $key;
            $values[] = $value;
        }

        $class_vars = get_class_vars($class_name);
        $class_assoc_keys = $class_vars['assoc_keys'];

        sort($keys);
        sort($class_assoc_keys);

        if ($keys != $class_assoc_keys) {
            trigger_error('Unexpected key values: ' . var_export($keys, true),
                          E_USER_WARNING);
            return null;
        }

        $version = $pairs['version'];
        $handle = $pairs['handle'];
        $secret = $pairs['secret'];
        $issued = $pairs['issued'];
        $lifetime = $pairs['lifetime'];
        $assoc_type = $pairs['assoc_type'];

        if ($version != '2') {
            trigger_error('Unknown version: ' . $version, E_USER_WARNING);
            return null;
        }

        $issued = intval($issued);
        $lifetime = intval($lifetime);
        $secret = base64_decode($secret);

        return new $class_name(
            $handle, $secret, $issued, $lifetime, $assoc_type);
    }

    /**
     * Generate a signature for a sequence of (key, value) pairs
     *
     * @access private
     * @param array $pairs The pairs to sign, in order.  This is an
     * array of two-tuples.
     * @return string $signature The binary signature of this sequence
     * of pairs
     */
    function sign($pairs)
    {
        $kv = Auth_OpenID_KVForm::fromArray($pairs);

        /* Invalid association types should be caught at constructor */
        $callback = $this->_macs[$this->assoc_type];

        return call_user_func_array($callback, array($this->secret, $kv));
    }

    /**
     * Generate a signature for some fields in a dictionary
     *
     * @access private
     * @param array $fields The fields to sign, in order; this is an
     * array of strings.
     * @param array $data Dictionary of values to sign (an array of
     * string => string pairs).
     * @return string $signature The signature, base64 encoded
     */
    function signMessage($message)
    {
        if ($message->hasKey(Auth_OpenID_OPENID_NS, 'sig') ||
            $message->hasKey(Auth_OpenID_OPENID_NS, 'signed')) {
            // Already has a sig
            return null;
        }

        $extant_handle = $message->getArg(Auth_OpenID_OPENID_NS,
                                          'assoc_handle');

        if ($extant_handle && ($extant_handle != $this->handle)) {
            // raise ValueError("Message has a different association handle")
            return null;
        }

        $signed_message = $message;
        $signed_message->setArg(Auth_OpenID_OPENID_NS, 'assoc_handle',
                                $this->handle);

        $message_keys = array_keys($signed_message->toPostArgs());
        $signed_list = array();
        $signed_prefix = 'openid.';

        foreach ($message_keys as $k) {
            if (strpos($k, $signed_prefix) === 0) {
                $signed_list[] = substr($k, strlen($signed_prefix));
            }
        }

        $signed_list[] = 'signed';
        sort($signed_list);

        $signed_message->setArg(Auth_OpenID_OPENID_NS, 'signed',
                                implode(',', $signed_list));
        $sig = $this->getMessageSignature($signed_message);
        $signed_message->setArg(Auth_OpenID_OPENID_NS, 'sig', $sig);
        return $signed_message;
    }

    /**
     * Given a {@link Auth_OpenID_Message}, return the key/value pairs
     * to be signed according to the signed list in the message.  If
     * the message lacks a signed list, return null.
     *
     * @access private
     */
    function _makePairs($message)
    {
        $signed = $message->getArg(Auth_OpenID_OPENID_NS, 'signed');
        if (!$signed || Auth_OpenID::isFailure($signed)) {
            // raise ValueError('Message has no signed list: %s' % (message,))
            return null;
        }

        $signed_list = explode(',', $signed);
        $pairs = array();
        $data = $message->toPostArgs();
        foreach ($signed_list as $field) {
            $pairs[] = array($field, Auth_OpenID::arrayGet($data,
                                                           'openid.' .
                                                           $field, ''));
        }
        return $pairs;
    }

    /**
     * Given an {@link Auth_OpenID_Message}, return the signature for
     * the signed list in the message.
     *
     * @access private
     */
    function getMessageSignature($message)
    {
        $pairs = $this->_makePairs($message);
        return base64_encode($this->sign($pairs));
    }

    /**
     * Confirm that the signature of these fields matches the
     * signature contained in the data.
     *
     * @access private
     */
    function checkMessageSignature($message)
    {
        $sig = $message->getArg(Auth_OpenID_OPENID_NS,
                                'sig');

        if (!$sig || Auth_OpenID::isFailure($sig)) {
            return false;
        }

        $calculated_sig = $this->getMessageSignature($message);
        return Auth_OpenID_CryptUtil::constEq($calculated_sig, $sig);
    }
}

function Auth_OpenID_getSecretSize($assoc_type)
{
    if ($assoc_type == 'HMAC-SHA1') {
        return 20;
    } else if ($assoc_type == 'HMAC-SHA256') {
        return 32;
    } else {
        return null;
    }
}

function Auth_OpenID_getAllAssociationTypes()
{
    return array('HMAC-SHA1', 'HMAC-SHA256');
}

function Auth_OpenID_getSupportedAssociationTypes()
{
    $a = array('HMAC-SHA1');

    if (Auth_OpenID_HMACSHA256_SUPPORTED) {
        $a[] = 'HMAC-SHA256';
    }

    return $a;
}

function Auth_OpenID_getSessionTypes($assoc_type)
{
    $assoc_to_session = array(
       'HMAC-SHA1' => array('DH-SHA1', 'no-encryption'));

    if (Auth_OpenID_HMACSHA256_SUPPORTED) {
        $assoc_to_session['HMAC-SHA256'] =
            array('DH-SHA256', 'no-encryption');
    }

    return Auth_OpenID::arrayGet($assoc_to_session, $assoc_type, array());
}

function Auth_OpenID_checkSessionType($assoc_type, $session_type)
{
    if (!in_array($session_type,
                  Auth_OpenID_getSessionTypes($assoc_type))) {
        return false;
    }

    return true;
}

function Auth_OpenID_getDefaultAssociationOrder()
{
    $order = array();

    if (!Auth_OpenID_noMathSupport()) {
        $order[] = array('HMAC-SHA1', 'DH-SHA1');

        if (Auth_OpenID_HMACSHA256_SUPPORTED) {
            $order[] = array('HMAC-SHA256', 'DH-SHA256');
        }
    }

    $order[] = array('HMAC-SHA1', 'no-encryption');

    if (Auth_OpenID_HMACSHA256_SUPPORTED) {
        $order[] = array('HMAC-SHA256', 'no-encryption');
    }

    return $order;
}

function Auth_OpenID_getOnlyEncryptedOrder()
{
    $result = array();

    foreach (Auth_OpenID_getDefaultAssociationOrder() as $pair) {
        list($assoc, $session) = $pair;

        if ($session != 'no-encryption') {
            if (Auth_OpenID_HMACSHA256_SUPPORTED &&
                ($assoc == 'HMAC-SHA256')) {
                $result[] = $pair;
            } else if ($assoc != 'HMAC-SHA256') {
                $result[] = $pair;
            }
        }
    }

    return $result;
}

function Auth_OpenID_getDefaultNegotiator()
{
    return new Auth_OpenID_SessionNegotiator(
                 Auth_OpenID_getDefaultAssociationOrder());
}

function Auth_OpenID_getEncryptedNegotiator()
{
    return new Auth_OpenID_SessionNegotiator(
                 Auth_OpenID_getOnlyEncryptedOrder());
}

/**
 * A session negotiator controls the allowed and preferred association
 * types and association session types. Both the {@link
 * Auth_OpenID_Consumer} and {@link Auth_OpenID_Server} use
 * negotiators when creating associations.
 *
 * You can create and use negotiators if you:

 * - Do not want to do Diffie-Hellman key exchange because you use
 * transport-layer encryption (e.g. SSL)
 *
 * - Want to use only SHA-256 associations
 *
 * - Do not want to support plain-text associations over a non-secure
 * channel
 *
 * It is up to you to set a policy for what kinds of associations to
 * accept. By default, the library will make any kind of association
 * that is allowed in the OpenID 2.0 specification.
 *
 * Use of negotiators in the library
 * =================================
 *
 * When a consumer makes an association request, it calls {@link
 * getAllowedType} to get the preferred association type and
 * association session type.
 *
 * The server gets a request for a particular association/session type
 * and calls {@link isAllowed} to determine if it should create an
 * association. If it is supported, negotiation is complete. If it is
 * not, the server calls {@link getAllowedType} to get an allowed
 * association type to return to the consumer.
 *
 * If the consumer gets an error response indicating that the
 * requested association/session type is not supported by the server
 * that contains an assocation/session type to try, it calls {@link
 * isAllowed} to determine if it should try again with the given
 * combination of association/session type.
 *
 * @package OpenID
 */
class Auth_OpenID_SessionNegotiator {
    function Auth_OpenID_SessionNegotiator($allowed_types)
    {
        $this->allowed_types = array();
        $this->setAllowedTypes($allowed_types);
    }

    /**
     * Set the allowed association types, checking to make sure each
     * combination is valid.
     *
     * @access private
     */
    function setAllowedTypes($allowed_types)
    {
        foreach ($allowed_types as $pair) {
            list($assoc_type, $session_type) = $pair;
            if (!Auth_OpenID_checkSessionType($assoc_type, $session_type)) {
                return false;
            }
        }

        $this->allowed_types = $allowed_types;
        return true;
    }

    /**
     * Add an association type and session type to the allowed types
     * list. The assocation/session pairs are tried in the order that
     * they are added.
     *
     * @access private
     */
    function addAllowedType($assoc_type, $session_type = null)
    {
        if ($this->allowed_types === null) {
            $this->allowed_types = array();
        }

        if ($session_type === null) {
            $available = Auth_OpenID_getSessionTypes($assoc_type);

            if (!$available) {
                return false;
            }

            foreach ($available as $session_type) {
                $this->addAllowedType($assoc_type, $session_type);
            }
        } else {
            if (Auth_OpenID_checkSessionType($assoc_type, $session_type)) {
                $this->allowed_types[] = array($assoc_type, $session_type);
            } else {
                return false;
            }
        }

        return true;
    }

    // Is this combination of association type and session type allowed?
    function isAllowed($assoc_type, $session_type)
    {
        $assoc_good = in_array(array($assoc_type, $session_type),
                               $this->allowed_types);

        $matches = in_array($session_type,
                            Auth_OpenID_getSessionTypes($assoc_type));

        return ($assoc_good && $matches);
    }

    /**
     * Get a pair of assocation type and session type that are
     * supported.
     */
    function getAllowedType()
    {
        if (!$this->allowed_types) {
            return array(null, null);
        }

        return $this->allowed_types[0];
    }
}

