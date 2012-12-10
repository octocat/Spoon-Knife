<?php

/**
 * An implementation of the OpenID Provider Authentication Policy
 *  Extension 1.0
 *
 * See:
 * http://openid.net/developers/specs/
 */

require_once "Auth/OpenID/Extension.php";

define('Auth_OpenID_PAPE_NS_URI',
       "http://specs.openid.net/extensions/pape/1.0");

define('PAPE_AUTH_MULTI_FACTOR_PHYSICAL',
       'http://schemas.openid.net/pape/policies/2007/06/multi-factor-physical');
define('PAPE_AUTH_MULTI_FACTOR',
       'http://schemas.openid.net/pape/policies/2007/06/multi-factor');
define('PAPE_AUTH_PHISHING_RESISTANT',
       'http://schemas.openid.net/pape/policies/2007/06/phishing-resistant');

define('PAPE_TIME_VALIDATOR',
      '/^[0-9]{4,4}-[0-9][0-9]-[0-9][0-9]T[0-9][0-9]:[0-9][0-9]:[0-9][0-9]Z$/');
/**
 * A Provider Authentication Policy request, sent from a relying party
 * to a provider
 *
 * preferred_auth_policies: The authentication policies that
 * the relying party prefers
 *
 * max_auth_age: The maximum time, in seconds, that the relying party
 * wants to allow to have elapsed before the user must re-authenticate
 */
class Auth_OpenID_PAPE_Request extends Auth_OpenID_Extension {

    var $ns_alias = 'pape';
    var $ns_uri = Auth_OpenID_PAPE_NS_URI;

    function Auth_OpenID_PAPE_Request($preferred_auth_policies=null,
                                      $max_auth_age=null)
    {
        if ($preferred_auth_policies === null) {
            $preferred_auth_policies = array();
        }

        $this->preferred_auth_policies = $preferred_auth_policies;
        $this->max_auth_age = $max_auth_age;
    }

    /**
     * Add an acceptable authentication policy URI to this request
     *
     * This method is intended to be used by the relying party to add
     * acceptable authentication types to the request.
     *
     * policy_uri: The identifier for the preferred type of
     * authentication.
     */
    function addPolicyURI($policy_uri)
    {
        if (!in_array($policy_uri, $this->preferred_auth_policies)) {
            $this->preferred_auth_policies[] = $policy_uri;
        }
    }

    function getExtensionArgs()
    {
        $ns_args = array(
                         'preferred_auth_policies' =>
                           implode(' ', $this->preferred_auth_policies)
                         );

        if ($this->max_auth_age !== null) {
            $ns_args['max_auth_age'] = strval($this->max_auth_age);
        }

        return $ns_args;
    }

    /**
     * Instantiate a Request object from the arguments in a checkid_*
     * OpenID message
     */
    static function fromOpenIDRequest($request)
    {
        $obj = new Auth_OpenID_PAPE_Request();
        $args = $request->message->getArgs(Auth_OpenID_PAPE_NS_URI);

        if ($args === null || $args === array()) {
            return null;
        }

        $obj->parseExtensionArgs($args);
        return $obj;
    }

    /**
     * Set the state of this request to be that expressed in these
     * PAPE arguments
     *
     * @param args: The PAPE arguments without a namespace
     */
    function parseExtensionArgs($args)
    {
        // preferred_auth_policies is a space-separated list of policy
        // URIs
        $this->preferred_auth_policies = array();

        $policies_str = Auth_OpenID::arrayGet($args, 'preferred_auth_policies');
        if ($policies_str) {
            foreach (explode(' ', $policies_str) as $uri) {
                if (!in_array($uri, $this->preferred_auth_policies)) {
                    $this->preferred_auth_policies[] = $uri;
                }
            }
        }

        // max_auth_age is base-10 integer number of seconds
        $max_auth_age_str = Auth_OpenID::arrayGet($args, 'max_auth_age');
        if ($max_auth_age_str) {
            $this->max_auth_age = Auth_OpenID::intval($max_auth_age_str);
        } else {
            $this->max_auth_age = null;
        }
    }

