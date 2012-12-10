<?php

/**
 * Simple registration request and response parsing and object
 * representation.
 *
 * This module contains objects representing simple registration
 * requests and responses that can be used with both OpenID relying
 * parties and OpenID providers.
 *
 * 1. The relying party creates a request object and adds it to the
 * {@link Auth_OpenID_AuthRequest} object before making the
 * checkid request to the OpenID provider:
 *
 *   $sreg_req = Auth_OpenID_SRegRequest::build(array('email'));
 *   $auth_request->addExtension($sreg_req);
 *
 * 2. The OpenID provider extracts the simple registration request
 * from the OpenID request using {@link
 * Auth_OpenID_SRegRequest::fromOpenIDRequest}, gets the user's
 * approval and data, creates an {@link Auth_OpenID_SRegResponse}
 * object and adds it to the id_res response:
 *
 *   $sreg_req = Auth_OpenID_SRegRequest::fromOpenIDRequest(
 *                                  $checkid_request);
 *   // [ get the user's approval and data, informing the user that
 *   //   the fields in sreg_response were requested ]
 *   $sreg_resp = Auth_OpenID_SRegResponse::extractResponse(
 *                                  $sreg_req, $user_data);
 *   $sreg_resp->toMessage($openid_response->fields);
 *
 * 3. The relying party uses {@link
 * Auth_OpenID_SRegResponse::fromSuccessResponse} to extract the data
 * from the OpenID response:
 *
 *   $sreg_resp = Auth_OpenID_SRegResponse::fromSuccessResponse(
 *                                  $success_response);
 *
 * @package OpenID
 */

/**
 * Import message and extension internals.
 */
require_once 'Auth/OpenID/Message.php';
require_once 'Auth/OpenID/Extension.php';

// The data fields that are listed in the sreg spec
global $Auth_OpenID_sreg_data_fields;
$Auth_OpenID_sreg_data_fields = array(
                                      'fullname' => 'Full Name',
                                      'nickname' => 'Nickname',
                                      'dob' => 'Date of Birth',
                                      'email' => 'E-mail Address',
                                      'gender' => 'Gender',
                                      'postcode' => 'Postal Code',
                                      'country' => 'Country',
                                      'language' => 'Language',
                                      'timezone' => 'Time Zone');

/**
 * Check to see that the given value is a valid simple registration
 * data field name.  Return true if so, false if not.
 */
function Auth_OpenID_checkFieldName($field_name)
{
    global $Auth_OpenID_sreg_data_fields;

    if (!in_array($field_name, array_keys($Auth_OpenID_sreg_data_fields))) {
        return false;
    }
    return true;
}

// URI used in the wild for Yadis documents advertising simple
// registration support
define('Auth_OpenID_SREG_NS_URI_1_0', 'http://openid.net/sreg/1.0');

// URI in the draft specification for simple registration 1.1
// <http://openid.net/specs/openid-simple-registration-extension-1_1-01.html>
define('Auth_OpenID_SREG_NS_URI_1_1', 'http://openid.net/extensions/sreg/1.1');

// This attribute will always hold the preferred URI to use when
// adding sreg support to an XRDS file or in an OpenID namespace
// declaration.
define('Auth_OpenID_SREG_NS_URI', Auth_OpenID_SREG_NS_URI_1_1);

Auth_OpenID_registerNamespaceAlias(Auth_OpenID_SREG_NS_URI_1_1, 'sreg');

/**
 * Does the given endpoint advertise support for simple
 * registration?
 *
 * $endpoint: The endpoint object as returned by OpenID discovery.
 * returns whether an sreg type was advertised by the endpoint
 */
function Auth_OpenID_supportsSReg($endpoint)
{
    return ($endpoint->usesExtension(Auth_OpenID_SREG_NS_URI_1_1) ||
            $endpoint->usesExtension(Auth_OpenID_SREG_NS_URI_1_0));
}

/**
 * A base class for classes dealing with Simple Registration protocol
 * messages.
 *
 * @package OpenID
 */
class Auth_OpenID_SRegBase extends Auth_OpenID_Extension {
    /**
     * Extract the simple registration namespace URI from the given
     * OpenID message. Handles OpenID 1 and 2, as well as both sreg
     * namespace URIs found in the wild, as well as missing namespace
     * definitions (for OpenID 1)
     *
     * $message: The OpenID message from which to parse simple
     * registration fields. This may be a request or response message.
     *
     * Returns the sreg namespace URI for the supplied message. The
     * message may be modified to define a simple registration
     * namespace.
     *
     * @access private
     */
    static function _getSRegNS($message)
    {
        $alias = null;
        $found_ns_uri = null;

        // See if there exists an alias for one of the two defined
        // simple registration types.
        foreach (array(Auth_OpenID_SREG_NS_URI_1_1,
                       Auth_OpenID_SREG_NS_URI_1_0) as $sreg_ns_uri) {
            $alias = $message->namespaces->getAlias($sreg_ns_uri);
            if ($alias !== null) {
                $found_ns_uri = $sreg_ns_uri;
                break;
            }
        }

        if ($alias === null) {
            // There is no alias for either of the types, so try to
            // add one. We default to using the modern value (1.1)
            $found_ns_uri = Auth_OpenID_SREG_NS_URI_1_1;
            if ($message->namespaces->addAlias(Auth_OpenID_SREG_NS_URI_1_1,
                                               'sreg') === null) {
                // An alias for the string 'sreg' already exists, but
                // it's defined for something other than simple
                // registration
                return null;
            }
        }

        return $found_ns_uri;
    }
}

