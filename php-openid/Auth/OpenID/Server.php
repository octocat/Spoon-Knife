<?php

/**
 * OpenID server protocol and logic.
 * 
 * Overview
 *
 * An OpenID server must perform three tasks:
 *
 *  1. Examine the incoming request to determine its nature and validity.
 *  2. Make a decision about how to respond to this request.
 *  3. Format the response according to the protocol.
 * 
 * The first and last of these tasks may performed by the {@link
 * Auth_OpenID_Server::decodeRequest()} and {@link
 * Auth_OpenID_Server::encodeResponse} methods.  Who gets to do the
 * intermediate task -- deciding how to respond to the request -- will
 * depend on what type of request it is.
 *
 * If it's a request to authenticate a user (a 'checkid_setup' or
 * 'checkid_immediate' request), you need to decide if you will assert
 * that this user may claim the identity in question.  Exactly how you
 * do that is a matter of application policy, but it generally
 * involves making sure the user has an account with your system and
 * is logged in, checking to see if that identity is hers to claim,
 * and verifying with the user that she does consent to releasing that
 * information to the party making the request.
 *
 * Examine the properties of the {@link Auth_OpenID_CheckIDRequest}
 * object, and if and when you've come to a decision, form a response
 * by calling {@link Auth_OpenID_CheckIDRequest::answer()}.
 *
 * Other types of requests relate to establishing associations between
 * client and server and verifing the authenticity of previous
 * communications.  {@link Auth_OpenID_Server} contains all the logic
 * and data necessary to respond to such requests; just pass it to
 * {@link Auth_OpenID_Server::handleRequest()}.
 *
 * OpenID Extensions
 * 
 * Do you want to provide other information for your users in addition
 * to authentication?  Version 1.2 of the OpenID protocol allows
 * consumers to add extensions to their requests.  For example, with
 * sites using the Simple Registration
 * Extension
 * (http://openid.net/specs/openid-simple-registration-extension-1_0.html),
 * a user can agree to have their nickname and e-mail address sent to
 * a site when they sign up.
 *
 * Since extensions do not change the way OpenID authentication works,
 * code to handle extension requests may be completely separate from
 * the {@link Auth_OpenID_Request} class here.  But you'll likely want
 * data sent back by your extension to be signed.  {@link
 * Auth_OpenID_ServerResponse} provides methods with which you can add
 * data to it which can be signed with the other data in the OpenID
 * signature.
 *
 * For example:
 *
 * <pre>  // when request is a checkid_* request
 *  $response = $request->answer(true);
 *  // this will a signed 'openid.sreg.timezone' parameter to the response
 *  response.addField('sreg', 'timezone', 'America/Los_Angeles')</pre>
 *
 * Stores
 *
 * The OpenID server needs to maintain state between requests in order
 * to function.  Its mechanism for doing this is called a store.  The
 * store interface is defined in Interface.php.  Additionally, several
 * concrete store implementations are provided, so that most sites
 * won't need to implement a custom store.  For a store backed by flat
 * files on disk, see {@link Auth_OpenID_FileStore}.  For stores based
 * on MySQL, SQLite, or PostgreSQL, see the {@link
 * Auth_OpenID_SQLStore} subclasses.
 *
 * Upgrading
 *
 * The keys by which a server looks up associations in its store have
 * changed in version 1.2 of this library.  If your store has entries
 * created from version 1.0 code, you should empty it.
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
 * Required imports
 */
require_once "Auth/OpenID.php";
require_once "Auth/OpenID/Association.php";
require_once "Auth/OpenID/CryptUtil.php";
require_once "Auth/OpenID/BigMath.php";
require_once "Auth/OpenID/DiffieHellman.php";
require_once "Auth/OpenID/KVForm.php";
require_once "Auth/OpenID/TrustRoot.php";
require_once "Auth/OpenID/ServerRequest.php";
require_once "Auth/OpenID/Message.php";
require_once "Auth/OpenID/Nonce.php";

define('AUTH_OPENID_HTTP_OK', 200);
define('AUTH_OPENID_HTTP_REDIRECT', 302);
define('AUTH_OPENID_HTTP_ERROR', 400);

/**
 * @access private
 */
global $_Auth_OpenID_Request_Modes;
$_Auth_OpenID_Request_Modes = array('checkid_setup',
                                    'checkid_immediate');

/**
 * @access private
 */
define('Auth_OpenID_ENCODE_KVFORM', 'kfvorm');

/**
 * @access private
 */
define('Auth_OpenID_ENCODE_URL', 'URL/redirect');

/**
 * @access private
 */
define('Auth_OpenID_ENCODE_HTML_FORM', 'HTML form');

/**
 * @access private
 */
function Auth_OpenID_isError($obj, $cls = 'Auth_OpenID_ServerError')
{
    return is_a($obj, $cls);
}

/**
 * An error class which gets instantiated and returned whenever an
 * OpenID protocol error occurs.  Be prepared to use this in place of
 * an ordinary server response.
 *
 * @package OpenID
 */
class Auth_OpenID_ServerError {
    /**
     * @access private
     */
    function Auth_OpenID_ServerError($message = null, $text = null,
                                     $reference = null, $contact = null)
    {
        $this->message = $message;
        $this->text = $text;
        $this->contact = $contact;
        $this->reference = $reference;
    }

    function getReturnTo()
    {
        if ($this->message &&
            $this->message->hasKey(Auth_OpenID_OPENID_NS, 'return_to')) {
            return $this->message->getArg(Auth_OpenID_OPENID_NS,
                                          'return_to');
        } else {
            return null;
        }
    }

    /**
     * Returns the return_to URL for the request which caused this
     * error.
     */
    function hasReturnTo()
    {
        return $this->getReturnTo() !== null;
    }

    /**
     * Encodes this error's response as a URL suitable for
     * redirection.  If the response has no return_to, another
     * Auth_OpenID_ServerError is returned.
     */
    function encodeToURL()
    {
        if (!$this->message) {
            return null;
        }

        $msg = $this->toMessage();
        return $msg->toURL($this->getReturnTo());
    }

    /**
     * Encodes the response to key-value form.  This is a
     * machine-readable format used to respond to messages which came
     * directly from the consumer and not through the user-agent.  See
     * the OpenID specification.
     */
    function encodeToKVForm()
    {
        return Auth_OpenID_KVForm::fromArray(
                                      array('mode' => 'error',
                                            'error' => $this->toString()));
    }

    function toFormMarkup($form_tag_attrs=null)
    {
        $msg = $this->toMessage();
        return $msg->toFormMarkup($this->getReturnTo(), $form_tag_attrs);
    }

