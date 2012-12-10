<?php

/**
 * Implements the OpenID attribute exchange specification, version 1.0
 * as of svn revision 370 from openid.net svn.
 *
 * @package OpenID
 */

/**
 * Require utility classes and functions for the consumer.
 */
require_once "Auth/OpenID/Extension.php";
require_once "Auth/OpenID/Message.php";
require_once "Auth/OpenID/TrustRoot.php";

define('Auth_OpenID_AX_NS_URI',
       'http://openid.net/srv/ax/1.0');

// Use this as the 'count' value for an attribute in a FetchRequest to
// ask for as many values as the OP can provide.
define('Auth_OpenID_AX_UNLIMITED_VALUES', 'unlimited');

// Minimum supported alias length in characters.  Here for
// completeness.
define('Auth_OpenID_AX_MINIMUM_SUPPORTED_ALIAS_LENGTH', 32);

/**
 * AX utility class.
 *
 * @package OpenID
 */
class Auth_OpenID_AX {
    /**
     * @param mixed $thing Any object which may be an
     * Auth_OpenID_AX_Error object.
     *
     * @return bool true if $thing is an Auth_OpenID_AX_Error; false
     * if not.
     */
    static function isError($thing)
    {
        return is_a($thing, 'Auth_OpenID_AX_Error');
    }
}

/**
 * Check an alias for invalid characters; raise AXError if any are
 * found.  Return None if the alias is valid.
 */
function Auth_OpenID_AX_checkAlias($alias)
{
  if (strpos($alias, ',') !== false) {
      return new Auth_OpenID_AX_Error(sprintf(
                   "Alias %s must not contain comma", $alias));
  }
  if (strpos($alias, '.') !== false) {
      return new Auth_OpenID_AX_Error(sprintf(
                   "Alias %s must not contain period", $alias));
  }

  return true;
}

/**
 * Results from data that does not meet the attribute exchange 1.0
 * specification
 *
 * @package OpenID
 */
class Auth_OpenID_AX_Error {
    function Auth_OpenID_AX_Error($message=null)
    {
        $this->message = $message;
    }
}

/**
 * Abstract class containing common code for attribute exchange
 * messages.
 *
 * @package OpenID
 */
class Auth_OpenID_AX_Message extends Auth_OpenID_Extension {
    /**
     * ns_alias: The preferred namespace alias for attribute exchange
     * messages
     */
    var $ns_alias = 'ax';

    /**
     * mode: The type of this attribute exchange message. This must be
     * overridden in subclasses.
     */
    var $mode = null;

    var $ns_uri = Auth_OpenID_AX_NS_URI;

    /**
     * Return Auth_OpenID_AX_Error if the mode in the attribute
     * exchange arguments does not match what is expected for this
     * class; true otherwise.
     *
     * @access private
     */
    function _checkMode($ax_args)
    {
        $mode = Auth_OpenID::arrayGet($ax_args, 'mode');
        if ($mode != $this->mode) {
            return new Auth_OpenID_AX_Error(
                            sprintf(
                                    "Expected mode '%s'; got '%s'",
                                    $this->mode, $mode));
        }

        return true;
    }

    /**
     * Return a set of attribute exchange arguments containing the
     * basic information that must be in every attribute exchange
     * message.
     *
     * @access private
     */
    function _newArgs()
    {
        return array('mode' => $this->mode);
    }
}

/**
 * Represents a single attribute in an attribute exchange
 * request. This should be added to an AXRequest object in order to
 * request the attribute.
 *
 * @package OpenID
 */