/**
 * An object to hold the state of a simple registration request.
 *
 * required: A list of the required fields in this simple registration
 * request
 *
 * optional: A list of the optional fields in this simple registration
 * request
 *
 * @package OpenID
 */
class Auth_OpenID_SRegRequest extends Auth_OpenID_SRegBase {

    var $ns_alias = 'sreg';

    /**
     * Initialize an empty simple registration request.
     */
    static function build($required=null, $optional=null,
                   $policy_url=null,
                   $sreg_ns_uri=Auth_OpenID_SREG_NS_URI,
                   $cls='Auth_OpenID_SRegRequest')
    {
        $obj = new $cls();

        $obj->required = array();
        $obj->optional = array();
        $obj->policy_url = $policy_url;
        $obj->ns_uri = $sreg_ns_uri;

        if ($required) {
            if (!$obj->requestFields($required, true, true)) {
                return null;
            }
        }

        if ($optional) {
            if (!$obj->requestFields($optional, false, true)) {
                return null;
            }
        }

        return $obj;
    }

    /**
     * Create a simple registration request that contains the fields
     * that were requested in the OpenID request with the given
     * arguments
     *
     * $request: The OpenID authentication request from which to
     * extract an sreg request.
     *
     * $cls: name of class to use when creating sreg request object.
     * Used for testing.
     *
     * Returns the newly created simple registration request
     */
    static function fromOpenIDRequest($request, $cls='Auth_OpenID_SRegRequest')
    {

        $obj = call_user_func_array(array($cls, 'build'),
                 array(null, null, null, Auth_OpenID_SREG_NS_URI, $cls));

        // Since we're going to mess with namespace URI mapping, don't
        // mutate the object that was passed in.
        $m = $request->message;

        $obj->ns_uri = $obj->_getSRegNS($m);
        $args = $m->getArgs($obj->ns_uri);

        if ($args === null || Auth_OpenID::isFailure($args)) {
            return null;
        }

        $obj->parseExtensionArgs($args);

        return $obj;
    }

    /**
     * Parse the unqualified simple registration request parameters
     * and add them to this object.
     *
     * This method is essentially the inverse of
     * getExtensionArgs. This method restores the serialized simple
     * registration request fields.
     *
     * If you are extracting arguments from a standard OpenID
     * checkid_* request, you probably want to use fromOpenIDRequest,
     * which will extract the sreg namespace and arguments from the
     * OpenID request. This method is intended for cases where the
     * OpenID server needs more control over how the arguments are
     * parsed than that method provides.
     *
     * $args == $message->getArgs($ns_uri);
     * $request->parseExtensionArgs($args);
     *
     * $args: The unqualified simple registration arguments
     *
     * strict: Whether requests with fields that are not defined in
     * the simple registration specification should be tolerated (and
     * ignored)
     */
    function parseExtensionArgs($args, $strict=false)
    {
        foreach (array('required', 'optional') as $list_name) {
            $required = ($list_name == 'required');
            $items = Auth_OpenID::arrayGet($args, $list_name);
            if ($items) {
                foreach (explode(',', $items) as $field_name) {
                    if (!$this->requestField($field_name, $required, $strict)) {
                        if ($strict) {
                            return false;
                        }
                    }
                }
            }
        }

        $this->policy_url = Auth_OpenID::arrayGet($args, 'policy_url');

        return true;
    }

    /**
     * A list of all of the simple registration fields that were
     * requested, whether they were required or optional.
     */
    function allRequestedFields()
    {
        return array_merge($this->required, $this->optional);
    }

    /**
     * Have any simple registration fields been requested?
     */
    function wereFieldsRequested()
    {
        return count($this->allRequestedFields());
    }

    /**
     * Was this field in the request?
     */
    function contains($field_name)
    {
        return (in_array($field_name, $this->required) ||
                in_array($field_name, $this->optional));
    }