    function toHTML($form_tag_attrs=null)
    {
        return Auth_OpenID::autoSubmitHTML(
                      $this->toFormMarkup($form_tag_attrs));
    }

    function toMessage()
    {
        // Generate a Message object for sending to the relying party,
        // after encoding.
        $namespace = $this->message->getOpenIDNamespace();
        $reply = new Auth_OpenID_Message($namespace);
        $reply->setArg(Auth_OpenID_OPENID_NS, 'mode', 'error');
        $reply->setArg(Auth_OpenID_OPENID_NS, 'error', $this->toString());

        if ($this->contact !== null) {
            $reply->setArg(Auth_OpenID_OPENID_NS, 'contact', $this->contact);
        }

        if ($this->reference !== null) {
            $reply->setArg(Auth_OpenID_OPENID_NS, 'reference',
                           $this->reference);
        }

        return $reply;
    }

    /**
     * Returns one of Auth_OpenID_ENCODE_URL,
     * Auth_OpenID_ENCODE_KVFORM, or null, depending on the type of
     * encoding expected for this error's payload.
     */
    function whichEncoding()
    {
        global $_Auth_OpenID_Request_Modes;

        if ($this->hasReturnTo()) {
            if ($this->message->isOpenID2() &&
                (strlen($this->encodeToURL()) >
                   Auth_OpenID_OPENID1_URL_LIMIT)) {
                return Auth_OpenID_ENCODE_HTML_FORM;
            } else {
                return Auth_OpenID_ENCODE_URL;
            }
        }

        if (!$this->message) {
            return null;
        }

        $mode = $this->message->getArg(Auth_OpenID_OPENID_NS,
                                       'mode');

        if ($mode) {
            if (!in_array($mode, $_Auth_OpenID_Request_Modes)) {
                return Auth_OpenID_ENCODE_KVFORM;
            }
        }
        return null;
    }

    /**
     * Returns this error message.
     */
    function toString()
    {
        if ($this->text) {
            return $this->text;
        } else {
            return get_class($this) . " error";
        }
    }
}

/**
 * Error returned by the server code when a return_to is absent from a
 * request.
 *
 * @package OpenID
 */
class Auth_OpenID_NoReturnToError extends Auth_OpenID_ServerError {
    function Auth_OpenID_NoReturnToError($message = null,
                                         $text = "No return_to URL available")
    {
        parent::Auth_OpenID_ServerError($message, $text);
    }

    function toString()
    {
        return "No return_to available";
    }
}

/**
 * An error indicating that the return_to URL is malformed.
 *
 * @package OpenID
 */
class Auth_OpenID_MalformedReturnURL extends Auth_OpenID_ServerError {
    function Auth_OpenID_MalformedReturnURL($message, $return_to)
    {
        $this->return_to = $return_to;
        parent::Auth_OpenID_ServerError($message, "malformed return_to URL");
    }
}

/**
 * This error is returned when the trust_root value is malformed.
 *
 * @package OpenID
 */
class Auth_OpenID_MalformedTrustRoot extends Auth_OpenID_ServerError {
    function Auth_OpenID_MalformedTrustRoot($message = null,
                                            $text = "Malformed trust root")
    {
        parent::Auth_OpenID_ServerError($message, $text);
    }

    function toString()
    {
        return "Malformed trust root";
    }
}

/**
 * The base class for all server request classes.
 *
 * @package OpenID
 */
class Auth_OpenID_Request {
    var $mode = null;
}

/**
 * A request to verify the validity of a previous response.
 *
 * @package OpenID
 */
class Auth_OpenID_CheckAuthRequest extends Auth_OpenID_Request {
    var $mode = "check_authentication";
    var $invalidate_handle = null;

    function Auth_OpenID_CheckAuthRequest($assoc_handle, $signed,
                                          $invalidate_handle = null)
    {
        $this->assoc_handle = $assoc_handle;
        $this->signed = $signed;
        if ($invalidate_handle !== null) {
            $this->invalidate_handle = $invalidate_handle;
        }
        $this->namespace = Auth_OpenID_OPENID2_NS;
        $this->message = null;
    }

    static function fromMessage($message, $server=null)
    {
        $required_keys = array('assoc_handle', 'sig', 'signed');

        foreach ($required_keys as $k) {
            if (!$message->getArg(Auth_OpenID_OPENID_NS, $k)) {
                return new Auth_OpenID_ServerError($message,
                    sprintf("%s request missing required parameter %s from \
                            query", "check_authentication", $k));
            }
        }

        $assoc_handle = $message->getArg(Auth_OpenID_OPENID_NS, 'assoc_handle');
        $sig = $message->getArg(Auth_OpenID_OPENID_NS, 'sig');

        $signed_list = $message->getArg(Auth_OpenID_OPENID_NS, 'signed');
        $signed_list = explode(",", $signed_list);

        $signed = $message;
        if ($signed->hasKey(Auth_OpenID_OPENID_NS, 'mode')) {
            $signed->setArg(Auth_OpenID_OPENID_NS, 'mode', 'id_res');
        }

        $result = new Auth_OpenID_CheckAuthRequest($assoc_handle, $signed);
        $result->message = $message;
        $result->sig = $sig;
        $result->invalidate_handle = $message->getArg(Auth_OpenID_OPENID_NS,
                                                      'invalidate_handle');
        return $result;
    }

    function answer($signatory)
    {
        $is_valid = $signatory->verify($this->assoc_handle, $this->signed);

        // Now invalidate that assoc_handle so it this checkAuth
        // message cannot be replayed.
        $signatory->invalidate($this->assoc_handle, true);
        $response = new Auth_OpenID_ServerResponse($this);

        $response->fields->setArg(Auth_OpenID_OPENID_NS,
                                  'is_valid',
                                  ($is_valid ? "true" : "false"));

        if ($this->invalidate_handle) {
            $assoc = $signatory->getAssociation($this->invalidate_handle,
                                                false);
            if (!$assoc) {
                $response->fields->setArg(Auth_OpenID_OPENID_NS,
                                          'invalidate_handle',
                                          $this->invalidate_handle);
            }
        }
        return $response;
    }
}

/**
 * A class implementing plaintext server sessions.
 *
 * @package OpenID
 */
class Auth_OpenID_PlainTextServerSession {
    /**
     * An object that knows how to handle association requests with no
     * session type.
     */
    var $session_type = 'no-encryption';
    var $needs_math = false;
    var $allowed_assoc_types = array('HMAC-SHA1', 'HMAC-SHA256');

