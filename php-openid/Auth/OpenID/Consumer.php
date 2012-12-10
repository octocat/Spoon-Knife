<?php

/**
 * This module documents the main interface with the OpenID consumer
 * library.  The only part of the library which has to be used and
 * isn't documented in full here is the store required to create an
 * Auth_OpenID_Consumer instance.  More on the abstract store type and
 * concrete implementations of it that are provided in the
 * documentation for the Auth_OpenID_Consumer constructor.
 *
 * OVERVIEW
 *
 * The OpenID identity verification process most commonly uses the
 * following steps, as visible to the user of this library:
 *
 *   1. The user enters their OpenID into a field on the consumer's
 *      site, and hits a login button.
 *   2. The consumer site discovers the user's OpenID server using the
 *      YADIS protocol.
 *   3. The consumer site sends the browser a redirect to the identity
 *      server.  This is the authentication request as described in
 *      the OpenID specification.
 *   4. The identity server's site sends the browser a redirect back
 *      to the consumer site.  This redirect contains the server's
 *      response to the authentication request.
 *
 * The most important part of the flow to note is the consumer's site
 * must handle two separate HTTP requests in order to perform the full
 * identity check.
 *
 * LIBRARY DESIGN
 * 
 * This consumer library is designed with that flow in mind.  The goal
 * is to make it as easy as possible to perform the above steps
 * securely.
 *
 * At a high level, there are two important parts in the consumer
 * library.  The first important part is this module, which contains
 * the interface to actually use this library.  The second is the
 * Auth_OpenID_Interface class, which describes the interface to use
 * if you need to create a custom method for storing the state this
 * library needs to maintain between requests.
 *
 * In general, the second part is less important for users of the
 * library to know about, as several implementations are provided
 * which cover a wide variety of situations in which consumers may use
 * the library.
 *
 * This module contains a class, Auth_OpenID_Consumer, with methods
 * corresponding to the actions necessary in each of steps 2, 3, and 4
 * described in the overview.  Use of this library should be as easy
 * as creating an Auth_OpenID_Consumer instance and calling the
 * methods appropriate for the action the site wants to take.
 *
 * STORES AND DUMB MODE
 *
 * OpenID is a protocol that works best when the consumer site is able
 * to store some state.  This is the normal mode of operation for the
 * protocol, and is sometimes referred to as smart mode.  There is
 * also a fallback mode, known as dumb mode, which is available when
 * the consumer site is not able to store state.  This mode should be
 * avoided when possible, as it leaves the implementation more
 * vulnerable to replay attacks.
 *
 * The mode the library works in for normal operation is determined by
 * the store that it is given.  The store is an abstraction that
 * handles the data that the consumer needs to manage between http
 * requests in order to operate efficiently and securely.
 *
 * Several store implementation are provided, and the interface is
 * fully documented so that custom stores can be used as well.  See
 * the documentation for the Auth_OpenID_Consumer class for more
 * information on the interface for stores.  The implementations that
 * are provided allow the consumer site to store the necessary data in
 * several different ways, including several SQL databases and normal
 * files on disk.
 *
 * There is an additional concrete store provided that puts the system
 * in dumb mode.  This is not recommended, as it removes the library's
 * ability to stop replay attacks reliably.  It still uses time-based
 * checking to make replay attacks only possible within a small
 * window, but they remain possible within that window.  This store
 * should only be used if the consumer site has no way to retain data
 * between requests at all.
 *
 * IMMEDIATE MODE
 *
 * In the flow described above, the user may need to confirm to the
 * lidentity server that it's ok to authorize his or her identity.
 * The server may draw pages asking for information from the user
 * before it redirects the browser back to the consumer's site.  This
 * is generally transparent to the consumer site, so it is typically
 * ignored as an implementation detail.
 *
 * There can be times, however, where the consumer site wants to get a
 * response immediately.  When this is the case, the consumer can put
 * the library in immediate mode.  In immediate mode, there is an
 * extra response possible from the server, which is essentially the
 * server reporting that it doesn't have enough information to answer
 * the question yet.
 *
 * USING THIS LIBRARY
 *
 * Integrating this library into an application is usually a
 * relatively straightforward process.  The process should basically
 * follow this plan:
 *
 * Add an OpenID login field somewhere on your site.  When an OpenID
 * is entered in that field and the form is submitted, it should make
 * a request to the your site which includes that OpenID URL.
 *
 * First, the application should instantiate the Auth_OpenID_Consumer
 * class using the store of choice (Auth_OpenID_FileStore or one of
 * the SQL-based stores).  If the application has a custom
 * session-management implementation, an object implementing the
 * {@link Auth_Yadis_PHPSession} interface should be passed as the
 * second parameter.  Otherwise, the default uses $_SESSION.
 *
 * Next, the application should call the Auth_OpenID_Consumer object's
 * 'begin' method.  This method takes the OpenID URL.  The 'begin'
 * method returns an Auth_OpenID_AuthRequest object.
 *
 * Next, the application should call the 'redirectURL' method of the
 * Auth_OpenID_AuthRequest object.  The 'return_to' URL parameter is
 * the URL that the OpenID server will send the user back to after
 * attempting to verify his or her identity.  The 'trust_root' is the
 * URL (or URL pattern) that identifies your web site to the user when
 * he or she is authorizing it.  Send a redirect to the resulting URL
 * to the user's browser.
 *
 * That's the first half of the authentication process.  The second
 * half of the process is done after the user's ID server sends the
 * user's browser a redirect back to your site to complete their
 * login.
 *
 * When that happens, the user will contact your site at the URL given
 * as the 'return_to' URL to the Auth_OpenID_AuthRequest::redirectURL
 * call made above.  The request will have several query parameters
 * added to the URL by the identity server as the information
 * necessary to finish the request.
 *
 * Lastly, instantiate an Auth_OpenID_Consumer instance as above and
 * call its 'complete' method, passing in all the received query
 * arguments.
 *
 * There are multiple possible return types possible from that
 * method. These indicate the whether or not the login was successful,
 * and include any additional information appropriate for their type.
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
 * Require utility classes and functions for the consumer.
 */
require_once "Auth/OpenID.php";
require_once "Auth/OpenID/Message.php";
require_once "Auth/OpenID/HMAC.php";
require_once "Auth/OpenID/Association.php";
require_once "Auth/OpenID/CryptUtil.php";
require_once "Auth/OpenID/DiffieHellman.php";
require_once "Auth/OpenID/KVForm.php";
require_once "Auth/OpenID/Nonce.php";
require_once "Auth/OpenID/Discover.php";
require_once "Auth/OpenID/URINorm.php";
require_once "Auth/Yadis/Manager.php";
require_once "Auth/Yadis/XRI.php";

/**
 * This is the status code returned when the complete method returns
 * successfully.
 */
define('Auth_OpenID_SUCCESS', 'success');

/**
 * Status to indicate cancellation of OpenID authentication.
 */
define('Auth_OpenID_CANCEL', 'cancel');

/**
 * This is the status code completeAuth returns when the value it
 * received indicated an invalid login.
 */
define('Auth_OpenID_FAILURE', 'failure');

/**
 * This is the status code completeAuth returns when the
 * {@link Auth_OpenID_Consumer} instance is in immediate mode, and the
 * identity server sends back a URL to send the user to to complete his
 * or her login.
 */
define('Auth_OpenID_SETUP_NEEDED', 'setup needed');

/**
 * This is the status code beginAuth returns when the page fetched
 * from the entered OpenID URL doesn't contain the necessary link tags
 * to function as an identity page.
 */
define('Auth_OpenID_PARSE_ERROR', 'parse error');

/**
 * An OpenID consumer implementation that performs discovery and does
 * session management.  See the Consumer.php file documentation for
 * more information.
 *
 * @package OpenID
 */
class Auth_OpenID_Consumer {

    /**
     * @access private
     */
    var $discoverMethod = 'Auth_OpenID_discover';

    /**
     * @access private
     */
    var $session_key_prefix = "_openid_consumer_";

    /**
     * @access private
     */
    var $_token_suffix = "last_token";