class Auth_OpenID_AX_AttrInfo {
    /**
     * Construct an attribute information object.  Do not call this
     * directly; call make(...) instead.
     *
     * @param string $type_uri The type URI for this attribute.
     *
     * @param int $count The number of values of this type to request.
     *
     * @param bool $required Whether the attribute will be marked as
     * required in the request.
     *
     * @param string $alias The name that should be given to this
     * attribute in the request.
     */
    function Auth_OpenID_AX_AttrInfo($type_uri, $count, $required,
                                     $alias)
    {
        /**
         * required: Whether the attribute will be marked as required
         * when presented to the subject of the attribute exchange
         * request.
         */
        $this->required = $required;

        /**
         * count: How many values of this type to request from the
         * subject. Defaults to one.
         */
        $this->count = $count;

        /**
         * type_uri: The identifier that determines what the attribute
         * represents and how it is serialized. For example, one type
         * URI representing dates could represent a Unix timestamp in
         * base 10 and another could represent a human-readable
         * string.
         */
        $this->type_uri = $type_uri;

        /**
         * alias: The name that should be given to this attribute in
         * the request. If it is not supplied, a generic name will be
         * assigned. For example, if you want to call a Unix timestamp
         * value 'tstamp', set its alias to that value. If two
         * attributes in the same message request to use the same
         * alias, the request will fail to be generated.
         */
        $this->alias = $alias;
    }

    /**
     * Construct an attribute information object.  For parameter
     * details, see the constructor.
     */
    static function make($type_uri, $count=1, $required=false,
                  $alias=null)
    {
        if ($alias !== null) {
            $result = Auth_OpenID_AX_checkAlias($alias);

            if (Auth_OpenID_AX::isError($result)) {
                return $result;
            }
        }

        return new Auth_OpenID_AX_AttrInfo($type_uri, $count, $required,
                                           $alias);
    }

    /**
     * When processing a request for this attribute, the OP should
     * call this method to determine whether all available attribute
     * values were requested.  If self.count == UNLIMITED_VALUES, this
     * returns True.  Otherwise this returns False, in which case
     * self.count is an integer.
    */
    function wantsUnlimitedValues()
    {
        return $this->count === Auth_OpenID_AX_UNLIMITED_VALUES;
    }
}

/**
 * Given a namespace mapping and a string containing a comma-separated
 * list of namespace aliases, return a list of type URIs that
 * correspond to those aliases.
 *
 * @param $namespace_map The mapping from namespace URI to alias
 * @param $alias_list_s The string containing the comma-separated
 * list of aliases. May also be None for convenience.
 *
 * @return $seq The list of namespace URIs that corresponds to the
 * supplied list of aliases. If the string was zero-length or None, an
 * empty list will be returned.
 *
 * return null If an alias is present in the list of aliases but
 * is not present in the namespace map.
 */
function Auth_OpenID_AX_toTypeURIs($namespace_map, $alias_list_s)
{
    $uris = array();

    if ($alias_list_s) {
        foreach (explode(',', $alias_list_s) as $alias) {
            $type_uri = $namespace_map->getNamespaceURI($alias);
            if ($type_uri === null) {
                // raise KeyError(
                // 'No type is defined for attribute name %r' % (alias,))
                return new Auth_OpenID_AX_Error(
                  sprintf('No type is defined for attribute name %s',
                          $alias)
                  );
            } else {
                $uris[] = $type_uri;
            }
        }
    }

    return $uris;
}

/**
 * An attribute exchange 'fetch_request' message. This message is sent
 * by a relying party when it wishes to obtain attributes about the
 * subject of an OpenID authentication request.
 *
 * @package OpenID
 */
class Auth_OpenID_AX_FetchRequest extends Auth_OpenID_AX_Message {

    var $mode = 'fetch_request';

    function Auth_OpenID_AX_FetchRequest($update_url=null)
    {
        /**
         * requested_attributes: The attributes that have been
         * requested thus far, indexed by the type URI.
         */
        $this->requested_attributes = array();

        /**
         * update_url: A URL that will accept responses for this
         * attribute exchange request, even in the absence of the user
         * who made this request.
        */
        $this->update_url = $update_url;
    }

    /**
     * Add an attribute to this attribute exchange request.
     *
     * @param attribute: The attribute that is being requested
     * @return true on success, false when the requested attribute is
     * already present in this fetch request.
     */
    function add($attribute)
    {
        if ($this->contains($attribute->type_uri)) {
            return new Auth_OpenID_AX_Error(
              sprintf("The attribute %s has already been requested",
                      $attribute->type_uri));
        }

        $this->requested_attributes[$attribute->type_uri] = $attribute;

        return true;
    }