    static function fromMessage($unused_request)
    {
        return new Auth_OpenID_PlainTextServerSession();
    }

    function answer($secret)
    {
        return array('mac_key' => base64_encode($secret));
    }
}

/**
 * A class implementing DH-SHA1 server sessions.
 *
 * @package OpenID
 */
class Auth_OpenID_DiffieHellmanSHA1ServerSession {
    /**
     * An object that knows how to handle association requests with
     * the Diffie-Hellman session type.
     */

    var $session_type = 'DH-SHA1';
    var $needs_math = true;
    var $allowed_assoc_types = array('HMAC-SHA1');
    var $hash_func = 'Auth_OpenID_SHA1';

    function Auth_OpenID_DiffieHellmanSHA1ServerSession($dh, $consumer_pubkey)
    {
        $this->dh = $dh;
        $this->consumer_pubkey = $consumer_pubkey;
    }

    static function getDH($message)
    {
        $dh_modulus = $message->getArg(Auth_OpenID_OPENID_NS, 'dh_modulus');
        $dh_gen = $message->getArg(Auth_OpenID_OPENID_NS, 'dh_gen');

        if ((($dh_modulus === null) && ($dh_gen !== null)) ||
            (($dh_gen === null) && ($dh_modulus !== null))) {

            if ($dh_modulus === null) {
                $missing = 'modulus';
            } else {
                $missing = 'generator';
            }

            return new Auth_OpenID_ServerError($message,
                                'If non-default modulus or generator is '.
                                'supplied, both must be supplied.  Missing '.
                                $missing);
        }

        $lib = Auth_OpenID_getMathLib();

        if ($dh_modulus || $dh_gen) {
            $dh_modulus = $lib->base64ToLong($dh_modulus);
            $dh_gen = $lib->base64ToLong($dh_gen);
            if ($lib->cmp($dh_modulus, 0) == 0 ||
                $lib->cmp($dh_gen, 0) == 0) {
                return new Auth_OpenID_ServerError(
                  $message, "Failed to parse dh_mod or dh_gen");
            }
            $dh = new Auth_OpenID_DiffieHellman($dh_modulus, $dh_gen);
        } else {
            $dh = new Auth_OpenID_DiffieHellman();
        }

        $consumer_pubkey = $message->getArg(Auth_OpenID_OPENID_NS,
                                            'dh_consumer_public');
        if ($consumer_pubkey === null) {
            return new Auth_OpenID_ServerError($message,
                                  'Public key for DH-SHA1 session '.
                                  'not found in query');
        }

        $consumer_pubkey =
            $lib->base64ToLong($consumer_pubkey);

        if ($consumer_pubkey === false) {
            return new Auth_OpenID_ServerError($message,
                                       "dh_consumer_public is not base64");
        }

        return array($dh, $consumer_pubkey);
    }

    static function fromMessage($message)
    {
        $result = Auth_OpenID_DiffieHellmanSHA1ServerSession::getDH($message);

        if (is_a($result, 'Auth_OpenID_ServerError')) {
            return $result;
        } else {
            list($dh, $consumer_pubkey) = $result;
            return new Auth_OpenID_DiffieHellmanSHA1ServerSession($dh,
                                                    $consumer_pubkey);
        }
    }

    function answer($secret)
    {
        $lib = Auth_OpenID_getMathLib();
        $mac_key = $this->dh->xorSecret($this->consumer_pubkey, $secret,
                                        $this->hash_func);
        return array(
           'dh_server_public' =>
                $lib->longToBase64($this->dh->public),
           'enc_mac_key' => base64_encode($mac_key));
    }
}

/**
 * A class implementing DH-SHA256 server sessions.
 *
 * @package OpenID
 */
class Auth_OpenID_DiffieHellmanSHA256ServerSession
      extends Auth_OpenID_DiffieHellmanSHA1ServerSession {

    var $session_type = 'DH-SHA256';
    var $hash_func = 'Auth_OpenID_SHA256';
    var $allowed_assoc_types = array('HMAC-SHA256');

    static function fromMessage($message)
    {
        $result = Auth_OpenID_DiffieHellmanSHA1ServerSession::getDH($message);

        if (is_a($result, 'Auth_OpenID_ServerError')) {
            return $result;
        } else {
            list($dh, $consumer_pubkey) = $result;
            return new Auth_OpenID_DiffieHellmanSHA256ServerSession($dh,
                                                      $consumer_pubkey);
        }
    }
}

/**
 * A request to associate with the server.
 *
 * @package OpenID
 */
class Auth_OpenID_AssociateRequest extends Auth_OpenID_Request {
    var $mode = "associate";

    static function getSessionClasses()
    {
        return array(
          'no-encryption' => 'Auth_OpenID_PlainTextServerSession',
          'DH-SHA1' => 'Auth_OpenID_DiffieHellmanSHA1ServerSession',
          'DH-SHA256' => 'Auth_OpenID_DiffieHellmanSHA256ServerSession');
    }

    function Auth_OpenID_AssociateRequest($session, $assoc_type)
    {
        $this->session = $session;
        $this->namespace = Auth_OpenID_OPENID2_NS;
        $this->assoc_type = $assoc_type;
    }

    static function fromMessage($message, $server=null)
    {
        if ($message->isOpenID1()) {
            $session_type = $message->getArg(Auth_OpenID_OPENID_NS,
                                             'session_type');

            if ($session_type == 'no-encryption') {
                // oidutil.log('Received OpenID 1 request with a no-encryption '
                //             'assocaition session type. Continuing anyway.')
            } else if (!$session_type) {
                $session_type = 'no-encryption';
            }
        } else {
            $session_type = $message->getArg(Auth_OpenID_OPENID_NS,
                                             'session_type');
            if ($session_type === null) {
                return new Auth_OpenID_ServerError($message,
                  "session_type missing from request");
            }
        }

        $session_class = Auth_OpenID::arrayGet(
           Auth_OpenID_AssociateRequest::getSessionClasses(),
           $session_type);

        if ($session_class === null) {
            return new Auth_OpenID_ServerError($message,
                                               "Unknown session type " .
                                               $session_type);
        }

        $session = call_user_func(array($session_class, 'fromMessage'),
                                  $message);
        if (is_a($session, 'Auth_OpenID_ServerError')) {
            return $session;
        }

        $assoc_type = $message->getArg(Auth_OpenID_OPENID_NS,
                                       'assoc_type', 'HMAC-SHA1');

        if (!in_array($assoc_type, $session->allowed_assoc_types)) {
            $fmt = "Session type %s does not support association type %s";
            return new Auth_OpenID_ServerError($message,
              sprintf($fmt, $session_type, $assoc_type));
        }

        $obj = new Auth_OpenID_AssociateRequest($session, $assoc_type);
        $obj->message = $message;
        $obj->namespace = $message->getOpenIDNamespace();
        return $obj;
    }