    /**
     * Initialize a Consumer instance.
     *
     * You should create a new instance of the Consumer object with
     * every HTTP request that handles OpenID transactions.
     *
     * @param Auth_OpenID_OpenIDStore $store This must be an object
     * that implements the interface in {@link
     * Auth_OpenID_OpenIDStore}.  Several concrete implementations are
     * provided, to cover most common use cases.  For stores backed by
     * MySQL, PostgreSQL, or SQLite, see the {@link
     * Auth_OpenID_SQLStore} class and its sublcasses.  For a
     * filesystem-backed store, see the {@link Auth_OpenID_FileStore}
     * module.  As a last resort, if it isn't possible for the server
     * to store state at all, an instance of {@link
     * Auth_OpenID_DumbStore} can be used.
     *
     * @param mixed $session An object which implements the interface
     * of the {@link Auth_Yadis_PHPSession} class.  Particularly, this
     * object is expected to have these methods: get($key), set($key),
     * $value), and del($key).  This defaults to a session object
     * which wraps PHP's native session machinery.  You should only
     * need to pass something here if you have your own sessioning
     * implementation.
     *
     * @param str $consumer_cls The name of the class to instantiate
     * when creating the internal consumer object.  This is used for
     * testing.
     */
    function Auth_OpenID_Consumer($store, $session = null,
                                  $consumer_cls = null)
    {
        if ($session === null) {
            $session = new Auth_Yadis_PHPSession();
        }

        $this->session = $session;

        if ($consumer_cls !== null) {
            $this->consumer = new $consumer_cls($store);
        } else {
            $this->consumer = new Auth_OpenID_GenericConsumer($store);
        }

        $this->_token_key = $this->session_key_prefix . $this->_token_suffix;
    }

    /**
     * Used in testing to define the discovery mechanism.
     *
     * @access private
     */
    function getDiscoveryObject($session, $openid_url,
                                $session_key_prefix)
    {
        return new Auth_Yadis_Discovery($session, $openid_url,
                                        $session_key_prefix);
    }

    /**
     * Start the OpenID authentication process. See steps 1-2 in the
     * overview at the top of this file.
     *
     * @param string $user_url Identity URL given by the user. This
     * method performs a textual transformation of the URL to try and
     * make sure it is normalized. For example, a user_url of
     * example.com will be normalized to http://example.com/
     * normalizing and resolving any redirects the server might issue.
     *
     * @param bool $anonymous True if the OpenID request is to be sent
     * to the server without any identifier information.  Use this
     * when you want to transport data but don't want to do OpenID
     * authentication with identifiers.
     *
     * @return Auth_OpenID_AuthRequest $auth_request An object
     * containing the discovered information will be returned, with a
     * method for building a redirect URL to the server, as described
     * in step 3 of the overview. This object may also be used to add
     * extension arguments to the request, using its 'addExtensionArg'
     * method.
     */
    function begin($user_url, $anonymous=false)
    {
        $openid_url = $user_url;

        $disco = $this->getDiscoveryObject($this->session,
                                           $openid_url,
                                           $this->session_key_prefix);

        // Set the 'stale' attribute of the manager.  If discovery
        // fails in a fatal way, the stale flag will cause the manager
        // to be cleaned up next time discovery is attempted.

        $m = $disco->getManager();
        $loader = new Auth_Yadis_ManagerLoader();

        if ($m) {
            if ($m->stale) {
                $disco->destroyManager();
            } else {
                $m->stale = true;
                $disco->session->set($disco->session_key,
                                     serialize($loader->toSession($m)));
            }
        }

        $endpoint = $disco->getNextService($this->discoverMethod,
                                           $this->consumer->fetcher);

        // Reset the 'stale' attribute of the manager.
        $m = $disco->getManager();
        if ($m) {
            $m->stale = false;
            $disco->session->set($disco->session_key,
                                 serialize($loader->toSession($m)));
        }

        if ($endpoint === null) {
            return null;
        } else {
            return $this->beginWithoutDiscovery($endpoint,
                                                $anonymous);
        }
    }

    /**
     * Start OpenID verification without doing OpenID server
     * discovery. This method is used internally by Consumer.begin
     * after discovery is performed, and exists to provide an
     * interface for library users needing to perform their own
     * discovery.
     *
     * @param Auth_OpenID_ServiceEndpoint $endpoint an OpenID service
     * endpoint descriptor.
     *
     * @param bool anonymous Set to true if you want to perform OpenID
     * without identifiers.
     *
     * @return Auth_OpenID_AuthRequest $auth_request An OpenID
     * authentication request object.
     */
    function beginWithoutDiscovery($endpoint, $anonymous=false)
    {
        $loader = new Auth_OpenID_ServiceEndpointLoader();
        $auth_req = $this->consumer->begin($endpoint);
        $this->session->set($this->_token_key,
              $loader->toSession($auth_req->endpoint));
        if (!$auth_req->setAnonymous($anonymous)) {
            return new Auth_OpenID_FailureResponse(null,
              "OpenID 1 requests MUST include the identifier " .
              "in the request.");
        }
        return $auth_req;
    }

    /**
     * Called to interpret the server's response to an OpenID
     * request. It is called in step 4 of the flow described in the
     * consumer overview.
     *
     * @param string $current_url The URL used to invoke the application.
     * Extract the URL from your application's web
     * request framework and specify it here to have it checked
     * against the openid.current_url value in the response.  If
     * the current_url URL check fails, the status of the
     * completion will be FAILURE.
     *
     * @param array $query An array of the query parameters (key =>
     * value pairs) for this HTTP request.  Defaults to null.  If
     * null, the GET or POST data are automatically gotten from the
     * PHP environment.  It is only useful to override $query for
     * testing.
     *
     * @return Auth_OpenID_ConsumerResponse $response A instance of an
     * Auth_OpenID_ConsumerResponse subclass. The type of response is
     * indicated by the status attribute, which will be one of
     * SUCCESS, CANCEL, FAILURE, or SETUP_NEEDED.
     */
    function complete($current_url, $query=null)
    {
        if ($current_url && !is_string($current_url)) {
            // This is ugly, but we need to complain loudly when
            // someone uses the API incorrectly.
            trigger_error("current_url must be a string; see NEWS file " .
                          "for upgrading notes.",
                          E_USER_ERROR);
        }

        if ($query === null) {
            $query = Auth_OpenID::getQuery();
        }

        $loader = new Auth_OpenID_ServiceEndpointLoader();
        $endpoint_data = $this->session->get($this->_token_key);
        $endpoint =
            $loader->fromSession($endpoint_data);

        $message = Auth_OpenID_Message::fromPostArgs($query);
        $response = $this->consumer->complete($message, $endpoint, 
                                              $current_url);
        $this->session->del($this->_token_key);

        if (in_array($response->status, array(Auth_OpenID_SUCCESS,
                                              Auth_OpenID_CANCEL))) {
            if ($response->identity_url !== null) {
                $disco = $this->getDiscoveryObject($this->session,
                                                   $response->identity_url,
                                                   $this->session_key_prefix);
                $disco->cleanup(true);
            }
        }

        return $response;
    }
}

/**
 * A class implementing HMAC/DH-SHA1 consumer sessions.
 *
 * @package OpenID
 */
class Auth_OpenID_DiffieHellmanSHA1ConsumerSession {
    var $session_type = 'DH-SHA1';
    var $hash_func = 'Auth_OpenID_SHA1';
    var $secret_size = 20;
    var $allowed_assoc_types = array('HMAC-SHA1');

    function Auth_OpenID_DiffieHellmanSHA1ConsumerSession($dh = null)
    {
        if ($dh === null) {
            $dh = new Auth_OpenID_DiffieHellman();
        }

        $this->dh = $dh;
    }

    function getRequest()
    {
        $math = Auth_OpenID_getMathLib();

        $cpub = $math->longToBase64($this->dh->public);

        $args = array('dh_consumer_public' => $cpub);

        if (!$this->dh->usingDefaultValues()) {
            $args = array_merge($args, array(
                'dh_modulus' =>
                     $math->longToBase64($this->dh->mod),
                'dh_gen' =>
                     $math->longToBase64($this->dh->gen)));
        }

        return $args;
    }

    function extractSecret($response)
    {
        if (!$response->hasKey(Auth_OpenID_OPENID_NS,
                               'dh_server_public')) {
            return null;
        }

        if (!$response->hasKey(Auth_OpenID_OPENID_NS,
                               'enc_mac_key')) {
            return null;
        }

        $math = Auth_OpenID_getMathLib();

        $spub = $math->base64ToLong($response->getArg(Auth_OpenID_OPENID_NS,
                                                      'dh_server_public'));
        $enc_mac_key = base64_decode($response->getArg(Auth_OpenID_OPENID_NS,
                                                       'enc_mac_key'));

        return $this->dh->xorSecret($spub, $enc_mac_key, $this->hash_func);
    }
}

/**
 * A class implementing HMAC/DH-SHA256 consumer sessions.
 *
 * @package OpenID
 */