    /**
     * Get the serialized form of this attribute fetch request.
     *
     * @returns Auth_OpenID_AX_FetchRequest The fetch request message parameters
     */
    function getExtensionArgs()
    {
        $aliases = new Auth_OpenID_NamespaceMap();

        $required = array();
        $if_available = array();

        $ax_args = $this->_newArgs();

        foreach ($this->requested_attributes as $type_uri => $attribute) {
            if ($attribute->alias === null) {
                $alias = $aliases->add($type_uri);
            } else {
                $alias = $aliases->addAlias($type_uri, $attribute->alias);

                if ($alias === null) {
                    return new Auth_OpenID_AX_Error(
                      sprintf("Could not add alias %s for URI %s",
                              $attribute->alias, $type_uri
                      ));
                }
            }

            if ($attribute->required) {
                $required[] = $alias;
            } else {
                $if_available[] = $alias;
            }

            if ($attribute->count != 1) {
                $ax_args['count.' . $alias] = strval($attribute->count);
            }

            $ax_args['type.' . $alias] = $type_uri;
        }

        if ($required) {
            $ax_args['required'] = implode(',', $required);
        }

        if ($if_available) {
            $ax_args['if_available'] = implode(',', $if_available);
        }

        return $ax_args;
    }

    /**
     * Get the type URIs for all attributes that have been marked as
     * required.
     *
     * @return A list of the type URIs for attributes that have been
     * marked as required.
     */
    function getRequiredAttrs()
    {
        $required = array();
        foreach ($this->requested_attributes as $type_uri => $attribute) {
            if ($attribute->required) {
                $required[] = $type_uri;
            }
        }

        return $required;
    }

    /**
     * Extract a FetchRequest from an OpenID message
     *
     * @param request: The OpenID request containing the attribute
     * fetch request
     *
     * @returns mixed An Auth_OpenID_AX_Error or the
     * Auth_OpenID_AX_FetchRequest extracted from the request message if
     * successful
     */
    static function fromOpenIDRequest($request)
    {
        $m = $request->message;
        $obj = new Auth_OpenID_AX_FetchRequest();
        $ax_args = $m->getArgs($obj->ns_uri);

        $result = $obj->parseExtensionArgs($ax_args);

        if (Auth_OpenID_AX::isError($result)) {
            return $result;
        }

        if ($obj->update_url) {
            // Update URL must match the openid.realm of the
            // underlying OpenID 2 message.
            $realm = $m->getArg(Auth_OpenID_OPENID_NS, 'realm',
                        $m->getArg(
                                  Auth_OpenID_OPENID_NS,
                                  'return_to'));

            if (!$realm) {
                $obj = new Auth_OpenID_AX_Error(
                  sprintf("Cannot validate update_url %s " .
                          "against absent realm", $obj->update_url));
            } else if (!Auth_OpenID_TrustRoot::match($realm,
                                                     $obj->update_url)) {
                $obj = new Auth_OpenID_AX_Error(
                  sprintf("Update URL %s failed validation against realm %s",
                          $obj->update_url, $realm));
            }
        }

        return $obj;
    }