    function answer($assoc)
    {
        $response = new Auth_OpenID_ServerResponse($this);
        $response->fields->updateArgs(Auth_OpenID_OPENID_NS,
           array(
                 'expires_in' => sprintf('%d', $assoc->getExpiresIn()),
                 'assoc_type' => $this->assoc_type,
                 'assoc_handle' => $assoc->handle));

        $response->fields->updateArgs(Auth_OpenID_OPENID_NS,
           $this->session->answer($assoc->secret));

        if (! ($this->session->session_type == 'no-encryption' 
               && $this->message->isOpenID1())) {
            $response->fields->setArg(Auth_OpenID_OPENID_NS,
                                      'session_type',
                                      $this->session->session_type);
        }

        return $response;
    }

    function answerUnsupported($text_message,
                               $preferred_association_type=null,
                               $preferred_session_type=null)
    {
        if ($this->message->isOpenID1()) {
            return new Auth_OpenID_ServerError($this->message);
        }

        $response = new Auth_OpenID_ServerResponse($this);
        $response->fields->setArg(Auth_OpenID_OPENID_NS,
                                  'error_code', 'unsupported-type');
        $response->fields->setArg(Auth_OpenID_OPENID_NS,
                                  'error', $text_message);

        if ($preferred_association_type) {
            $response->fields->setArg(Auth_OpenID_OPENID_NS,
                                      'assoc_type',
                                      $preferred_association_type);
        }

        if ($preferred_session_type) {
            $response->fields->setArg(Auth_OpenID_OPENID_NS,
                                      'session_type',
                                      $preferred_session_type);
        }
        $response->code = AUTH_OPENID_HTTP_ERROR;
        return $response;
    }
}

/**
 * A request to confirm the identity of a user.
 *
 * @package OpenID
 */
class Auth_OpenID_CheckIDRequest extends Auth_OpenID_Request {
    /**
     * Return-to verification callback.  Default is
     * Auth_OpenID_verifyReturnTo from TrustRoot.php.
     */
    var $verifyReturnTo = 'Auth_OpenID_verifyReturnTo';

    /**
     * The mode of this request.
     */
    var $mode = "checkid_setup"; // or "checkid_immediate"

    /**
     * Whether this request is for immediate mode.
     */
    var $immediate = false;

    /**
     * The trust_root value for this request.
     */
    var $trust_root = null;

    /**
     * The OpenID namespace for this request.
     * deprecated since version 2.0.2
     */
    var $namespace;
    
    static function make($message, $identity, $return_to, $trust_root = null,
                  $immediate = false, $assoc_handle = null, $server = null)
    {
        if ($server === null) {
            return new Auth_OpenID_ServerError($message,
                                               "server must not be null");
        }

        if ($return_to &&
            !Auth_OpenID_TrustRoot::_parse($return_to)) {
            return new Auth_OpenID_MalformedReturnURL($message, $return_to);
        }

        $r = new Auth_OpenID_CheckIDRequest($identity, $return_to,
                                            $trust_root, $immediate,
                                            $assoc_handle, $server);

        $r->namespace = $message->getOpenIDNamespace();
        $r->message = $message;

        if (!$r->trustRootValid()) {
            return new Auth_OpenID_UntrustedReturnURL($message,
                                                      $return_to,
                                                      $trust_root);
        } else {
            return $r;
        }
    }

    function Auth_OpenID_CheckIDRequest($identity, $return_to,
                                        $trust_root = null, $immediate = false,
                                        $assoc_handle = null, $server = null,
                                        $claimed_id = null)
    {
        $this->namespace = Auth_OpenID_OPENID2_NS;
        $this->assoc_handle = $assoc_handle;
        $this->identity = $identity;
        if ($claimed_id === null) {
            $this->claimed_id = $identity;
        } else {
            $this->claimed_id = $claimed_id;
        }
        $this->return_to = $return_to;
        $this->trust_root = $trust_root;
        $this->server = $server;

        if ($immediate) {
            $this->immediate = true;
            $this->mode = "checkid_immediate";
        } else {
            $this->immediate = false;
            $this->mode = "checkid_setup";
        }
    }

    function equals($other)
    {
        return (
                (is_a($other, 'Auth_OpenID_CheckIDRequest')) &&
                ($this->namespace == $other->namespace) &&
                ($this->assoc_handle == $other->assoc_handle) &&
                ($this->identity == $other->identity) &&
                ($this->claimed_id == $other->claimed_id) &&
                ($this->return_to == $other->return_to) &&
                ($this->trust_root == $other->trust_root));
    }

    /*
     * Does the relying party publish the return_to URL for this
     * response under the realm? It is up to the provider to set a
     * policy for what kinds of realms should be allowed. This
     * return_to URL verification reduces vulnerability to data-theft
     * attacks based on open proxies, corss-site-scripting, or open
     * redirectors.
     *
     * This check should only be performed after making sure that the
     * return_to URL matches the realm.
     *
     * @return true if the realm publishes a document with the
     * return_to URL listed, false if not or if discovery fails
     */
    function returnToVerified()
    {
        $fetcher = Auth_Yadis_Yadis::getHTTPFetcher();
        return call_user_func_array($this->verifyReturnTo,
                                    array($this->trust_root, $this->return_to, $fetcher));
    }