class Auth_OpenID_DiffieHellmanSHA256ConsumerSession extends
      Auth_OpenID_DiffieHellmanSHA1ConsumerSession {
    var $session_type = 'DH-SHA256';
    var $hash_func = 'Auth_OpenID_SHA256';
    var $secret_size = 32;
    var $allowed_assoc_types = array('HMAC-SHA256');
}

/**
 * A class implementing plaintext consumer sessions.
 *
 * @package OpenID
 */
class Auth_OpenID_PlainTextConsumerSession {
    var $session_type = 'no-encryption';
    var $allowed_assoc_types =  array('HMAC-SHA1', 'HMAC-SHA256');

    function getRequest()
    {
        return array();
    }

    function extractSecret($response)
    {
        if (!$response->hasKey(Auth_OpenID_OPENID_NS, 'mac_key')) {
            return null;
        }

        return base64_decode($response->getArg(Auth_OpenID_OPENID_NS,
                                               'mac_key'));
    }
}

/**
 * Returns available session types.
 */
function Auth_OpenID_getAvailableSessionTypes()
{
    $types = array(
      'no-encryption' => 'Auth_OpenID_PlainTextConsumerSession',
      'DH-SHA1' => 'Auth_OpenID_DiffieHellmanSHA1ConsumerSession',
      'DH-SHA256' => 'Auth_OpenID_DiffieHellmanSHA256ConsumerSession');

    return $types;
}

/**
 * This class is the interface to the OpenID consumer logic.
 * Instances of it maintain no per-request state, so they can be
 * reused (or even used by multiple threads concurrently) as needed.
 *
 * @package OpenID
 */
class Auth_OpenID_GenericConsumer {
    /**
     * @access private
     */
    var $discoverMethod = 'Auth_OpenID_discover';

    /**
     * This consumer's store object.
     */
    var $store;

    /**
     * @access private
     */
    var $_use_assocs;

    /**
     * @access private
     */
    var $openid1_nonce_query_arg_name = 'janrain_nonce';

    /**
     * Another query parameter that gets added to the return_to for
     * OpenID 1; if the user's session state is lost, use this claimed
     * identifier to do discovery when verifying the response.
     */
    var $openid1_return_to_identifier_name = 'openid1_claimed_id';

    /**
     * This method initializes a new {@link Auth_OpenID_Consumer}
     * instance to access the library.
     *
     * @param Auth_OpenID_OpenIDStore $store This must be an object
     * that implements the interface in {@link Auth_OpenID_OpenIDStore}.
     * Several concrete implementations are provided, to cover most common use
     * cases.  For stores backed by MySQL, PostgreSQL, or SQLite, see
     * the {@link Auth_OpenID_SQLStore} class and its sublcasses.  For a
     * filesystem-backed store, see the {@link Auth_OpenID_FileStore} module.
     * As a last resort, if it isn't possible for the server to store
     * state at all, an instance of {@link Auth_OpenID_DumbStore} can be used.
     *
     * @param bool $immediate This is an optional boolean value.  It
     * controls whether the library uses immediate mode, as explained
     * in the module description.  The default value is False, which
     * disables immediate mode.
     */
    function Auth_OpenID_GenericConsumer($store)
    {
        $this->store = $store;
        $this->negotiator = Auth_OpenID_getDefaultNegotiator();
        $this->_use_assocs = (is_null($this->store) ? false : true);

        $this->fetcher = Auth_Yadis_Yadis::getHTTPFetcher();

        $this->session_types = Auth_OpenID_getAvailableSessionTypes();
    }

    /**
     * Called to begin OpenID authentication using the specified
     * {@link Auth_OpenID_ServiceEndpoint}.
     *
     * @access private
     */
    function begin($service_endpoint)
    {
        $assoc = $this->_getAssociation($service_endpoint);
        $r = new Auth_OpenID_AuthRequest($service_endpoint, $assoc);
        $r->return_to_args[$this->openid1_nonce_query_arg_name] =
            Auth_OpenID_mkNonce();

        if ($r->message->isOpenID1()) {
            $r->return_to_args[$this->openid1_return_to_identifier_name] =
                $r->endpoint->claimed_id;
        }

        return $r;
    }

    /**
     * Given an {@link Auth_OpenID_Message}, {@link
     * Auth_OpenID_ServiceEndpoint} and optional return_to URL,
     * complete OpenID authentication.
     *
     * @access private
     */
    function complete($message, $endpoint, $return_to)
    {
        $mode = $message->getArg(Auth_OpenID_OPENID_NS, 'mode',
                                 '<no mode set>');

        $mode_methods = array(
                              'cancel' => '_complete_cancel',
                              'error' => '_complete_error',
                              'setup_needed' => '_complete_setup_needed',
                              'id_res' => '_complete_id_res',
                              );

        $method = Auth_OpenID::arrayGet($mode_methods, $mode,
                                        '_completeInvalid');

        return call_user_func_array(array($this, $method),
                                    array($message, &$endpoint, $return_to));
    }

    /**
     * @access private
     */
    function _completeInvalid($message, $endpoint, $unused)
    {
        $mode = $message->getArg(Auth_OpenID_OPENID_NS, 'mode',
                                 '<No mode set>');

        return new Auth_OpenID_FailureResponse($endpoint,
                    sprintf("Invalid openid.mode '%s'", $mode));
    }

    /**
     * @access private
     */
    function _complete_cancel($message, $endpoint, $unused)
    {
        return new Auth_OpenID_CancelResponse($endpoint);
    }

    /**
     * @access private
     */
    function _complete_error($message, $endpoint, $unused)
    {
        $error = $message->getArg(Auth_OpenID_OPENID_NS, 'error');
        $contact = $message->getArg(Auth_OpenID_OPENID_NS, 'contact');
        $reference = $message->getArg(Auth_OpenID_OPENID_NS, 'reference');

        return new Auth_OpenID_FailureResponse($endpoint, $error,
                                               $contact, $reference);
    }

    /**
     * @access private
     */
    function _complete_setup_needed($message, $endpoint, $unused)
    {
        if (!$message->isOpenID2()) {
            return $this->_completeInvalid($message, $endpoint);
        }

        $user_setup_url = $message->getArg(Auth_OpenID_OPENID2_NS,
                                           'user_setup_url');
        return new Auth_OpenID_SetupNeededResponse($endpoint, $user_setup_url);
    }

    /**
     * @access private
     */
    function _complete_id_res($message, $endpoint, $return_to)
    {
        $user_setup_url = $message->getArg(Auth_OpenID_OPENID1_NS,
                                           'user_setup_url');

        if ($this->_checkSetupNeeded($message)) {
            return new Auth_OpenID_SetupNeededResponse(
                $endpoint, $user_setup_url);
        } else {
            return $this->_doIdRes($message, $endpoint, $return_to);
        }
    }

    /**
     * @access private
     */
    function _checkSetupNeeded($message)
    {
        // In OpenID 1, we check to see if this is a cancel from
        // immediate mode by the presence of the user_setup_url
        // parameter.
        if ($message->isOpenID1()) {
            $user_setup_url = $message->getArg(Auth_OpenID_OPENID1_NS,
                                               'user_setup_url');
            if ($user_setup_url !== null) {
                return true;
            }
        }

        return false;
    }

    /**
     * @access private
     */
    function _doIdRes($message, $endpoint, $return_to)
    {
        // Checks for presence of appropriate fields (and checks
        // signed list fields)
        $result = $this->_idResCheckForFields($message);

        if (Auth_OpenID::isFailure($result)) {
            return $result;
        }

        if (!$this->_checkReturnTo($message, $return_to)) {
            return new Auth_OpenID_FailureResponse(null,
            sprintf("return_to does not match return URL. Expected %s, got %s",
                    $return_to,
                    $message->getArg(Auth_OpenID_OPENID_NS, 'return_to')));
        }

        // Verify discovery information:
        $result = $this->_verifyDiscoveryResults($message, $endpoint);

        if (Auth_OpenID::isFailure($result)) {
            return $result;
        }

        $endpoint = $result;

        $result = $this->_idResCheckSignature($message,
                                              $endpoint->server_url);

        if (Auth_OpenID::isFailure($result)) {
            return $result;
        }

        $result = $this->_idResCheckNonce($message, $endpoint);

        if (Auth_OpenID::isFailure($result)) {
            return $result;
        }

        $signed_list_str = $message->getArg(Auth_OpenID_OPENID_NS, 'signed',
                                            Auth_OpenID_NO_DEFAULT);
        if (Auth_OpenID::isFailure($signed_list_str)) {
            return $signed_list_str;
        }
        $signed_list = explode(',', $signed_list_str);

        $signed_fields = Auth_OpenID::addPrefix($signed_list, "openid.");

        return new Auth_OpenID_SuccessResponse($endpoint, $message,
                                               $signed_fields);

    }