    /**
     * Given a list of authentication policy URIs that a provider
     * supports, this method returns the subsequence of those types
     * that are preferred by the relying party.
     *
     * @param supported_types: A sequence of authentication policy
     * type URIs that are supported by a provider
     *
     * @return array The sub-sequence of the supported types that are
     * preferred by the relying party. This list will be ordered in
     * the order that the types appear in the supported_types
     * sequence, and may be empty if the provider does not prefer any
     * of the supported authentication types.
     */
    function preferredTypes($supported_types)
    {
        $result = array();

        foreach ($supported_types as $st) {
            if (in_array($st, $this->preferred_auth_policies)) {
                $result[] = $st;
            }
        }
        return $result;
    }
}

/**
 * A Provider Authentication Policy response, sent from a provider to
 * a relying party
 */
class Auth_OpenID_PAPE_Response extends Auth_OpenID_Extension {

    var $ns_alias = 'pape';
    var $ns_uri = Auth_OpenID_PAPE_NS_URI;

    function Auth_OpenID_PAPE_Response($auth_policies=null, $auth_time=null,
                                       $nist_auth_level=null)
    {
        if ($auth_policies) {
            $this->auth_policies = $auth_policies;
        } else {
            $this->auth_policies = array();
        }

        $this->auth_time = $auth_time;
        $this->nist_auth_level = $nist_auth_level;
    }

    /**
     * Add a authentication policy to this response
     *
     * This method is intended to be used by the provider to add a
     * policy that the provider conformed to when authenticating the
     * user.
     *
     * @param policy_uri: The identifier for the preferred type of
     * authentication.
     */
    function addPolicyURI($policy_uri)
    {
        if (!in_array($policy_uri, $this->auth_policies)) {
            $this->auth_policies[] = $policy_uri;
        }
    }

    /**
     * Create an Auth_OpenID_PAPE_Response object from a successful
     * OpenID library response.
     *
     * @param success_response $success_response A SuccessResponse
     * from Auth_OpenID_Consumer::complete()
     *
     * @returns: A provider authentication policy response from the
     * data that was supplied with the id_res response.
     */
    static function fromSuccessResponse($success_response)
    {
        $obj = new Auth_OpenID_PAPE_Response();

        // PAPE requires that the args be signed.
        $args = $success_response->getSignedNS(Auth_OpenID_PAPE_NS_URI);

        if ($args === null || $args === array()) {
            return null;
        }

        $result = $obj->parseExtensionArgs($args);

        if ($result === false) {
            return null;
        } else {
            return $obj;
        }
    }

    /**
     * Parse the provider authentication policy arguments into the
     *  internal state of this object
     *
     * @param args: unqualified provider authentication policy
     * arguments
     *
     * @param strict: Whether to return false when bad data is
     * encountered
     *
     * @return null The data is parsed into the internal fields of
     * this object.
    */
    function parseExtensionArgs($args, $strict=false)
    {
        $policies_str = Auth_OpenID::arrayGet($args, 'auth_policies');
        if ($policies_str && $policies_str != "none") {
            $this->auth_policies = explode(" ", $policies_str);
        }

        $nist_level_str = Auth_OpenID::arrayGet($args, 'nist_auth_level');
        if ($nist_level_str !== null) {
            $nist_level = Auth_OpenID::intval($nist_level_str);

            if ($nist_level === false) {
                if ($strict) {
                    return false;
                } else {
                    $nist_level = null;
                }
            }

            if (0 <= $nist_level && $nist_level < 5) {
                $this->nist_auth_level = $nist_level;
            } else if ($strict) {
                return false;
            }
        }

        $auth_time = Auth_OpenID::arrayGet($args, 'auth_time');
        if ($auth_time !== null) {
            if (preg_match(PAPE_TIME_VALIDATOR, $auth_time)) {
                $this->auth_time = $auth_time;
            } else if ($strict) {
                return false;
            }
        }
    }

    function getExtensionArgs()
    {
        $ns_args = array();
        if (count($this->auth_policies) > 0) {
            $ns_args['auth_policies'] = implode(' ', $this->auth_policies);
        } else {
            $ns_args['auth_policies'] = 'none';
        }

        if ($this->nist_auth_level !== null) {
            if (!in_array($this->nist_auth_level, range(0, 4), true)) {
                return false;
            }
            $ns_args['nist_auth_level'] = strval($this->nist_auth_level);
        }

        if ($this->auth_time !== null) {
            if (!preg_match(PAPE_TIME_VALIDATOR, $this->auth_time)) {
                return false;
            }

            $ns_args['auth_time'] = $this->auth_time;
        }

        return $ns_args;
    }
}