    static function fromMessage($message, $server)
    {
        $mode = $message->getArg(Auth_OpenID_OPENID_NS, 'mode');
        $immediate = null;

        if ($mode == "checkid_immediate") {
            $immediate = true;
            $mode = "checkid_immediate";
        } else {
            $immediate = false;
            $mode = "checkid_setup";
        }

        $return_to = $message->getArg(Auth_OpenID_OPENID_NS,
                                      'return_to');

        if (($message->isOpenID1()) &&
            (!$return_to)) {
            $fmt = "Missing required field 'return_to' from checkid request";
            return new Auth_OpenID_ServerError($message, $fmt);
        }

        $identity = $message->getArg(Auth_OpenID_OPENID_NS,
                                     'identity');
        $claimed_id = $message->getArg(Auth_OpenID_OPENID_NS, 'claimed_id');
        if ($message->isOpenID1()) {
            if ($identity === null) {
                $s = "OpenID 1 message did not contain openid.identity";
                return new Auth_OpenID_ServerError($message, $s);
            }
        } else {
            if ($identity && !$claimed_id) {
                $s = "OpenID 2.0 message contained openid.identity but not " .
                  "claimed_id";
                return new Auth_OpenID_ServerError($message, $s);
            } else if ($claimed_id && !$identity) {
                $s = "OpenID 2.0 message contained openid.claimed_id " .
                  "but not identity";
                return new Auth_OpenID_ServerError($message, $s);
            }
        }

        // There's a case for making self.trust_root be a TrustRoot
        // here.  But if TrustRoot isn't currently part of the
        // "public" API, I'm not sure it's worth doing.
        if ($message->isOpenID1()) {
            $trust_root_param = 'trust_root';
        } else {
            $trust_root_param = 'realm';
        }
        $trust_root = $message->getArg(Auth_OpenID_OPENID_NS, 
                                       $trust_root_param);
        if (! $trust_root) {
            $trust_root = $return_to;
        }

        if (! $message->isOpenID1() && 
            ($return_to === null) &&
            ($trust_root === null)) {
            return new Auth_OpenID_ServerError($message,
              "openid.realm required when openid.return_to absent");
        }

        $assoc_handle = $message->getArg(Auth_OpenID_OPENID_NS,
                                         'assoc_handle');

        $obj = Auth_OpenID_CheckIDRequest::make($message,
                                                $identity,
                                                $return_to,
                                                $trust_root,
                                                $immediate,
                                                $assoc_handle,
                                                $server);

        if (is_a($obj, 'Auth_OpenID_ServerError')) {
            return $obj;
        }

        $obj->claimed_id = $claimed_id;

        return $obj;
    }

    function idSelect()
    {
        // Is the identifier to be selected by the IDP?
        // So IDPs don't have to import the constant
        return $this->identity == Auth_OpenID_IDENTIFIER_SELECT;
    }

    function trustRootValid()
    {
        if (!$this->trust_root) {
            return true;
        }

        $tr = Auth_OpenID_TrustRoot::_parse($this->trust_root);
        if ($tr === false) {
            return new Auth_OpenID_MalformedTrustRoot($this->message,
                                                      $this->trust_root);
        }

        if ($this->return_to !== null) {
            return Auth_OpenID_TrustRoot::match($this->trust_root,
                                                $this->return_to);
        } else {
            return true;
        }
    }

    /**
     * Respond to this request.  Return either an
     * {@link Auth_OpenID_ServerResponse} or
     * {@link Auth_OpenID_ServerError}.
     *
     * @param bool $allow Allow this user to claim this identity, and
     * allow the consumer to have this information?
     *
     * @param string $server_url DEPRECATED.  Passing $op_endpoint to
     * the {@link Auth_OpenID_Server} constructor makes this optional.
     *
     * When an OpenID 1.x immediate mode request does not succeed, it
     * gets back a URL where the request may be carried out in a
     * not-so-immediate fashion.  Pass my URL in here (the fully
     * qualified address of this server's endpoint, i.e.
     * http://example.com/server), and I will use it as a base for the
     * URL for a new request.
     *
     * Optional for requests where {@link $immediate} is false or
     * $allow is true.
     *
     * @param string $identity The OP-local identifier to answer with.
     * Only for use when the relying party requested identifier
     * selection.
     *
     * @param string $claimed_id The claimed identifier to answer
     * with, for use with identifier selection in the case where the
     * claimed identifier and the OP-local identifier differ,
     * i.e. when the claimed_id uses delegation.
     *
     * If $identity is provided but this is not, $claimed_id will
     * default to the value of $identity.  When answering requests
     * that did not ask for identifier selection, the response
     * $claimed_id will default to that of the request.
     *
     * This parameter is new in OpenID 2.0.
     *
     * @return mixed
     */
    function answer($allow, $server_url = null, $identity = null,
                    $claimed_id = null)
    {
        if (!$this->return_to) {
            return new Auth_OpenID_NoReturnToError();
        }

        if (!$server_url) {
            if ((!$this->message->isOpenID1()) &&
                (!$this->server->op_endpoint)) {
                return new Auth_OpenID_ServerError(null,
                  "server should be constructed with op_endpoint to " .
                  "respond to OpenID 2.0 messages.");
            }

            $server_url = $this->server->op_endpoint;
        }

        if ($allow) {
            $mode = 'id_res';
        } else if ($this->message->isOpenID1()) {
            if ($this->immediate) {
                $mode = 'id_res';
            } else {
                $mode = 'cancel';
            }
        } else {
            if ($this->immediate) {
                $mode = 'setup_needed';
            } else {
                $mode = 'cancel';
            }
        }

        if (!$this->trustRootValid()) {
            return new Auth_OpenID_UntrustedReturnURL(null,
                                                      $this->return_to,
                                                      $this->trust_root);
        }

        $response = new Auth_OpenID_ServerResponse($this);

        if ($claimed_id &&
            ($this->message->isOpenID1())) {
            return new Auth_OpenID_ServerError(null,
              "claimed_id is new in OpenID 2.0 and not " .
              "available for ".$this->namespace);
        }

        if ($identity && !$claimed_id) {
            $claimed_id = $identity;
        }

        if ($allow) {

            if ($this->identity == Auth_OpenID_IDENTIFIER_SELECT) {
                if (!$identity) {
                    return new Auth_OpenID_ServerError(null,
                      "This request uses IdP-driven identifier selection.  " .
                      "You must supply an identifier in the response.");
                }

                $response_identity = $identity;
                $response_claimed_id = $claimed_id;

            } else if ($this->identity) {
                if ($identity &&
                    ($this->identity != $identity)) {
                    $fmt = "Request was for %s, cannot reply with identity %s";
                    return new Auth_OpenID_ServerError(null,
                      sprintf($fmt, $this->identity, $identity));
                }

                $response_identity = $this->identity;
                $response_claimed_id = $this->claimed_id;
            } else {
                if ($identity) {
                    return new Auth_OpenID_ServerError(null,
                      "This request specified no identity and " .
                      "you supplied ".$identity);
                }

                $response_identity = null;
            }

            if (($this->message->isOpenID1()) &&
                ($response_identity === null)) {
                return new Auth_OpenID_ServerError(null,
                  "Request was an OpenID 1 request, so response must " .
                  "include an identifier.");
            }

            $response->fields->updateArgs(Auth_OpenID_OPENID_NS,
                   array('mode' => $mode,
                         'return_to' => $this->return_to,
                         'response_nonce' => Auth_OpenID_mkNonce()));

            if (!$this->message->isOpenID1()) {
                $response->fields->setArg(Auth_OpenID_OPENID_NS,
                                          'op_endpoint', $server_url);
            }

            if ($response_identity !== null) {
                $response->fields->setArg(
                                          Auth_OpenID_OPENID_NS,
                                          'identity',
                                          $response_identity);
                if ($this->message->isOpenID2()) {
                    $response->fields->setArg(
                                              Auth_OpenID_OPENID_NS,
                                              'claimed_id',
                                              $response_claimed_id);
                }
            }

        } else {
            $response->fields->setArg(Auth_OpenID_OPENID_NS,
                                      'mode', $mode);

            if ($this->immediate) {
                if (($this->message->isOpenID1()) &&
                    (!$server_url)) {
                    return new Auth_OpenID_ServerError(null,
                                 'setup_url is required for $allow=false \
                                  in OpenID 1.x immediate mode.');
                }

                $setup_request = new Auth_OpenID_CheckIDRequest(
                                                $this->identity,
                                                $this->return_to,
                                                $this->trust_root,
                                                false,
                                                $this->assoc_handle,
                                                $this->server,
                                                $this->claimed_id);
                $setup_request->message = $this->message;

                $setup_url = $setup_request->encodeToURL($server_url);

                if ($setup_url === null) {
                    return new Auth_OpenID_NoReturnToError();
                }

                $response->fields->setArg(Auth_OpenID_OPENID_NS,
                                          'user_setup_url',
                                          $setup_url);
            }
        }

        return $response;
    }