    /**
     * Given attribute exchange arguments, populate this FetchRequest.
     *
     * @return $result Auth_OpenID_AX_Error if the data to be parsed
     * does not follow the attribute exchange specification. At least
     * when 'if_available' or 'required' is not specified for a
     * particular attribute type.  Returns true otherwise.
    */
    function parseExtensionArgs($ax_args)
    {
        $result = $this->_checkMode($ax_args);
        if (Auth_OpenID_AX::isError($result)) {
            return $result;
        }

        $aliases = new Auth_OpenID_NamespaceMap();

        foreach ($ax_args as $key => $value) {
            if (strpos($key, 'type.') === 0) {
                $alias = substr($key, 5);
                $type_uri = $value;

                $alias = $aliases->addAlias($type_uri, $alias);

                if ($alias === null) {
                    return new Auth_OpenID_AX_Error(
                      sprintf("Could not add alias %s for URI %s",
                              $alias, $type_uri)
                      );
                }

                $count_s = Auth_OpenID::arrayGet($ax_args, 'count.' . $alias);
                if ($count_s) {
                    $count = Auth_OpenID::intval($count_s);
                    if (($count === false) &&
                        ($count_s === Auth_OpenID_AX_UNLIMITED_VALUES)) {
                        $count = $count_s;
                    }
                } else {
                    $count = 1;
                }

                if ($count === false) {
                    return new Auth_OpenID_AX_Error(
                      sprintf("Integer value expected for %s, got %s",
                              'count.' . $alias, $count_s));
                }

                $attrinfo = Auth_OpenID_AX_AttrInfo::make($type_uri, $count,
                                                          false, $alias);

                if (Auth_OpenID_AX::isError($attrinfo)) {
                    return $attrinfo;
                }

                $this->add($attrinfo);
            }
        }

        $required = Auth_OpenID_AX_toTypeURIs($aliases,
                         Auth_OpenID::arrayGet($ax_args, 'required'));

        foreach ($required as $type_uri) {
            $attrib = $this->requested_attributes[$type_uri];
            $attrib->required = true;
        }

        $if_available = Auth_OpenID_AX_toTypeURIs($aliases,
                             Auth_OpenID::arrayGet($ax_args, 'if_available'));

        $all_type_uris = array_merge($required, $if_available);

        foreach ($aliases->iterNamespaceURIs() as $type_uri) {
            if (!in_array($type_uri, $all_type_uris)) {
                return new Auth_OpenID_AX_Error(
                  sprintf('Type URI %s was in the request but not ' .
                          'present in "required" or "if_available"',
                          $type_uri));

            }
        }

        $this->update_url = Auth_OpenID::arrayGet($ax_args, 'update_url');

        return true;
    }

    /**
     * Iterate over the AttrInfo objects that are contained in this
     * fetch_request.
     */
    function iterAttrs()
    {
        return array_values($this->requested_attributes);
    }

    function iterTypes()
    {
        return array_keys($this->requested_attributes);
    }

    /**
     * Is the given type URI present in this fetch_request?
     */
    function contains($type_uri)
    {
        return in_array($type_uri, $this->iterTypes());
    }
}

/**
 * An abstract class that implements a message that has attribute keys
 * and values. It contains the common code between fetch_response and
 * store_request.
 *
 * @package OpenID
 */
class Auth_OpenID_AX_KeyValueMessage extends Auth_OpenID_AX_Message {

    function Auth_OpenID_AX_KeyValueMessage()
    {
        $this->data = array();
    }

    /**
     * Add a single value for the given attribute type to the
     * message. If there are already values specified for this type,
     * this value will be sent in addition to the values already
     * specified.
     *
     * @param type_uri: The URI for the attribute
     * @param value: The value to add to the response to the relying
     * party for this attribute
     * @return null
     */
    function addValue($type_uri, $value)
    {
        if (!array_key_exists($type_uri, $this->data)) {
            $this->data[$type_uri] = array();
        }

        $values =& $this->data[$type_uri];
        $values[] = $value;
    }

    /**
     * Set the values for the given attribute type. This replaces any
     * values that have already been set for this attribute.
     *
     * @param type_uri: The URI for the attribute
     * @param values: A list of values to send for this attribute.
     */
    function setValues($type_uri, &$values)
    {
        $this->data[$type_uri] =& $values;
    }