    /**
     * Request the specified field from the OpenID user
     *
     * $field_name: the unqualified simple registration field name
     *
     * required: whether the given field should be presented to the
     * user as being a required to successfully complete the request
     *
     * strict: whether to raise an exception when a field is added to
     * a request more than once
     */
    function requestField($field_name,
                          $required=false, $strict=false)
    {
        if (!Auth_OpenID_checkFieldName($field_name)) {
            return false;
        }

        if ($strict) {
            if ($this->contains($field_name)) {
                return false;
            }
        } else {
            if (in_array($field_name, $this->required)) {
                return true;
            }

            if (in_array($field_name, $this->optional)) {
                if ($required) {
                    unset($this->optional[array_search($field_name,
                                                       $this->optional)]);
                } else {
                    return true;
                }
            }
        }

        if ($required) {
            $this->required[] = $field_name;
        } else {
            $this->optional[] = $field_name;
        }

        return true;
    }

    /**
     * Add the given list of fields to the request
     *
     * field_names: The simple registration data fields to request
     *
     * required: Whether these values should be presented to the user
     * as required
     *
     * strict: whether to raise an exception when a field is added to
     * a request more than once
     */
    function requestFields($field_names, $required=false, $strict=false)
    {
        if (!is_array($field_names)) {
            return false;
        }

        foreach ($field_names as $field_name) {
            if (!$this->requestField($field_name, $required, $strict=$strict)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get a dictionary of unqualified simple registration arguments
     * representing this request.
     *
     * This method is essentially the inverse of
     * C{L{parseExtensionArgs}}. This method serializes the simple
     * registration request fields.
     */
    function getExtensionArgs()
    {
        $args = array();

        if ($this->required) {
            $args['required'] = implode(',', $this->required);
        }

        if ($this->optional) {
            $args['optional'] = implode(',', $this->optional);
        }

        if ($this->policy_url) {
            $args['policy_url'] = $this->policy_url;
        }

        return $args;
    }
}

/**
 * Represents the data returned in a simple registration response
 * inside of an OpenID C{id_res} response. This object will be created
 * by the OpenID server, added to the C{id_res} response object, and
 * then extracted from the C{id_res} message by the Consumer.
 *
 * @package OpenID
 */
class Auth_OpenID_SRegResponse extends Auth_OpenID_SRegBase {

    var $ns_alias = 'sreg';

    function Auth_OpenID_SRegResponse($data=null,
                                      $sreg_ns_uri=Auth_OpenID_SREG_NS_URI)
    {
        if ($data === null) {
            $this->data = array();
        } else {
            $this->data = $data;
        }

        $this->ns_uri = $sreg_ns_uri;
    }

    /**
     * Take a C{L{SRegRequest}} and a dictionary of simple
     * registration values and create a C{L{SRegResponse}} object
     * containing that data.
     *
     * request: The simple registration request object
     *
     * data: The simple registration data for this response, as a
     * dictionary from unqualified simple registration field name to
     * string (unicode) value. For instance, the nickname should be
     * stored under the key 'nickname'.
     */
    static function extractResponse($request, $data)
    {
        $obj = new Auth_OpenID_SRegResponse();
        $obj->ns_uri = $request->ns_uri;

        foreach ($request->allRequestedFields() as $field) {
            $value = Auth_OpenID::arrayGet($data, $field);
            if ($value !== null) {
                $obj->data[$field] = $value;
            }
        }

        return $obj;
    }

    /**
     * Create a C{L{SRegResponse}} object from a successful OpenID
     * library response
     * (C{L{openid.consumer.consumer.SuccessResponse}}) response
     * message
     *
     * success_response: A SuccessResponse from consumer.complete()
     *
     * signed_only: Whether to process only data that was
     * signed in the id_res message from the server.
     *
     * Returns a simple registration response containing the data that
     * was supplied with the C{id_res} response.
     */
    static function fromSuccessResponse($success_response, $signed_only=true)
    {
        global $Auth_OpenID_sreg_data_fields;

        $obj = new Auth_OpenID_SRegResponse();
        $obj->ns_uri = $obj->_getSRegNS($success_response->message);

        if ($signed_only) {
            $args = $success_response->getSignedNS($obj->ns_uri);
        } else {
            $args = $success_response->message->getArgs($obj->ns_uri);
        }

        if ($args === null || Auth_OpenID::isFailure($args)) {
            return null;
        }

        foreach ($Auth_OpenID_sreg_data_fields as $field_name => $desc) {
            if (in_array($field_name, array_keys($args))) {
                $obj->data[$field_name] = $args[$field_name];
            }
        }

        return $obj;
    }

    function getExtensionArgs()
    {
        return $this->data;
    }

    // Read-only dictionary interface
    function get($field_name, $default=null)
    {
        if (!Auth_OpenID_checkFieldName($field_name)) {
            return null;
        }

        return Auth_OpenID::arrayGet($this->data, $field_name, $default);
    }

    function contents()
    {
        return $this->data;
    }
}