    function encodeToURL($server_url)
    {
        if (!$this->return_to) {
            return new Auth_OpenID_NoReturnToError();
        }

        // Imported from the alternate reality where these classes are
        // used in both the client and server code, so Requests are
        // Encodable too.  That's right, code imported from alternate
        // realities all for the love of you, id_res/user_setup_url.

        $q = array('mode' => $this->mode,
                   'identity' => $this->identity,
                   'claimed_id' => $this->claimed_id,
                   'return_to' => $this->return_to);

        if ($this->trust_root) {
            if ($this->message->isOpenID1()) {
                $q['trust_root'] = $this->trust_root;
            } else {
                $q['realm'] = $this->trust_root;
            }
        }

        if ($this->assoc_handle) {
            $q['assoc_handle'] = $this->assoc_handle;
        }

        $response = new Auth_OpenID_Message(
            $this->message->getOpenIDNamespace());
        $response->updateArgs(Auth_OpenID_OPENID_NS, $q);
        return $response->toURL($server_url);
    }

    function getCancelURL()
    {
        if (!$this->return_to) {
            return new Auth_OpenID_NoReturnToError();
        }

        if ($this->immediate) {
            return new Auth_OpenID_ServerError(null,
                                               "Cancel is not an appropriate \
                                               response to immediate mode \
                                               requests.");
        }

        $response = new Auth_OpenID_Message(
            $this->message->getOpenIDNamespace());
        $response->setArg(Auth_OpenID_OPENID_NS, 'mode', 'cancel');
        return $response->toURL($this->return_to);
    }
}

/**
 * This class encapsulates the response to an OpenID server request.
 *
 * @package OpenID
 */
class Auth_OpenID_ServerResponse {

    function Auth_OpenID_ServerResponse($request)
    {
        $this->request = $request;
        $this->fields = new Auth_OpenID_Message($this->request->namespace);
    }

    function whichEncoding()
    {
      global $_Auth_OpenID_Request_Modes;

        if (in_array($this->request->mode, $_Auth_OpenID_Request_Modes)) {
            if ($this->fields->isOpenID2() &&
                (strlen($this->encodeToURL()) >
                   Auth_OpenID_OPENID1_URL_LIMIT)) {
                return Auth_OpenID_ENCODE_HTML_FORM;
            } else {
                return Auth_OpenID_ENCODE_URL;
            }
        } else {
            return Auth_OpenID_ENCODE_KVFORM;
        }
    }

    /*
     * Returns the form markup for this response.
     *
     * @return str
     */
    function toFormMarkup($form_tag_attrs=null)
    {
        return $this->fields->toFormMarkup($this->request->return_to,
                                           $form_tag_attrs);
    }

    /*
     * Returns an HTML document containing the form markup for this
     * response that autosubmits with javascript.
     */
    function toHTML()
    {
        return Auth_OpenID::autoSubmitHTML($this->toFormMarkup());
    }

    /*
     * Returns True if this response's encoding is ENCODE_HTML_FORM.
     * Convenience method for server authors.
     *
     * @return bool
     */
    function renderAsForm()
    {
        return $this->whichEncoding() == Auth_OpenID_ENCODE_HTML_FORM;
    }


    function encodeToURL()
    {
        return $this->fields->toURL($this->request->return_to);
    }

    function addExtension($extension_response)
    {
        $extension_response->toMessage($this->fields);
    }

    function needsSigning()
    {
        return $this->fields->getArg(Auth_OpenID_OPENID_NS,
                                     'mode') == 'id_res';
    }

    function encodeToKVForm()
    {
        return $this->fields->toKVForm();
    }
}

/**
 * A web-capable response object which you can use to generate a
 * user-agent response.
 *
 * @package OpenID
 */
class Auth_OpenID_WebResponse {
    var $code = AUTH_OPENID_HTTP_OK;
    var $body = "";

    function Auth_OpenID_WebResponse($code = null, $headers = null,
                                     $body = null)
    {
        if ($code) {
            $this->code = $code;
        }

        if ($headers !== null) {
            $this->headers = $headers;
        } else {
            $this->headers = array();
        }

        if ($body !== null) {
            $this->body = $body;
        }
    }
}

/**
 * Responsible for the signature of query data and the verification of
 * OpenID signature values.
 *
 * @package OpenID
 */
class Auth_OpenID_Signatory {

    // = 14 * 24 * 60 * 60; # 14 days, in seconds
    var $SECRET_LIFETIME = 1209600;

    // keys have a bogus server URL in them because the filestore
    // really does expect that key to be a URL.  This seems a little
    // silly for the server store, since I expect there to be only one
    // server URL.
    var $normal_key = 'http://localhost/|normal';
    var $dumb_key = 'http://localhost/|dumb';

    /**
     * Create a new signatory using a given store.
     */
    function Auth_OpenID_Signatory($store)
    {
        // assert store is not None
        $this->store = $store;
    }