    /**
     * Get the extension arguments for the key/value pairs contained
     * in this message.
     *
     * @param aliases: An alias mapping. Set to None if you don't care
     * about the aliases for this request.
     *
     * @access private
     */
    function _getExtensionKVArgs($aliases)
    {
        if ($aliases === null) {
            $aliases = new Auth_OpenID_NamespaceMap();
        }

        $ax_args = array();

        foreach ($this->data as $type_uri => $values) {
            $alias = $aliases->add($type_uri);

            $ax_args['type.' . $alias] = $type_uri;
            $ax_args['count.' . $alias] = strval(count($values));

            foreach ($values as $i => $value) {
              $key = sprintf('value.%s.%d', $alias, $i + 1);
              $ax_args[$key] = $value;
            }
        }

        return $ax_args;
    }

    /**
     * Parse attribute exchange key/value arguments into this object.
     *
     * @param ax_args: The attribute exchange fetch_response
     * arguments, with namespacing removed.
     *
     * @return Auth_OpenID_AX_Error or true
     */
    function parseExtensionArgs($ax_args)
    {
        $result = $this->_checkMode($ax_args);
        if (Auth_OpenID_AX::isError($result)) {
            return $result;
        }

        $aliases = new Auth_OpenID_NamespaceMap();

        foreach ($ax_args as $key => $value) {
            if (strpos($key, 'type.') === 0) {
                $type_uri = $value;
                $alias = substr($key, 5);

                $result = Auth_OpenID_AX_checkAlias($alias);

                if (Auth_OpenID_AX::isError($result)) {
                    return $result;
                }

                $alias = $aliases->addAlias($type_uri, $alias);

                if ($alias === null) {
                    return new Auth_OpenID_AX_Error(
                      sprintf("Could not add alias %s for URI %s",
                              $alias, $type_uri)
                      );
                }
            }
        }

        foreach ($aliases->iteritems() as $pair) {
            list($type_uri, $alias) = $pair;

            if (array_key_exists('count.' . $alias, $ax_args) && ($ax_args['count.' . $alias] !== Auth_OpenID_AX_UNLIMITED_VALUES)) {

                $count_key = 'count.' . $alias;
                $count_s = $ax_args[$count_key];

                $count = Auth_OpenID::intval($count_s);

                if ($count === false) {
                    return new Auth_OpenID_AX_Error(
                      sprintf("Integer value expected for %s, got %s",
                              'count. %s' . $alias, $count_s,
                              Auth_OpenID_AX_UNLIMITED_VALUES)
                                                    );
                }

                $values = array();
                for ($i = 1; $i < $count + 1; $i++) {
                    $value_key = sprintf('value.%s.%d', $alias, $i);

                    if (!array_key_exists($value_key, $ax_args)) {
                      return new Auth_OpenID_AX_Error(
                        sprintf(
                                "No value found for key %s",
                                $value_key));
                    }

                    $value = $ax_args[$value_key];
                    $values[] = $value;
                }
            } else {
                $key = 'value.' . $alias;

                if (!array_key_exists($key, $ax_args)) {
                  return new Auth_OpenID_AX_Error(
                    sprintf(
                            "No value found for key %s",
                            $key));
                }

                $value = $ax_args['value.' . $alias];

                if ($value == '') {
                    $values = array();
                } else {
                    $values = array($value);
                }
            }

            $this->data[$type_uri] = $values;
        }

        return true;
    }

    /**
     * Get a single value for an attribute. If no value was sent for
     * this attribute, use the supplied default. If there is more than
     * one value for this attribute, this method will fail.
     *
     * @param type_uri: The URI for the attribute
     * @param default: The value to return if the attribute was not
     * sent in the fetch_response.
     *
     * @return $value Auth_OpenID_AX_Error on failure or the value of
     * the attribute in the fetch_response message, or the default
     * supplied
     */
    function getSingle($type_uri, $default=null)
    {
        $values = Auth_OpenID::arrayGet($this->data, $type_uri);
        if (!$values) {
            return $default;
        } else if (count($values) == 1) {
            return $values[0];
        } else {
            return new Auth_OpenID_AX_Error(
              sprintf('More than one value present for %s',
                      $type_uri)
              );
        }
    }