    /**
     * @access private
     */
    function _checkReturnTo($message, $return_to)
    {
        // Check an OpenID message and its openid.return_to value
        // against a return_to URL from an application.  Return True
        // on success, False on failure.

        // Check the openid.return_to args against args in the
        // original message.
        $result = Auth_OpenID_GenericConsumer::_verifyReturnToArgs(
                                           $message->toPostArgs());
        if (Auth_OpenID::isFailure($result)) {
            return false;
        }

        // Check the return_to base URL against the one in the
        // message.
        $msg_return_to = $message->getArg(Auth_OpenID_OPENID_NS,
                                          'return_to');
        if (Auth_OpenID::isFailure($return_to)) {
            // XXX log me
            return false;
        }

        $return_to_parts = parse_url(Auth_OpenID_urinorm($return_to));
        $msg_return_to_parts = parse_url(Auth_OpenID_urinorm($msg_return_to));

        // If port is absent from both, add it so it's equal in the
        // check below.
        if ((!array_key_exists('port', $return_to_parts)) &&
            (!array_key_exists('port', $msg_return_to_parts))) {
            $return_to_parts['port'] = null;
            $msg_return_to_parts['port'] = null;
        }

        // If path is absent from both, add it so it's equal in the
        // check below.
        if ((!array_key_exists('path', $return_to_parts)) &&
            (!array_key_exists('path', $msg_return_to_parts))) {
            $return_to_parts['path'] = null;
            $msg_return_to_parts['path'] = null;
        }

        // The URL scheme, authority, and path MUST be the same
        // between the two URLs.
        foreach (array('scheme', 'host', 'port', 'path') as $component) {
            // If the url component is absent in either URL, fail.
            // There should always be a scheme, host, port, and path.
            if (!array_key_exists($component, $return_to_parts)) {
                return false;
            }

            if (!array_key_exists($component, $msg_return_to_parts)) {
                return false;
            }

            if (Auth_OpenID::arrayGet($return_to_parts, $component) !==
                Auth_OpenID::arrayGet($msg_return_to_parts, $component)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @access private
     */
    function _verifyReturnToArgs($query)
    {
        // Verify that the arguments in the return_to URL are present in this
        // response.

        $message = Auth_OpenID_Message::fromPostArgs($query);
        $return_to = $message->getArg(Auth_OpenID_OPENID_NS, 'return_to');

        if (Auth_OpenID::isFailure($return_to)) {
            return $return_to;
        }
        // XXX: this should be checked by _idResCheckForFields
        if (!$return_to) {
            return new Auth_OpenID_FailureResponse(null,
                           "Response has no return_to");
        }

        $parsed_url = parse_url($return_to);

        $q = array();
        if (array_key_exists('query', $parsed_url)) {
            $rt_query = $parsed_url['query'];
            $q = Auth_OpenID::parse_str($rt_query);
        }

        foreach ($q as $rt_key => $rt_value) {
            if (!array_key_exists($rt_key, $query)) {
                return new Auth_OpenID_FailureResponse(null,
                  sprintf("return_to parameter %s absent from query", $rt_key));
            } else {
                $value = $query[$rt_key];
                if ($rt_value != $value) {
                    return new Auth_OpenID_FailureResponse(null,
                      sprintf("parameter %s value %s does not match " .
                              "return_to value %s", $rt_key,
                              $value, $rt_value));
                }
            }
        }

        // Make sure all non-OpenID arguments in the response are also
        // in the signed return_to.
        $bare_args = $message->getArgs(Auth_OpenID_BARE_NS);
        foreach ($bare_args as $key => $value) {
            if (Auth_OpenID::arrayGet($q, $key) != $value) {
                return new Auth_OpenID_FailureResponse(null,
                  sprintf("Parameter %s = %s not in return_to URL",
                          $key, $value));
            }
        }

        return true;
    }

    /**
     * @access private
     */
    function _idResCheckSignature($message, $server_url)
    {
        $assoc_handle = $message->getArg(Auth_OpenID_OPENID_NS,
                                         'assoc_handle');
        if (Auth_OpenID::isFailure($assoc_handle)) {
            return $assoc_handle;
        }

        $assoc = $this->store->getAssociation($server_url, $assoc_handle);

        if ($assoc) {
            if ($assoc->getExpiresIn() <= 0) {
                // XXX: It might be a good idea sometimes to re-start
                // the authentication with a new association. Doing it
                // automatically opens the possibility for
                // denial-of-service by a server that just returns
                // expired associations (or really short-lived
                // associations)
                return new Auth_OpenID_FailureResponse(null,
                             'Association with ' . $server_url . ' expired');
            }

            if (!$assoc->checkMessageSignature($message)) {
                // If we get a "bad signature" here, it means that the association
                // is unrecoverabley corrupted in some way. Any futher attempts
                // to login with this association is likely to fail. Drop it.
                $this->store->removeAssociation($server_url, $assoc_handle);
                return new Auth_OpenID_FailureResponse(null,
                                                       "Bad signature");
            }
        } else {
            // It's not an association we know about.  Stateless mode
            // is our only possible path for recovery.  XXX - async
            // framework will not want to block on this call to
            // _checkAuth.
            if (!$this->_checkAuth($message, $server_url)) {
                return new Auth_OpenID_FailureResponse(null,
                             "Server denied check_authentication");
            }
        }

        return null;
    }

    /**
     * @access private
     */
    function _verifyDiscoveryResults($message, $endpoint=null)
    {
        if ($message->getOpenIDNamespace() == Auth_OpenID_OPENID2_NS) {
            return $this->_verifyDiscoveryResultsOpenID2($message,
                                                         $endpoint);
        } else {
            return $this->_verifyDiscoveryResultsOpenID1($message,
                                                         $endpoint);
        }
    }

    /**
     * @access private
     */
    function _verifyDiscoveryResultsOpenID1($message, $endpoint)
    {
        $claimed_id = $message->getArg(Auth_OpenID_BARE_NS,
                                $this->openid1_return_to_identifier_name);

        if (($endpoint === null) && ($claimed_id === null)) {
            return new Auth_OpenID_FailureResponse($endpoint,
              'When using OpenID 1, the claimed ID must be supplied, ' .
              'either by passing it through as a return_to parameter ' .
              'or by using a session, and supplied to the GenericConsumer ' .
              'as the argument to complete()');
        } else if (($endpoint !== null) && ($claimed_id === null)) {
            $claimed_id = $endpoint->claimed_id;
        }

        $to_match = new Auth_OpenID_ServiceEndpoint();
        $to_match->type_uris = array(Auth_OpenID_TYPE_1_1);
        $to_match->local_id = $message->getArg(Auth_OpenID_OPENID1_NS,
                                               'identity');

        // Restore delegate information from the initiation phase
        $to_match->claimed_id = $claimed_id;

        if ($to_match->local_id === null) {
            return new Auth_OpenID_FailureResponse($endpoint,
                         "Missing required field openid.identity");
        }

        $to_match_1_0 = $to_match->copy();
        $to_match_1_0->type_uris = array(Auth_OpenID_TYPE_1_0);

        if ($endpoint !== null) {
            $result = $this->_verifyDiscoverySingle($endpoint, $to_match);

            if (is_a($result, 'Auth_OpenID_TypeURIMismatch')) {
                $result = $this->_verifyDiscoverySingle($endpoint,
                                                        $to_match_1_0);
            }

            if (Auth_OpenID::isFailure($result)) {
                // oidutil.log("Error attempting to use stored
                //             discovery information: " + str(e))
                //             oidutil.log("Attempting discovery to
                //             verify endpoint")
            } else {
                return $endpoint;
            }
        }

        // Endpoint is either bad (failed verification) or None
        return $this->_discoverAndVerify($to_match->claimed_id,
                                         array($to_match, $to_match_1_0));
    }

    /**
     * @access private
     */
    function _verifyDiscoverySingle($endpoint, $to_match)
    {
        // Every type URI that's in the to_match endpoint has to be
        // present in the discovered endpoint.
        foreach ($to_match->type_uris as $type_uri) {
            if (!$endpoint->usesExtension($type_uri)) {
                return new Auth_OpenID_TypeURIMismatch($endpoint,
                             "Required type ".$type_uri." not present");
            }
        }

        // Fragments do not influence discovery, so we can't compare a
        // claimed identifier with a fragment to discovered
        // information.
        list($defragged_claimed_id, $_) =
            Auth_OpenID::urldefrag($to_match->claimed_id);

        if ($defragged_claimed_id != $endpoint->claimed_id) {
            return new Auth_OpenID_FailureResponse($endpoint,
              sprintf('Claimed ID does not match (different subjects!), ' .
                      'Expected %s, got %s', $defragged_claimed_id,
                      $endpoint->claimed_id));
        }

        if ($to_match->getLocalID() != $endpoint->getLocalID()) {
            return new Auth_OpenID_FailureResponse($endpoint,
              sprintf('local_id mismatch. Expected %s, got %s',
                      $to_match->getLocalID(), $endpoint->getLocalID()));
        }

        // If the server URL is None, this must be an OpenID 1
        // response, because op_endpoint is a required parameter in
        // OpenID 2. In that case, we don't actually care what the
        // discovered server_url is, because signature checking or
        // check_auth should take care of that check for us.
        if ($to_match->server_url === null) {
            if ($to_match->preferredNamespace() != Auth_OpenID_OPENID1_NS) {
                return new Auth_OpenID_FailureResponse($endpoint,
                             "Preferred namespace mismatch (bug)");
            }
        } else if ($to_match->server_url != $endpoint->server_url) {
            return new Auth_OpenID_FailureResponse($endpoint,
              sprintf('OP Endpoint mismatch. Expected %s, got %s',
                      $to_match->server_url, $endpoint->server_url));
        }

        return null;
    }

    /**
     * @access private
     */
    function _verifyDiscoveryResultsOpenID2($message, $endpoint)
    {
        $to_match = new Auth_OpenID_ServiceEndpoint();
        $to_match->type_uris = array(Auth_OpenID_TYPE_2_0);
        $to_match->claimed_id = $message->getArg(Auth_OpenID_OPENID2_NS,
                                                 'claimed_id');

        $to_match->local_id = $message->getArg(Auth_OpenID_OPENID2_NS,
                                                'identity');

        $to_match->server_url = $message->getArg(Auth_OpenID_OPENID2_NS,
                                                 'op_endpoint');

        if ($to_match->server_url === null) {
            return new Auth_OpenID_FailureResponse($endpoint,
                         "OP Endpoint URL missing");
        }

        // claimed_id and identifier must both be present or both be
        // absent
        if (($to_match->claimed_id === null) &&
            ($to_match->local_id !== null)) {
            return new Auth_OpenID_FailureResponse($endpoint,
              'openid.identity is present without openid.claimed_id');
        }

        if (($to_match->claimed_id !== null) &&
            ($to_match->local_id === null)) {
            return new Auth_OpenID_FailureResponse($endpoint,
              'openid.claimed_id is present without openid.identity');
        }

        if ($to_match->claimed_id === null) {
            // This is a response without identifiers, so there's
            // really no checking that we can do, so return an
            // endpoint that's for the specified `openid.op_endpoint'
            return Auth_OpenID_ServiceEndpoint::fromOPEndpointURL(
                                                $to_match->server_url);
        }

        if (!$endpoint) {
            // The claimed ID doesn't match, so we have to do
            // discovery again. This covers not using sessions, OP
            // identifier endpoints and responses that didn't match
            // the original request.
            // oidutil.log('No pre-discovered information supplied.')
            return $this->_discoverAndVerify($to_match->claimed_id,
                                             array($to_match));
        } else {

            // The claimed ID matches, so we use the endpoint that we
            // discovered in initiation. This should be the most
            // common case.
            $result = $this->_verifyDiscoverySingle($endpoint, $to_match);

            if (Auth_OpenID::isFailure($result)) {
                $endpoint = $this->_discoverAndVerify($to_match->claimed_id,
                                                      array($to_match));
                if (Auth_OpenID::isFailure($endpoint)) {
                    return $endpoint;
                }
            }
        }

        // The endpoint we return should have the claimed ID from the
        // message we just verified, fragment and all.
        if ($endpoint->claimed_id != $to_match->claimed_id) {
            $endpoint->claimed_id = $to_match->claimed_id;
        }

        return $endpoint;
    }

    /**
     * @access private
     */
    function _discoverAndVerify($claimed_id, $to_match_endpoints)
    {
        // oidutil.log('Performing discovery on %s' % (claimed_id,))
        list($unused, $services) = call_user_func_array($this->discoverMethod,
                                                        array(
                                                            $claimed_id,
                                                            &$this->fetcher,
                                                        ));

        if (!$services) {
            return new Auth_OpenID_FailureResponse(null,
              sprintf("No OpenID information found at %s",
                      $claimed_id));
        }

        return $this->_verifyDiscoveryServices($claimed_id, $services,
                                               $to_match_endpoints);
    }

    /**
     * @access private
     */
    function _verifyDiscoveryServices($claimed_id, 
                                      $services, $to_match_endpoints)
    {
        // Search the services resulting from discovery to find one
        // that matches the information from the assertion

        foreach ($services as $endpoint) {
            foreach ($to_match_endpoints as $to_match_endpoint) {
                $result = $this->_verifyDiscoverySingle($endpoint, 
                                                        $to_match_endpoint);

                if (!Auth_OpenID::isFailure($result)) {
                    // It matches, so discover verification has
                    // succeeded. Return this endpoint.
                    return $endpoint;
                }
            }
        }

        return new Auth_OpenID_FailureResponse(null,
          sprintf('No matching endpoint found after discovering %s: %s',
                  $claimed_id, $result->message));
    }

    /**
     * Extract the nonce from an OpenID 1 response.  Return the nonce
     * from the BARE_NS since we independently check the return_to
     * arguments are the same as those in the response message.
     *
     * See the openid1_nonce_query_arg_name class variable
     *
     * @returns $nonce The nonce as a string or null
     *
     * @access private
     */
    function _idResGetNonceOpenID1($message, $endpoint)
    {
        return $message->getArg(Auth_OpenID_BARE_NS,
                                $this->openid1_nonce_query_arg_name);
    }

    /**
     * @access private
     */
    function _idResCheckNonce($message, $endpoint)
    {
        if ($message->isOpenID1()) {
            // This indicates that the nonce was generated by the consumer
            $nonce = $this->_idResGetNonceOpenID1($message, $endpoint);
            $server_url = '';
        } else {
            $nonce = $message->getArg(Auth_OpenID_OPENID2_NS,
                                      'response_nonce');

            $server_url = $endpoint->server_url;
        }

        if ($nonce === null) {
            return new Auth_OpenID_FailureResponse($endpoint,
                                     "Nonce missing from response");
        }

        $parts = Auth_OpenID_splitNonce($nonce);

        if ($parts === null) {
            return new Auth_OpenID_FailureResponse($endpoint,
                                     "Malformed nonce in response");
        }

        list($timestamp, $salt) = $parts;

        if (!$this->store->useNonce($server_url, $timestamp, $salt)) {
            return new Auth_OpenID_FailureResponse($endpoint,
                         "Nonce already used or out of range");
        }

        return null;
    }

    /**
     * @access private
     */
    function _idResCheckForFields($message)
    {
        $basic_fields = array('return_to', 'assoc_handle', 'sig', 'signed');
        $basic_sig_fields = array('return_to', 'identity');

        $require_fields = array(
            Auth_OpenID_OPENID2_NS => array_merge($basic_fields,
                                                  array('op_endpoint')),

            Auth_OpenID_OPENID1_NS => array_merge($basic_fields,
                                                  array('identity'))
            );

        $require_sigs = array(
            Auth_OpenID_OPENID2_NS => array_merge($basic_sig_fields,
                                                  array('response_nonce',
                                                        'claimed_id',
                                                        'assoc_handle',
                                                        'op_endpoint')),
            Auth_OpenID_OPENID1_NS => array_merge($basic_sig_fields,
                                                  array('nonce'))
            );

        foreach ($require_fields[$message->getOpenIDNamespace()] as $field) {
            if (!$message->hasKey(Auth_OpenID_OPENID_NS, $field)) {
                return new Auth_OpenID_FailureResponse(null,
                             "Missing required field '".$field."'");
            }
        }

        $signed_list_str = $message->getArg(Auth_OpenID_OPENID_NS,
                                            'signed',
                                            Auth_OpenID_NO_DEFAULT);
        if (Auth_OpenID::isFailure($signed_list_str)) {
            return $signed_list_str;
        }
        $signed_list = explode(',', $signed_list_str);

        foreach ($require_sigs[$message->getOpenIDNamespace()] as $field) {
            // Field is present and not in signed list
            if ($message->hasKey(Auth_OpenID_OPENID_NS, $field) &&
                (!in_array($field, $signed_list))) {
                return new Auth_OpenID_FailureResponse(null,
                             "'".$field."' not signed");
            }
        }

        return null;
    }

    /**
     * @access private
     */
    function _checkAuth($message, $server_url)
    {
        $request = $this->_createCheckAuthRequest($message);
        if ($request === null) {
            return false;
        }

        $resp_message = $this->_makeKVPost($request, $server_url);
        if (($resp_message === null) ||
            (is_a($resp_message, 'Auth_OpenID_ServerErrorContainer'))) {
            return false;
        }

        return $this->_processCheckAuthResponse($resp_message, $server_url);
    }

    /**
     * @access private
     */
    function _createCheckAuthRequest($message)
    {
        $signed = $message->getArg(Auth_OpenID_OPENID_NS, 'signed');
        if ($signed) {
            foreach (explode(',', $signed) as $k) {
                $value = $message->getAliasedArg($k);
                if ($value === null) {
                    return null;
                }
            }
        }
        $ca_message = $message->copy();
        $ca_message->setArg(Auth_OpenID_OPENID_NS, 'mode', 
                            'check_authentication');
        return $ca_message;
    }

    /**
     * @access private
     */
    function _processCheckAuthResponse($response, $server_url)
    {
        $is_valid = $response->getArg(Auth_OpenID_OPENID_NS, 'is_valid',
                                      'false');

        $invalidate_handle = $response->getArg(Auth_OpenID_OPENID_NS,
                                               'invalidate_handle');

        if ($invalidate_handle !== null) {
            $this->store->removeAssociation($server_url,
                                            $invalidate_handle);
        }

        if ($is_valid == 'true') {
            return true;
        }

        return false;
    }

    /**
     * Adapt a POST response to a Message.
     *
     * @param $response Result of a POST to an OpenID endpoint.
     *
     * @access private
     */
    static function _httpResponseToMessage($response, $server_url)
    {
        // Should this function be named Message.fromHTTPResponse instead?
        $response_message = Auth_OpenID_Message::fromKVForm($response->body);

        if ($response->status == 400) {
            return Auth_OpenID_ServerErrorContainer::fromMessage(
                        $response_message);
        } else if ($response->status != 200 and $response->status != 206) {
            return null;
        }

        return $response_message;
    }

    /**
     * @access private
     */
    function _makeKVPost($message, $server_url)
    {
        $body = $message->toURLEncoded();
        $resp = $this->fetcher->post($server_url, $body);

        if ($resp === null) {
            return null;
        }

        return $this->_httpResponseToMessage($resp, $server_url);
    }

    /**
     * @access private
     */
    function _getAssociation($endpoint)
    {
        if (!$this->_use_assocs) {
            return null;
        }

        $assoc = $this->store->getAssociation($endpoint->server_url);

        if (($assoc === null) ||
            ($assoc->getExpiresIn() <= 0)) {

            $assoc = $this->_negotiateAssociation($endpoint);

            if ($assoc !== null) {
                $this->store->storeAssociation($endpoint->server_url,
                                               $assoc);
            }
        }

        return $assoc;
    }

    /**
     * Handle ServerErrors resulting from association requests.
     *
     * @return $result If server replied with an C{unsupported-type}
     * error, return a tuple of supported C{association_type},
     * C{session_type}.  Otherwise logs the error and returns null.
     *
     * @access private
     */
    function _extractSupportedAssociationType($server_error, $endpoint,
                                              $assoc_type)
    {
        // Any error message whose code is not 'unsupported-type'
        // should be considered a total failure.
        if (($server_error->error_code != 'unsupported-type') ||
            ($server_error->message->isOpenID1())) {
            return null;
        }

        // The server didn't like the association/session type that we
        // sent, and it sent us back a message that might tell us how
        // to handle it.

        // Extract the session_type and assoc_type from the error
        // message
        $assoc_type = $server_error->message->getArg(Auth_OpenID_OPENID_NS,
                                                     'assoc_type');

        $session_type = $server_error->message->getArg(Auth_OpenID_OPENID_NS,
                                                       'session_type');

        if (($assoc_type === null) || ($session_type === null)) {
            return null;
        } else if (!$this->negotiator->isAllowed($assoc_type,
                                                 $session_type)) {
            return null;
        } else {
          return array($assoc_type, $session_type);
        }
    }

    /**
     * @access private
     */
    function _negotiateAssociation($endpoint)
    {
        // Get our preferred session/association type from the negotiatior.
        list($assoc_type, $session_type) = $this->negotiator->getAllowedType();

        $assoc = $this->_requestAssociation(
                           $endpoint, $assoc_type, $session_type);

        if (Auth_OpenID::isFailure($assoc)) {
            return null;
        }

        if (is_a($assoc, 'Auth_OpenID_ServerErrorContainer')) {
            $why = $assoc;

            $supportedTypes = $this->_extractSupportedAssociationType(
                                     $why, $endpoint, $assoc_type);

            if ($supportedTypes !== null) {
                list($assoc_type, $session_type) = $supportedTypes;

                // Attempt to create an association from the assoc_type
                // and session_type that the server told us it
                // supported.
                $assoc = $this->_requestAssociation(
                                   $endpoint, $assoc_type, $session_type);

                if (is_a($assoc, 'Auth_OpenID_ServerErrorContainer')) {
                    // Do not keep trying, since it rejected the
                    // association type that it told us to use.
                    // oidutil.log('Server %s refused its suggested association
                    //             'type: session_type=%s, assoc_type=%s'
                    //             % (endpoint.server_url, session_type,
                    //                assoc_type))
                    return null;
                } else {
                    return $assoc;
                }
            } else {
                return null;
            }
        } else {
            return $assoc;
        }
    }

    /**
     * @access private
     */
    function _requestAssociation($endpoint, $assoc_type, $session_type)
    {
        list($assoc_session, $args) = $this->_createAssociateRequest(
                                      $endpoint, $assoc_type, $session_type);

        $response_message = $this->_makeKVPost($args, $endpoint->server_url);

        if ($response_message === null) {
            // oidutil.log('openid.associate request failed: %s' % (why[0],))
            return null;
        } else if (is_a($response_message,
                        'Auth_OpenID_ServerErrorContainer')) {
            return $response_message;
        }

        return $this->_extractAssociation($response_message, $assoc_session);
    }

    /**
     * @access private
     */
    function _extractAssociation($assoc_response, $assoc_session)
    {
        // Extract the common fields from the response, raising an
        // exception if they are not found
        $assoc_type = $assoc_response->getArg(
                         Auth_OpenID_OPENID_NS, 'assoc_type',
                         Auth_OpenID_NO_DEFAULT);

        if (Auth_OpenID::isFailure($assoc_type)) {
            return $assoc_type;
        }

        $assoc_handle = $assoc_response->getArg(
                           Auth_OpenID_OPENID_NS, 'assoc_handle',
                           Auth_OpenID_NO_DEFAULT);

        if (Auth_OpenID::isFailure($assoc_handle)) {
            return $assoc_handle;
        }

        // expires_in is a base-10 string. The Python parsing will
        // accept literals that have whitespace around them and will
        // accept negative values. Neither of these are really in-spec,
        // but we think it's OK to accept them.
        $expires_in_str = $assoc_response->getArg(
                             Auth_OpenID_OPENID_NS, 'expires_in',
                             Auth_OpenID_NO_DEFAULT);

        if (Auth_OpenID::isFailure($expires_in_str)) {
            return $expires_in_str;
        }

        $expires_in = Auth_OpenID::intval($expires_in_str);
        if ($expires_in === false) {
            
            $err = sprintf("Could not parse expires_in from association ".
                           "response %s", print_r($assoc_response, true));
            return new Auth_OpenID_FailureResponse(null, $err);
        }

        // OpenID 1 has funny association session behaviour.
        if ($assoc_response->isOpenID1()) {
            $session_type = $this->_getOpenID1SessionType($assoc_response);
        } else {
            $session_type = $assoc_response->getArg(
                               Auth_OpenID_OPENID2_NS, 'session_type',
                               Auth_OpenID_NO_DEFAULT);

            if (Auth_OpenID::isFailure($session_type)) {
                return $session_type;
            }
        }

        // Session type mismatch
        if ($assoc_session->session_type != $session_type) {
            if ($assoc_response->isOpenID1() &&
                ($session_type == 'no-encryption')) {
                // In OpenID 1, any association request can result in
                // a 'no-encryption' association response. Setting
                // assoc_session to a new no-encryption session should
                // make the rest of this function work properly for
                // that case.
                $assoc_session = new Auth_OpenID_PlainTextConsumerSession();
            } else {
                // Any other mismatch, regardless of protocol version
                // results in the failure of the association session
                // altogether.
                return null;
            }
        }

        // Make sure assoc_type is valid for session_type
        if (!in_array($assoc_type, $assoc_session->allowed_assoc_types)) {
            return null;
        }

        // Delegate to the association session to extract the secret
        // from the response, however is appropriate for that session
        // type.
        $secret = $assoc_session->extractSecret($assoc_response);

        if ($secret === null) {
            return null;
        }

        return Auth_OpenID_Association::fromExpiresIn(
                 $expires_in, $assoc_handle, $secret, $assoc_type);
    }

    /**
     * @access private
     */
    function _createAssociateRequest($endpoint, $assoc_type, $session_type)
    {
        if (array_key_exists($session_type, $this->session_types)) {
            $session_type_class = $this->session_types[$session_type];

            if (is_callable($session_type_class)) {
                $assoc_session = $session_type_class();
            } else {
                $assoc_session = new $session_type_class();
            }
        } else {
            return null;
        }

        $args = array(
            'mode' => 'associate',
            'assoc_type' => $assoc_type);

        if (!$endpoint->compatibilityMode()) {
            $args['ns'] = Auth_OpenID_OPENID2_NS;
        }

        // Leave out the session type if we're in compatibility mode
        // *and* it's no-encryption.
        if ((!$endpoint->compatibilityMode()) ||
            ($assoc_session->session_type != 'no-encryption')) {
            $args['session_type'] = $assoc_session->session_type;
        }

        $args = array_merge($args, $assoc_session->getRequest());
        $message = Auth_OpenID_Message::fromOpenIDArgs($args);
        return array($assoc_session, $message);
    }

    /**
     * Given an association response message, extract the OpenID 1.X
     * session type.
     *
     * This function mostly takes care of the 'no-encryption' default
     * behavior in OpenID 1.
     *
     * If the association type is plain-text, this function will
     * return 'no-encryption'
     *
     * @access private
     * @return $typ The association type for this message
     */
    function _getOpenID1SessionType($assoc_response)
    {
        // If it's an OpenID 1 message, allow session_type to default
        // to None (which signifies "no-encryption")
        $session_type = $assoc_response->getArg(Auth_OpenID_OPENID1_NS,
                                                'session_type');

        // Handle the differences between no-encryption association
        // respones in OpenID 1 and 2:

        // no-encryption is not really a valid session type for OpenID
        // 1, but we'll accept it anyway, while issuing a warning.
        if ($session_type == 'no-encryption') {
            // oidutil.log('WARNING: OpenID server sent "no-encryption"'
            //             'for OpenID 1.X')
        } else if (($session_type == '') || ($session_type === null)) {
            // Missing or empty session type is the way to flag a
            // 'no-encryption' response. Change the session type to
            // 'no-encryption' so that it can be handled in the same
            // way as OpenID 2 'no-encryption' respones.
            $session_type = 'no-encryption';
        }

        return $session_type;
    }
}

/**
 * This class represents an authentication request from a consumer to
 * an OpenID server.
 *
 * @package OpenID
 */
class Auth_OpenID_AuthRequest {

    /**
     * Initialize an authentication request with the specified token,
     * association, and endpoint.
     *
     * Users of this library should not create instances of this
     * class.  Instances of this class are created by the library when
     * needed.
     */
    function Auth_OpenID_AuthRequest($endpoint, $assoc)
    {
        $this->assoc = $assoc;
        $this->endpoint = $endpoint;
        $this->return_to_args = array();
        $this->message = new Auth_OpenID_Message(
            $endpoint->preferredNamespace());
        $this->_anonymous = false;
    }

    /**
     * Add an extension to this checkid request.
     *
     * $extension_request: An object that implements the extension
     * request interface for adding arguments to an OpenID message.
     */
    function addExtension($extension_request)
    {
        $extension_request->toMessage($this->message);
    }

    /**
     * Add an extension argument to this OpenID authentication
     * request.
     *
     * Use caution when adding arguments, because they will be
     * URL-escaped and appended to the redirect URL, which can easily
     * get quite long.
     *
     * @param string $namespace The namespace for the extension. For
     * example, the simple registration extension uses the namespace
     * 'sreg'.
     *
     * @param string $key The key within the extension namespace. For
     * example, the nickname field in the simple registration
     * extension's key is 'nickname'.
     *
     * @param string $value The value to provide to the server for
     * this argument.
     */
    function addExtensionArg($namespace, $key, $value)
    {
        return $this->message->setArg($namespace, $key, $value);
    }

    /**
     * Set whether this request should be made anonymously. If a
     * request is anonymous, the identifier will not be sent in the
     * request. This is only useful if you are making another kind of
     * request with an extension in this request.
     *
     * Anonymous requests are not allowed when the request is made
     * with OpenID 1.
     */
    function setAnonymous($is_anonymous)
    {
        if ($is_anonymous && $this->message->isOpenID1()) {
            return false;
        } else {
            $this->_anonymous = $is_anonymous;
            return true;
        }
    }

    /**
     * Produce a {@link Auth_OpenID_Message} representing this
     * request.
     *
     * @param string $realm The URL (or URL pattern) that identifies
     * your web site to the user when she is authorizing it.
     *
     * @param string $return_to The URL that the OpenID provider will
     * send the user back to after attempting to verify her identity.
     *
     * Not specifying a return_to URL means that the user will not be
     * returned to the site issuing the request upon its completion.
     *
     * @param bool $immediate If true, the OpenID provider is to send
     * back a response immediately, useful for behind-the-scenes
     * authentication attempts.  Otherwise the OpenID provider may
     * engage the user before providing a response.  This is the
     * default case, as the user may need to provide credentials or
     * approve the request before a positive response can be sent.
     */
    function getMessage($realm, $return_to=null, $immediate=false)
    {
        if ($return_to) {
            $return_to = Auth_OpenID::appendArgs($return_to,
                                                 $this->return_to_args);
        } else if ($immediate) {
            // raise ValueError(
            //     '"return_to" is mandatory when
            //using "checkid_immediate"')
            return new Auth_OpenID_FailureResponse(null,
              "'return_to' is mandatory when using checkid_immediate");
        } else if ($this->message->isOpenID1()) {
            // raise ValueError('"return_to" is
            // mandatory for OpenID 1 requests')
            return new Auth_OpenID_FailureResponse(null,
              "'return_to' is mandatory for OpenID 1 requests");
        } else if ($this->return_to_args) {
            // raise ValueError('extra "return_to" arguments
            // were specified, but no return_to was specified')
            return new Auth_OpenID_FailureResponse(null,
              "extra 'return_to' arguments where specified, " .
              "but no return_to was specified");
        }

        if ($immediate) {
            $mode = 'checkid_immediate';
        } else {
            $mode = 'checkid_setup';
        }

        $message = $this->message->copy();
        if ($message->isOpenID1()) {
            $realm_key = 'trust_root';
        } else {
            $realm_key = 'realm';
        }

        $message->updateArgs(Auth_OpenID_OPENID_NS,
                             array(
                                   $realm_key => $realm,
                                   'mode' => $mode,
                                   'return_to' => $return_to));

        if (!$this->_anonymous) {
            if ($this->endpoint->isOPIdentifier()) {
                // This will never happen when we're in compatibility
                // mode, as long as isOPIdentifier() returns False
                // whenever preferredNamespace() returns OPENID1_NS.
                $claimed_id = $request_identity =
                    Auth_OpenID_IDENTIFIER_SELECT;
            } else {
                $request_identity = $this->endpoint->getLocalID();
                $claimed_id = $this->endpoint->claimed_id;
            }

            // This is true for both OpenID 1 and 2
            $message->setArg(Auth_OpenID_OPENID_NS, 'identity',
                             $request_identity);

            if ($message->isOpenID2()) {
                $message->setArg(Auth_OpenID_OPENID2_NS, 'claimed_id',
                                 $claimed_id);
            }
        }

        if ($this->assoc) {
            $message->setArg(Auth_OpenID_OPENID_NS, 'assoc_handle',
                             $this->assoc->handle);
        }

        return $message;
    }

    function redirectURL($realm, $return_to = null,
                         $immediate = false)
    {
        $message = $this->getMessage($realm, $return_to, $immediate);

        if (Auth_OpenID::isFailure($message)) {
            return $message;
        }

        return $message->toURL($this->endpoint->server_url);
    }

    /**
     * Get html for a form to submit this request to the IDP.
     *
     * form_tag_attrs: An array of attributes to be added to the form
     * tag. 'accept-charset' and 'enctype' have defaults that can be
     * overridden. If a value is supplied for 'action' or 'method', it
     * will be replaced.
     */
    function formMarkup($realm, $return_to=null, $immediate=false,
                        $form_tag_attrs=null)
    {
        $message = $this->getMessage($realm, $return_to, $immediate);

        if (Auth_OpenID::isFailure($message)) {
            return $message;
        }

        return $message->toFormMarkup($this->endpoint->server_url,
                                      $form_tag_attrs);
    }

    /**
     * Get a complete html document that will autosubmit the request
     * to the IDP.
     *
     * Wraps formMarkup.  See the documentation for that function.
     */
    function htmlMarkup($realm, $return_to=null, $immediate=false,
                        $form_tag_attrs=null)
    {
        $form = $this->formMarkup($realm, $return_to, $immediate, 
                                  $form_tag_attrs);

        if (Auth_OpenID::isFailure($form)) {
            return $form;
        }
        return Auth_OpenID::autoSubmitHTML($form);
    }

    function shouldSendRedirect()
    {
        return $this->endpoint->compatibilityMode();
    }
}

/**
 * The base class for responses from the Auth_OpenID_Consumer.
 *
 * @package OpenID
 */
class Auth_OpenID_ConsumerResponse {
    var $status = null;

    function setEndpoint($endpoint)
    {
        $this->endpoint = $endpoint;
        if ($endpoint === null) {
            $this->identity_url = null;
        } else {
            $this->identity_url = $endpoint->claimed_id;
        }
    }

    /**
     * Return the display identifier for this response.
     *
     * The display identifier is related to the Claimed Identifier, but the
     * two are not always identical.  The display identifier is something the
     * user should recognize as what they entered, whereas the response's
     * claimed identifier (in the identity_url attribute) may have extra
     * information for better persistence.
     *
     * URLs will be stripped of their fragments for display.  XRIs will
     * display the human-readable identifier (i-name) instead of the
     * persistent identifier (i-number).
     *
     * Use the display identifier in your user interface.  Use
     * identity_url for querying your database or authorization server.
     *
     */
    function getDisplayIdentifier()
    {
        if ($this->endpoint !== null) {
            return $this->endpoint->getDisplayIdentifier();
        }
        return null;
    }
}

/**
 * A response with a status of Auth_OpenID_SUCCESS. Indicates that
 * this request is a successful acknowledgement from the OpenID server
 * that the supplied URL is, indeed controlled by the requesting
 * agent.  This has three relevant attributes:
 *
 * claimed_id - The identity URL that has been authenticated
 *
 * signed_args - The arguments in the server's response that were
 * signed and verified.
 *
 * status - Auth_OpenID_SUCCESS.
 *
 * @package OpenID
 */
class Auth_OpenID_SuccessResponse extends Auth_OpenID_ConsumerResponse {
    var $status = Auth_OpenID_SUCCESS;

    /**
     * @access private
     */
    function Auth_OpenID_SuccessResponse($endpoint, $message, $signed_args=null)
    {
        $this->endpoint = $endpoint;
        $this->identity_url = $endpoint->claimed_id;
        $this->signed_args = $signed_args;
        $this->message = $message;

        if ($this->signed_args === null) {
            $this->signed_args = array();
        }
    }

    /**
     * Extract signed extension data from the server's response.
     *
     * @param string $prefix The extension namespace from which to
     * extract the extension data.
     */
    function extensionResponse($namespace_uri, $require_signed)
    {
        if ($require_signed) {
            return $this->getSignedNS($namespace_uri);
        } else {
            return $this->message->getArgs($namespace_uri);
        }
    }

    function isOpenID1()
    {
        return $this->message->isOpenID1();
    }

    function isSigned($ns_uri, $ns_key)
    {
        // Return whether a particular key is signed, regardless of
        // its namespace alias
        return in_array($this->message->getKey($ns_uri, $ns_key),
                        $this->signed_args);
    }

    function getSigned($ns_uri, $ns_key, $default = null)
    {
        // Return the specified signed field if available, otherwise
        // return default
        if ($this->isSigned($ns_uri, $ns_key)) {
            return $this->message->getArg($ns_uri, $ns_key, $default);
        } else {
            return $default;
        }
    }

    function getSignedNS($ns_uri)
    {
        $args = array();

        $msg_args = $this->message->getArgs($ns_uri);
        if (Auth_OpenID::isFailure($msg_args)) {
            return null;
        }

        foreach ($msg_args as $key => $value) {
            if (!$this->isSigned($ns_uri, $key)) {
                unset($msg_args[$key]);
            }
        }

        return $msg_args;
    }

    /**
     * Get the openid.return_to argument from this response.
     *
     * This is useful for verifying that this request was initiated by
     * this consumer.
     *
     * @return string $return_to The return_to URL supplied to the
     * server on the initial request, or null if the response did not
     * contain an 'openid.return_to' argument.
    */
    function getReturnTo()
    {
        return $this->getSigned(Auth_OpenID_OPENID_NS, 'return_to');
    }
}

/**
 * A response with a status of Auth_OpenID_FAILURE. Indicates that the
 * OpenID protocol has failed. This could be locally or remotely
 * triggered.  This has three relevant attributes:
 *
 * claimed_id - The identity URL for which authentication was
 * attempted, if it can be determined.  Otherwise, null.
 *
 * message - A message indicating why the request failed, if one is
 * supplied.  Otherwise, null.
 *
 * status - Auth_OpenID_FAILURE.
 *
 * @package OpenID
 */
class Auth_OpenID_FailureResponse extends Auth_OpenID_ConsumerResponse {
    var $status = Auth_OpenID_FAILURE;

    function Auth_OpenID_FailureResponse($endpoint, $message = null,
                                         $contact = null, $reference = null)
    {
        $this->setEndpoint($endpoint);
        $this->message = $message;
        $this->contact = $contact;
        $this->reference = $reference;
    }
}

/**
 * A specific, internal failure used to detect type URI mismatch.
 *
 * @package OpenID
 */
class Auth_OpenID_TypeURIMismatch extends Auth_OpenID_FailureResponse {
}

/**
 * Exception that is raised when the server returns a 400 response
 * code to a direct request.
 *
 * @package OpenID
 */
class Auth_OpenID_ServerErrorContainer {
    function Auth_OpenID_ServerErrorContainer($error_text,
                                              $error_code,
                                              $message)
    {
        $this->error_text = $error_text;
        $this->error_code = $error_code;
        $this->message = $message;
    }

    /**
     * @access private
     */
    static function fromMessage($message)
    {
        $error_text = $message->getArg(
           Auth_OpenID_OPENID_NS, 'error', '<no error message supplied>');
        $error_code = $message->getArg(Auth_OpenID_OPENID_NS, 'error_code');
        return new Auth_OpenID_ServerErrorContainer($error_text,
                                                    $error_code,
                                                    $message);
    }
}

/**
 * A response with a status of Auth_OpenID_CANCEL. Indicates that the
 * user cancelled the OpenID authentication request.  This has two
 * relevant attributes:
 *
 * claimed_id - The identity URL for which authentication was
 * attempted, if it can be determined.  Otherwise, null.
 *
 * status - Auth_OpenID_SUCCESS.
 *
 * @package OpenID
 */
class Auth_OpenID_CancelResponse extends Auth_OpenID_ConsumerResponse {
    var $status = Auth_OpenID_CANCEL;

    function Auth_OpenID_CancelResponse($endpoint)
    {
        $this->setEndpoint($endpoint);
    }
}

/**
 * A response with a status of Auth_OpenID_SETUP_NEEDED. Indicates
 * that the request was in immediate mode, and the server is unable to
 * authenticate the user without further interaction.
 *
 * claimed_id - The identity URL for which authentication was
 * attempted.
 *
 * setup_url - A URL that can be used to send the user to the server
 * to set up for authentication. The user should be redirected in to
 * the setup_url, either in the current window or in a new browser
 * window.  Null in OpenID 2.
 *
 * status - Auth_OpenID_SETUP_NEEDED.
 *
 * @package OpenID
 */
class Auth_OpenID_SetupNeededResponse extends Auth_OpenID_ConsumerResponse {
    var $status = Auth_OpenID_SETUP_NEEDED;

    function Auth_OpenID_SetupNeededResponse($endpoint,
                                             $setup_url = null)
    {
        $this->setEndpoint($endpoint);
        $this->setup_url = $setup_url;
    }
}