    /**
     * Verify, using a given association handle, a signature with
     * signed key-value pairs from an HTTP request.
     */
    function verify($assoc_handle, $message)
    {
        $assoc = $this->getAssociation($assoc_handle, true);
        if (!$assoc) {
            // oidutil.log("failed to get assoc with handle %r to verify sig %r"
            //             % (assoc_handle, sig))
            return false;
        }

        return $assoc->checkMessageSignature($message);
    }

    /**
     * Given a response, sign the fields in the response's 'signed'
     * list, and insert the signature into the response.
     */
    function sign($response)
    {
        $signed_response = $response;
        $assoc_handle = $response->request->assoc_handle;

        if ($assoc_handle) {
            // normal mode
            $assoc = $this->getAssociation($assoc_handle, false, false);
            if (!$assoc || ($assoc->getExpiresIn() <= 0)) {
                // fall back to dumb mode
                $signed_response->fields->setArg(Auth_OpenID_OPENID_NS,
                             'invalidate_handle', $assoc_handle);
                $assoc_type = ($assoc ? $assoc->assoc_type : 'HMAC-SHA1');

                if ($assoc && ($assoc->getExpiresIn() <= 0)) {
                    $this->invalidate($assoc_handle, false);
                }

                $assoc = $this->createAssociation(true, $assoc_type);
            }
        } else {
            // dumb mode.
            $assoc = $this->createAssociation(true);
        }

        $signed_response->fields = $assoc->signMessage(
                                      $signed_response->fields);
        return $signed_response;
    }

    /**
     * Make a new association.
     */
    function createAssociation($dumb = true, $assoc_type = 'HMAC-SHA1')
    {
        $secret = Auth_OpenID_CryptUtil::getBytes(
                    Auth_OpenID_getSecretSize($assoc_type));

        $uniq = base64_encode(Auth_OpenID_CryptUtil::getBytes(4));
        $handle = sprintf('{%s}{%x}{%s}', $assoc_type, intval(time()), $uniq);

        $assoc = Auth_OpenID_Association::fromExpiresIn(
                      $this->SECRET_LIFETIME, $handle, $secret, $assoc_type);

        if ($dumb) {
            $key = $this->dumb_key;
        } else {
            $key = $this->normal_key;
        }

        $this->store->storeAssociation($key, $assoc);
        return $assoc;
    }

    /**
     * Given an association handle, get the association from the
     * store, or return a ServerError or null if something goes wrong.
     */
    function getAssociation($assoc_handle, $dumb, $check_expiration=true)
    {
        if ($assoc_handle === null) {
            return new Auth_OpenID_ServerError(null,
                                     "assoc_handle must not be null");
        }

        if ($dumb) {
            $key = $this->dumb_key;
        } else {
            $key = $this->normal_key;
        }

        $assoc = $this->store->getAssociation($key, $assoc_handle);

        if (($assoc !== null) && ($assoc->getExpiresIn() <= 0)) {
            if ($check_expiration) {
                $this->store->removeAssociation($key, $assoc_handle);
                $assoc = null;
            }
        }

        return $assoc;
    }

    /**
     * Invalidate a given association handle.
     */
    function invalidate($assoc_handle, $dumb)
    {
        if ($dumb) {
            $key = $this->dumb_key;
        } else {
            $key = $this->normal_key;
        }
        $this->store->removeAssociation($key, $assoc_handle);
    }
}

/**
 * Encode an {@link Auth_OpenID_ServerResponse} to an
 * {@link Auth_OpenID_WebResponse}.
 *
 * @package OpenID
 */
class Auth_OpenID_Encoder {

    var $responseFactory = 'Auth_OpenID_WebResponse';

    /**
     * Encode an {@link Auth_OpenID_ServerResponse} and return an
     * {@link Auth_OpenID_WebResponse}.
     */
    function encode($response)
    {
        $cls = $this->responseFactory;

        $encode_as = $response->whichEncoding();
        if ($encode_as == Auth_OpenID_ENCODE_KVFORM) {
            $wr = new $cls(null, null, $response->encodeToKVForm());
            if (is_a($response, 'Auth_OpenID_ServerError')) {
                $wr->code = AUTH_OPENID_HTTP_ERROR;
            }
        } else if ($encode_as == Auth_OpenID_ENCODE_URL) {
            $location = $response->encodeToURL();
            $wr = new $cls(AUTH_OPENID_HTTP_REDIRECT,
                           array('location' => $location));
        } else if ($encode_as == Auth_OpenID_ENCODE_HTML_FORM) {
          $wr = new $cls(AUTH_OPENID_HTTP_OK, array(),
                         $response->toHTML());
        } else {
            return new Auth_OpenID_EncodingError($response);
        }
        /* Allow the response to carry a custom error code (ex: for Association errors) */
        if(isset($response->code)) {
            $wr->code = $response->code;
        }
        return $wr;
    }
}

/**
 * An encoder which also takes care of signing fields when required.
 *
 * @package OpenID
 */
class Auth_OpenID_SigningEncoder extends Auth_OpenID_Encoder {

    function Auth_OpenID_SigningEncoder($signatory)
    {
        $this->signatory = $signatory;
    }

    /**
     * Sign an {@link Auth_OpenID_ServerResponse} and return an
     * {@link Auth_OpenID_WebResponse}.
     */
    function encode($response)
    {
        // the isinstance is a bit of a kludge... it means there isn't
        // really an adapter to make the interfaces quite match.
        if (!is_a($response, 'Auth_OpenID_ServerError') &&
            $response->needsSigning()) {

            if (!$this->signatory) {
                return new Auth_OpenID_ServerError(null,
                                       "Must have a store to sign request");
            }

            if ($response->fields->hasKey(Auth_OpenID_OPENID_NS, 'sig')) {
                return new Auth_OpenID_AlreadySigned($response);
            }
            $response = $this->signatory->sign($response);
        }

        return parent::encode($response);
    }
}

/**
 * Decode an incoming query into an Auth_OpenID_Request.
 *
 * @package OpenID
 */
class Auth_OpenID_Decoder {

    function Auth_OpenID_Decoder($server)
    {
        $this->server = $server;

        $this->handlers = array(
            'checkid_setup' => 'Auth_OpenID_CheckIDRequest',
            'checkid_immediate' => 'Auth_OpenID_CheckIDRequest',
            'check_authentication' => 'Auth_OpenID_CheckAuthRequest',
            'associate' => 'Auth_OpenID_AssociateRequest'
            );
    }