    /**
     * Get the list of values for this attribute in the
     * fetch_response.
     *
     * XXX: what to do if the values are not present? default
     * parameter? this is funny because it's always supposed to return
     * a list, so the default may break that, though it's provided by
     * the user's code, so it might be okay. If no default is
     * supplied, should the return be None or []?
     *
     * @param type_uri: The URI of the attribute
     *
     * @return $values The list of values for this attribute in the
     * response. May be an empty list.  If the attribute was not sent
     * in the response, returns Auth_OpenID_AX_Error.
     */
    function get($type_uri)
    {
        if (array_key_exists($type_uri, $this->data)) {
            return $this->data[$type_uri];
        } else {
            return new Auth_OpenID_AX_Error(
              sprintf("Type URI %s not found in response",
                      $type_uri)
              );
        }
    }

    /**
     * Get the number of responses for a particular attribute in this
     * fetch_response message.
     *
     * @param type_uri: The URI of the attribute
     *
     * @returns int The number of values sent for this attribute.  If
     * the attribute was not sent in the response, returns
     * Auth_OpenID_AX_Error.
     */
    function count($type_uri)
    {
        if (array_key_exists($type_uri, $this->data)) {
            return count($this->get($type_uri));
        } else {
            return new Auth_OpenID_AX_Error(
              sprintf("Type URI %s not found in response",
                      $type_uri)
              );
        }
    }
}

/**
 * A fetch_response attribute exchange message.
 *
 * @package OpenID
 */
class Auth_OpenID_AX_FetchResponse extends Auth_OpenID_AX_KeyValueMessage {
    var $mode = 'fetch_response';

    function Auth_OpenID_AX_FetchResponse($update_url=null)
    {
        $this->Auth_OpenID_AX_KeyValueMessage();
        $this->update_url = $update_url;
    }

    /**
     * Serialize this object into arguments in the attribute exchange
     * namespace
     *
     * @return $args The dictionary of unqualified attribute exchange
     * arguments that represent this fetch_response, or
     * Auth_OpenID_AX_Error on error.
     */
    function getExtensionArgs($request=null)
    {
        $aliases = new Auth_OpenID_NamespaceMap();

        $zero_value_types = array();

        if ($request !== null) {
            // Validate the data in the context of the request (the
            // same attributes should be present in each, and the
            // counts in the response must be no more than the counts
            // in the request)

            foreach ($this->data as $type_uri => $unused) {
                if (!$request->contains($type_uri)) {
                    return new Auth_OpenID_AX_Error(
                      sprintf("Response attribute not present in request: %s",
                              $type_uri)
                      );
                }
            }

            foreach ($request->iterAttrs() as $attr_info) {
                // Copy the aliases from the request so that reading
                // the response in light of the request is easier
                if ($attr_info->alias === null) {
                    $aliases->add($attr_info->type_uri);
                } else {
                    $alias = $aliases->addAlias($attr_info->type_uri,
                                                $attr_info->alias);

                    if ($alias === null) {
                        return new Auth_OpenID_AX_Error(
                          sprintf("Could not add alias %s for URI %s",
                                  $attr_info->alias, $attr_info->type_uri)
                          );
                    }
                }

                if (array_key_exists($attr_info->type_uri, $this->data)) {
                    $values = $this->data[$attr_info->type_uri];
                } else {
                    $values = array();
                    $zero_value_types[] = $attr_info;
                }

                if (($attr_info->count != Auth_OpenID_AX_UNLIMITED_VALUES) &&
                    ($attr_info->count < count($values))) {
                    return new Auth_OpenID_AX_Error(
                      sprintf("More than the number of requested values " .
                              "were specified for %s",
                              $attr_info->type_uri)
                      );
                }
            }
        }

        $kv_args = $this->_getExtensionKVArgs($aliases);

        // Add the KV args into the response with the args that are
        // unique to the fetch_response
        $ax_args = $this->_newArgs();

        // For each requested attribute, put its type/alias and count
        // into the response even if no data were returned.
        foreach ($zero_value_types as $attr_info) {
            $alias = $aliases->getAlias($attr_info->type_uri);
            $kv_args['type.' . $alias] = $attr_info->type_uri;
            $kv_args['count.' . $alias] = '0';
        }

        $update_url = null;
        if ($request) {
            $update_url = $request->update_url;
        } else {
            $update_url = $this->update_url;
        }

        if ($update_url) {
            $ax_args['update_url'] = $update_url;
        }

        Auth_OpenID::update($ax_args, $kv_args);

        return $ax_args;
    }

    /**
     * @return $result Auth_OpenID_AX_Error on failure or true on
     * success.
     */
    function parseExtensionArgs($ax_args)
    {
        $result = parent::parseExtensionArgs($ax_args);

        if (Auth_OpenID_AX::isError($result)) {
            return $result;
        }

        $this->update_url = Auth_OpenID::arrayGet($ax_args, 'update_url');

        return true;
    }

    /**
     * Construct a FetchResponse object from an OpenID library
     * SuccessResponse object.
     *
     * @param success_response: A successful id_res response object
     *
     * @param signed: Whether non-signed args should be processsed. If
     * True (the default), only signed arguments will be processsed.
     *
     * @return $response A FetchResponse containing the data from the
     * OpenID message
     */
    static function fromSuccessResponse($success_response, $signed=true)
    {
        $obj = new Auth_OpenID_AX_FetchResponse();
        if ($signed) {
            $ax_args = $success_response->getSignedNS($obj->ns_uri);
        } else {
            $ax_args = $success_response->message->getArgs($obj->ns_uri);
        }
        if ($ax_args === null || Auth_OpenID::isFailure($ax_args) ||
              sizeof($ax_args) == 0) {
            return null;
        }

        $result = $obj->parseExtensionArgs($ax_args);
        if (Auth_OpenID_AX::isError($result)) {
            #XXX log me
            return null;
        }
        return $obj;
    }
}

/**
 * A store request attribute exchange message representation.
 *
 * @package OpenID
 */
class Auth_OpenID_AX_StoreRequest extends Auth_OpenID_AX_KeyValueMessage {
    var $mode = 'store_request';

    /**
     * @param array $aliases The namespace aliases to use when making
     * this store response. Leave as None to use defaults.
     */
    function getExtensionArgs($aliases=null)
    {
        $ax_args = $this->_newArgs();
        $kv_args = $this->_getExtensionKVArgs($aliases);
        Auth_OpenID::update($ax_args, $kv_args);
        return $ax_args;
    }
}

/**
 * An indication that the store request was processed along with this
 * OpenID transaction.  Use make(), NOT the constructor, to create
 * response objects.
 *
 * @package OpenID
 */
class Auth_OpenID_AX_StoreResponse extends Auth_OpenID_AX_Message {
    var $SUCCESS_MODE = 'store_response_success';
    var $FAILURE_MODE = 'store_response_failure';

    /**
     * Returns Auth_OpenID_AX_Error on error or an
     * Auth_OpenID_AX_StoreResponse object on success.
     */
    function make($succeeded=true, $error_message=null)
    {
        if (($succeeded) && ($error_message !== null)) {
            return new Auth_OpenID_AX_Error('An error message may only be '.
                                    'included in a failing fetch response');
        }

        return new Auth_OpenID_AX_StoreResponse($succeeded, $error_message);
    }

    function Auth_OpenID_AX_StoreResponse($succeeded=true, $error_message=null)
    {
        if ($succeeded) {
            $this->mode = $this->SUCCESS_MODE;
        } else {
            $this->mode = $this->FAILURE_MODE;
        }

        $this->error_message = $error_message;
    }

    /**
     * Was this response a success response?
     */
    function succeeded()
    {
        return $this->mode == $this->SUCCESS_MODE;
    }

    function getExtensionArgs()
    {
        $ax_args = $this->_newArgs();
        if ((!$this->succeeded()) && $this->error_message) {
            $ax_args['error'] = $this->error_message;
        }

        return $ax_args;
    }
}