    /**
     * Given an HTTP query in an array (key-value pairs), decode it
     * into an Auth_OpenID_Request object.
     */
    function decode($query)
    {
        if (!$query) {
            return null;
        }

        $message = Auth_OpenID_Message::fromPostArgs($query);

        if ($message === null) {
            /*
             * It's useful to have a Message attached to a
             * ProtocolError, so we override the bad ns value to build
             * a Message out of it.  Kinda kludgy, since it's made of
             * lies, but the parts that aren't lies are more useful
             * than a 'None'.
             */
            $old_ns = $query['openid.ns'];

            $query['openid.ns'] = Auth_OpenID_OPENID2_NS;
            $message = Auth_OpenID_Message::fromPostArgs($query);
            return new Auth_OpenID_ServerError(
                  $message,
                  sprintf("Invalid OpenID namespace URI: %s", $old_ns));
        }

        $mode = $message->getArg(Auth_OpenID_OPENID_NS, 'mode');
        if (!$mode) {
            return new Auth_OpenID_ServerError($message,
                                               "No mode value in message");
        }

        if (Auth_OpenID::isFailure($mode)) {
            return new Auth_OpenID_ServerError($message,
                                               $mode->message);
        }

        $handlerCls = Auth_OpenID::arrayGet($this->handlers, $mode,
                                            $this->defaultDecoder($message));

        if (!is_a($handlerCls, 'Auth_OpenID_ServerError')) {
            return call_user_func_array(array($handlerCls, 'fromMessage'),
                                        array($message, $this->server));
        } else {
            return $handlerCls;
        }
    }

    function defaultDecoder($message)
    {
        $mode = $message->getArg(Auth_OpenID_OPENID_NS, 'mode');

        if (Auth_OpenID::isFailure($mode)) {
            return new Auth_OpenID_ServerError($message,
                                               $mode->message);
        }

        return new Auth_OpenID_ServerError($message,
                       sprintf("Unrecognized OpenID mode %s", $mode));
    }
}

/**
 * An error that indicates an encoding problem occurred.
 *
 * @package OpenID
 */
class Auth_OpenID_EncodingError {
    function Auth_OpenID_EncodingError($response)
    {
        $this->response = $response;
    }
}

/**
 * An error that indicates that a response was already signed.
 *
 * @package OpenID
 */
class Auth_OpenID_AlreadySigned extends Auth_OpenID_EncodingError {
    // This response is already signed.
}

/**
 * An error that indicates that the given return_to is not under the
 * given trust_root.
 *
 * @package OpenID
 */
class Auth_OpenID_UntrustedReturnURL extends Auth_OpenID_ServerError {
    function Auth_OpenID_UntrustedReturnURL($message, $return_to,
                                            $trust_root)
    {
        parent::Auth_OpenID_ServerError($message, "Untrusted return_to URL");
        $this->return_to = $return_to;
        $this->trust_root = $trust_root;
    }

    function toString()
    {
        return sprintf("return_to %s not under trust_root %s",
                       $this->return_to, $this->trust_root);
    }
}

/**
 * I handle requests for an OpenID server.
 *
 * Some types of requests (those which are not checkid requests) may
 * be handed to my {@link handleRequest} method, and I will take care
 * of it and return a response.
 *
 * For your convenience, I also provide an interface to {@link
 * Auth_OpenID_Decoder::decode()} and {@link
 * Auth_OpenID_SigningEncoder::encode()} through my methods {@link
 * decodeRequest} and {@link encodeResponse}.
 *
 * All my state is encapsulated in an {@link Auth_OpenID_OpenIDStore}.
 *
 * Example:
 *
 * <pre> $oserver = new Auth_OpenID_Server(Auth_OpenID_FileStore($data_path),
 *                                   "http://example.com/op");
 * $request = $oserver->decodeRequest();
 * if (in_array($request->mode, array('checkid_immediate',
 *                                    'checkid_setup'))) {
 *     if ($app->isAuthorized($request->identity, $request->trust_root)) {
 *         $response = $request->answer(true);
 *     } else if ($request->immediate) {
 *         $response = $request->answer(false);
 *     } else {
 *         $app->showDecidePage($request);
 *         return;
 *     }
 * } else {
 *     $response = $oserver->handleRequest($request);
 * }
 *
 * $webresponse = $oserver->encode($response);</pre>
 *
 * @package OpenID
 */
class Auth_OpenID_Server {
    function Auth_OpenID_Server($store, $op_endpoint=null)
    {
        $this->store = $store;
        $this->signatory = new Auth_OpenID_Signatory($this->store);
        $this->encoder = new Auth_OpenID_SigningEncoder($this->signatory);
        $this->decoder = new Auth_OpenID_Decoder($this);
        $this->op_endpoint = $op_endpoint;
        $this->negotiator = Auth_OpenID_getDefaultNegotiator();
    }

    /**
     * Handle a request.  Given an {@link Auth_OpenID_Request} object,
     * call the appropriate {@link Auth_OpenID_Server} method to
     * process the request and generate a response.
     *
     * @param Auth_OpenID_Request $request An {@link Auth_OpenID_Request}
     * returned by {@link Auth_OpenID_Server::decodeRequest()}.
     *
     * @return Auth_OpenID_ServerResponse $response A response object
     * capable of generating a user-agent reply.
     */
    function handleRequest($request)
    {
        if (method_exists($this, "openid_" . $request->mode)) {
            $handler = array($this, "openid_" . $request->mode);
            return call_user_func_array($handler, array($request));
        }
        return null;
    }

    /**
     * The callback for 'check_authentication' messages.
     */
    function openid_check_authentication($request)
    {
        return $request->answer($this->signatory);
    }

    /**
     * The callback for 'associate' messages.
     */
    function openid_associate($request)
    {
        $assoc_type = $request->assoc_type;
        $session_type = $request->session->session_type;
        if ($this->negotiator->isAllowed($assoc_type, $session_type)) {
            $assoc = $this->signatory->createAssociation(false,
                                                         $assoc_type);
            return $request->answer($assoc);
        } else {
            $message = sprintf('Association type %s is not supported with '.
                               'session type %s', $assoc_type, $session_type);
            list($preferred_assoc_type, $preferred_session_type) =
                $this->negotiator->getAllowedType();
            return $request->answerUnsupported($message,
                                               $preferred_assoc_type,
                                               $preferred_session_type);
        }
    }

    /**
     * Encodes as response in the appropriate format suitable for
     * sending to the user agent.
     */
    function encodeResponse($response)
    {
        return $this->encoder->encode($response);
    }

    /**
     * Decodes a query args array into the appropriate
     * {@link Auth_OpenID_Request} object.
     */
    function decodeRequest($query=null)
    {
        if ($query === null) {
            $query = Auth_OpenID::getQuery();
        }

        return $this->decoder->decode($query);
    }
}


