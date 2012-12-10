<?php

/**
 * The OpenID and Yadis discovery implementation for OpenID 1.2.
 */

require_once "Auth/OpenID.php";
require_once "Auth/OpenID/Parse.php";
require_once "Auth/OpenID/Message.php";
require_once "Auth/Yadis/XRIRes.php";
require_once "Auth/Yadis/Yadis.php";

// XML namespace value
define('Auth_OpenID_XMLNS_1_0', 'http://openid.net/xmlns/1.0');

// Yadis service types
define('Auth_OpenID_TYPE_1_2', 'http://openid.net/signon/1.2');
define('Auth_OpenID_TYPE_1_1', 'http://openid.net/signon/1.1');
define('Auth_OpenID_TYPE_1_0', 'http://openid.net/signon/1.0');
define('Auth_OpenID_TYPE_2_0_IDP', 'http://specs.openid.net/auth/2.0/server');
define('Auth_OpenID_TYPE_2_0', 'http://specs.openid.net/auth/2.0/signon');
define('Auth_OpenID_RP_RETURN_TO_URL_TYPE',
       'http://specs.openid.net/auth/2.0/return_to');

function Auth_OpenID_getOpenIDTypeURIs()
{
    return array(Auth_OpenID_TYPE_2_0_IDP,
                 Auth_OpenID_TYPE_2_0,
                 Auth_OpenID_TYPE_1_2,
                 Auth_OpenID_TYPE_1_1,
                 Auth_OpenID_TYPE_1_0);
}

function Auth_OpenID_getOpenIDConsumerTypeURIs()
{
    return array(Auth_OpenID_RP_RETURN_TO_URL_TYPE);
}


/*
 * Provides a user-readable interpretation of a type uri.
 * Useful for error messages.
 */
function Auth_OpenID_getOpenIDTypeName($type_uri) {
    switch ($type_uri) {
    case Auth_OpenID_TYPE_2_0_IDP:
      return 'OpenID 2.0 IDP';
    case Auth_OpenID_TYPE_2_0:
      return 'OpenID 2.0';
    case Auth_OpenID_TYPE_1_2:
      return 'OpenID 1.2';
    case Auth_OpenID_TYPE_1_1:
      return 'OpenID 1.1';
    case Auth_OpenID_TYPE_1_0:
      return 'OpenID 1.0';
    case Auth_OpenID_RP_RETURN_TO_URL_TYPE:
      return 'OpenID relying party';
    }
}

/**
 * Object representing an OpenID service endpoint.
 */
class Auth_OpenID_ServiceEndpoint {
    function Auth_OpenID_ServiceEndpoint()
    {
        $this->claimed_id = null;
        $this->server_url = null;
        $this->type_uris = array();
        $this->local_id = null;
        $this->canonicalID = null;
        $this->used_yadis = false; // whether this came from an XRDS
        $this->display_identifier = null;
    }

    function getDisplayIdentifier()
    {
        if ($this->display_identifier) {
            return $this->display_identifier;
        }
        if (! $this->claimed_id) {
          return $this->claimed_id;
        }
        $parsed = parse_url($this->claimed_id);
        $scheme = $parsed['scheme'];
        $host = $parsed['host'];
        $path = $parsed['path'];
        if (array_key_exists('query', $parsed)) {
            $query = $parsed['query'];
            $no_frag = "$scheme://$host$path?$query";
        } else {
            $no_frag = "$scheme://$host$path";
        }
        return $no_frag;
    }

    function usesExtension($extension_uri)
    {
        return in_array($extension_uri, $this->type_uris);
    }

    function preferredNamespace()
    {
        if (in_array(Auth_OpenID_TYPE_2_0_IDP, $this->type_uris) ||
            in_array(Auth_OpenID_TYPE_2_0, $this->type_uris)) {
            return Auth_OpenID_OPENID2_NS;
        } else {
            return Auth_OpenID_OPENID1_NS;
        }
    }

    /*
     * Query this endpoint to see if it has any of the given type
     * URIs. This is useful for implementing other endpoint classes
     * that e.g. need to check for the presence of multiple versions
     * of a single protocol.
     *
     * @param $type_uris The URIs that you wish to check
     *
     * @return all types that are in both in type_uris and
     * $this->type_uris
     */
    function matchTypes($type_uris)
    {
        $result = array();
        foreach ($type_uris as $test_uri) {
            if ($this->supportsType($test_uri)) {
                $result[] = $test_uri;
            }
        }

        return $result;
    }

    function supportsType($type_uri)
    {
        // Does this endpoint support this type?
        return ((in_array($type_uri, $this->type_uris)) ||
                (($type_uri == Auth_OpenID_TYPE_2_0) &&
                 $this->isOPIdentifier()));
    }

    function compatibilityMode()
    {
        return $this->preferredNamespace() != Auth_OpenID_OPENID2_NS;
    }

    function isOPIdentifier()
    {
        return in_array(Auth_OpenID_TYPE_2_0_IDP, $this->type_uris);
    }

    static function fromOPEndpointURL($op_endpoint_url)
    {
        // Construct an OP-Identifier OpenIDServiceEndpoint object for
        // a given OP Endpoint URL
        $obj = new Auth_OpenID_ServiceEndpoint();
        $obj->server_url = $op_endpoint_url;
        $obj->type_uris = array(Auth_OpenID_TYPE_2_0_IDP);
        return $obj;
    }

    function parseService($yadis_url, $uri, $type_uris, $service_element)
    {
        // Set the state of this object based on the contents of the
        // service element.  Return true if successful, false if not
        // (if findOPLocalIdentifier returns false).
        $this->type_uris = $type_uris;
        $this->server_url = $uri;
        $this->used_yadis = true;

        if (!$this->isOPIdentifier()) {
            $this->claimed_id = $yadis_url;
            $this->local_id = Auth_OpenID_findOPLocalIdentifier(
                                                    $service_element,
                                                    $this->type_uris);
            if ($this->local_id === false) {
                return false;
            }
        }

        return true;
    }

    function getLocalID()
    {
        // Return the identifier that should be sent as the
        // openid.identity_url parameter to the server.
        if ($this->local_id === null && $this->canonicalID === null) {
            return $this->claimed_id;
        } else {
            if ($this->local_id) {
                return $this->local_id;
            } else {
                return $this->canonicalID;
            }
        }
    }

    /*
     * Parse the given document as XRDS looking for OpenID consumer services.
     *
     * @return array of Auth_OpenID_ServiceEndpoint or null if the
     * document cannot be parsed.
     */
    function consumerFromXRDS($uri, $xrds_text)
    {
        $xrds =& Auth_Yadis_XRDS::parseXRDS($xrds_text);

        if ($xrds) {
            $yadis_services =
              $xrds->services(array('filter_MatchesAnyOpenIDConsumerType'));
            return Auth_OpenID_makeOpenIDEndpoints($uri, $yadis_services);
        }

        return null;
    }

    /*
     * Parse the given document as XRDS looking for OpenID services.
     *
     * @return array of Auth_OpenID_ServiceEndpoint or null if the
     * document cannot be parsed.
     */
    static function fromXRDS($uri, $xrds_text)
    {
        $xrds = Auth_Yadis_XRDS::parseXRDS($xrds_text);

        if ($xrds) {
            $yadis_services =
              $xrds->services(array('filter_MatchesAnyOpenIDType'));
            return Auth_OpenID_makeOpenIDEndpoints($uri, $yadis_services);
        }

        return null;
    }

    /*
     * Create endpoints from a DiscoveryResult.
     *
     * @param discoveryResult Auth_Yadis_DiscoveryResult
     * @return array of Auth_OpenID_ServiceEndpoint or null if
     * endpoints cannot be created.
     */
    static function fromDiscoveryResult($discoveryResult)
    {
        if ($discoveryResult->isXRDS()) {
            return Auth_OpenID_ServiceEndpoint::fromXRDS(
                                     $discoveryResult->normalized_uri,
                                     $discoveryResult->response_text);
        } else {
            return Auth_OpenID_ServiceEndpoint::fromHTML(
                                     $discoveryResult->normalized_uri,
                                     $discoveryResult->response_text);
        }
    }

    static function fromHTML($uri, $html)
    {
        $discovery_types = array(
                                 array(Auth_OpenID_TYPE_2_0,
                                       'openid2.provider', 'openid2.local_id'),
                                 array(Auth_OpenID_TYPE_1_1,
                                       'openid.server', 'openid.delegate')
                                 );

        $services = array();

        foreach ($discovery_types as $triple) {
            list($type_uri, $server_rel, $delegate_rel) = $triple;

            $urls = Auth_OpenID_legacy_discover($html, $server_rel,
                                                $delegate_rel);

            if ($urls === false) {
                continue;
            }

            list($delegate_url, $server_url) = $urls;

            $service = new Auth_OpenID_ServiceEndpoint();
            $service->claimed_id = $uri;
            $service->local_id = $delegate_url;
            $service->server_url = $server_url;
            $service->type_uris = array($type_uri);

            $services[] = $service;
        }

        return $services;
    }

    function copy()
    {
        $x = new Auth_OpenID_ServiceEndpoint();

        $x->claimed_id = $this->claimed_id;
        $x->server_url = $this->server_url;
        $x->type_uris = $this->type_uris;
        $x->local_id = $this->local_id;
        $x->canonicalID = $this->canonicalID;
        $x->used_yadis = $this->used_yadis;

        return $x;
    }
}

function Auth_OpenID_findOPLocalIdentifier($service, $type_uris)
{
    // Extract a openid:Delegate value from a Yadis Service element.
    // If no delegate is found, returns null.  Returns false on
    // discovery failure (when multiple delegate/localID tags have
    // different values).

    $service->parser->registerNamespace('openid',
                                        Auth_OpenID_XMLNS_1_0);

    $service->parser->registerNamespace('xrd',
                                        Auth_Yadis_XMLNS_XRD_2_0);

    $parser = $service->parser;

    $permitted_tags = array();

    if (in_array(Auth_OpenID_TYPE_1_1, $type_uris) ||
        in_array(Auth_OpenID_TYPE_1_0, $type_uris)) {
        $permitted_tags[] = 'openid:Delegate';
    }

    if (in_array(Auth_OpenID_TYPE_2_0, $type_uris)) {
        $permitted_tags[] = 'xrd:LocalID';
    }

    $local_id = null;

    foreach ($permitted_tags as $tag_name) {
        $tags = $service->getElements($tag_name);

        foreach ($tags as $tag) {
            $content = $parser->content($tag);

            if ($local_id === null) {
                $local_id = $content;
            } else if ($local_id != $content) {
                return false;
            }
        }
    }

    return $local_id;
}

function filter_MatchesAnyOpenIDType($service)
{
    $uris = $service->getTypes();

    foreach ($uris as $uri) {
        if (in_array($uri, Auth_OpenID_getOpenIDTypeURIs())) {
            return true;
        }
    }

    return false;
}

function filter_MatchesAnyOpenIDConsumerType(&$service)
{
    $uris = $service->getTypes();

    foreach ($uris as $uri) {
        if (in_array($uri, Auth_OpenID_getOpenIDConsumerTypeURIs())) {
            return true;
        }
    }

    return false;
}

function Auth_OpenID_bestMatchingService($service, $preferred_types)
{
    // Return the index of the first matching type, or something
    // higher if no type matches.
    //
    // This provides an ordering in which service elements that
    // contain a type that comes earlier in the preferred types list
    // come before service elements that come later. If a service
    // element has more than one type, the most preferred one wins.

    foreach ($preferred_types as $index => $typ) {
        if (in_array($typ, $service->type_uris)) {
            return $index;
        }
    }

    return count($preferred_types);
}

function Auth_OpenID_arrangeByType($service_list, $preferred_types)
{
    // Rearrange service_list in a new list so services are ordered by
    // types listed in preferred_types.  Return the new list.

    // Build a list with the service elements in tuples whose
    // comparison will prefer the one with the best matching service
    $prio_services = array();
    foreach ($service_list as $index => $service) {
        $prio_services[] = array(Auth_OpenID_bestMatchingService($service,
                                                        $preferred_types),
                                 $index, $service);
    }

    sort($prio_services);

    // Now that the services are sorted by priority, remove the sort
    // keys from the list.
    foreach ($prio_services as $index => $s) {
        $prio_services[$index] = $prio_services[$index][2];
    }

    return $prio_services;
}

// Extract OP Identifier services.  If none found, return the rest,
// sorted with most preferred first according to
// OpenIDServiceEndpoint.openid_type_uris.
//
// openid_services is a list of OpenIDServiceEndpoint objects.
//
// Returns a list of OpenIDServiceEndpoint objects."""
function Auth_OpenID_getOPOrUserServices($openid_services)
{
    $op_services = Auth_OpenID_arrangeByType($openid_services,
                                     array(Auth_OpenID_TYPE_2_0_IDP));

    $openid_services = Auth_OpenID_arrangeByType($openid_services,
                                     Auth_OpenID_getOpenIDTypeURIs());

    if ($op_services) {
        return $op_services;
    } else {
        return $openid_services;
    }
}

function Auth_OpenID_makeOpenIDEndpoints($uri, $yadis_services)
{
    $s = array();

    if (!$yadis_services) {
        return $s;
    }

    foreach ($yadis_services as $service) {
        $type_uris = $service->getTypes();
        $uris = $service->getURIs();

        // If any Type URIs match and there is an endpoint URI
        // specified, then this is an OpenID endpoint
        if ($type_uris &&
            $uris) {
            foreach ($uris as $service_uri) {
                $openid_endpoint = new Auth_OpenID_ServiceEndpoint();
                if ($openid_endpoint->parseService($uri,
                                                   $service_uri,
                                                   $type_uris,
                                                   $service)) {
                    $s[] = $openid_endpoint;
                }
            }
        }
    }

    return $s;
}

function Auth_OpenID_discoverWithYadis($uri, $fetcher,
              $endpoint_filter='Auth_OpenID_getOPOrUserServices',
              $discover_function=null)
{
    // Discover OpenID services for a URI. Tries Yadis and falls back
    // on old-style <link rel='...'> discovery if Yadis fails.

    // Might raise a yadis.discover.DiscoveryFailure if no document
    // came back for that URI at all.  I don't think falling back to
    // OpenID 1.0 discovery on the same URL will help, so don't bother
    // to catch it.
    if ($discover_function === null) {
        $discover_function = array('Auth_Yadis_Yadis', 'discover');
    }

    $openid_services = array();

    $response = call_user_func_array($discover_function,
                                     array($uri, $fetcher));

    $yadis_url = $response->normalized_uri;
    $yadis_services = array();

    if ($response->isFailure() && !$response->isXRDS()) {
        return array($uri, array());
    }

    $openid_services = Auth_OpenID_ServiceEndpoint::fromXRDS(
                                         $yadis_url,
                                         $response->response_text);

    if (!$openid_services) {
        if ($response->isXRDS()) {
            return Auth_OpenID_discoverWithoutYadis($uri,
                                                    $fetcher);
        }

        // Try to parse the response as HTML to get OpenID 1.0/1.1
        // <link rel="...">
        $openid_services = Auth_OpenID_ServiceEndpoint::fromHTML(
                                        $yadis_url,
                                        $response->response_text);
    }

    $openid_services = call_user_func_array($endpoint_filter,
                                            array($openid_services));

    return array($yadis_url, $openid_services);
}

function Auth_OpenID_discoverURI($uri, $fetcher)
{
    $uri = Auth_OpenID::normalizeUrl($uri);
    return Auth_OpenID_discoverWithYadis($uri, $fetcher);
}

function Auth_OpenID_discoverWithoutYadis($uri, $fetcher)
{
    $http_resp = @$fetcher->get($uri);

    if ($http_resp->status != 200 and $http_resp->status != 206) {
        return array($uri, array());
    }

    $identity_url = $http_resp->final_url;

    // Try to parse the response as HTML to get OpenID 1.0/1.1 <link
    // rel="...">
    $openid_services = Auth_OpenID_ServiceEndpoint::fromHTML(
                                           $identity_url,
                                           $http_resp->body);

    return array($identity_url, $openid_services);
}

function Auth_OpenID_discoverXRI($iname, $fetcher)
{
    $resolver = new Auth_Yadis_ProxyResolver($fetcher);
    list($canonicalID, $yadis_services) =
        $resolver->query($iname,
                         Auth_OpenID_getOpenIDTypeURIs(),
                         array('filter_MatchesAnyOpenIDType'));

    $openid_services = Auth_OpenID_makeOpenIDEndpoints($iname,
                                                       $yadis_services);

    $openid_services = Auth_OpenID_getOPOrUserServices($openid_services);

    for ($i = 0; $i < count($openid_services); $i++) {
        $openid_services[$i]->canonicalID = $canonicalID;
        $openid_services[$i]->claimed_id = $canonicalID;
        $openid_services[$i]->display_identifier = $iname;
    }

    // FIXME: returned xri should probably be in some normal form
    return array($iname, $openid_services);
}

function Auth_OpenID_discover($uri, $fetcher)
{
    // If the fetcher (i.e., PHP) doesn't support SSL, we can't do
    // discovery on an HTTPS URL.
    if ($fetcher->isHTTPS($uri) && !$fetcher->supportsSSL()) {
        return array($uri, array());
    }

    if (Auth_Yadis_identifierScheme($uri) == 'XRI') {
        $result = Auth_OpenID_discoverXRI($uri, $fetcher);
    } else {
        $result = Auth_OpenID_discoverURI($uri, $fetcher);
    }

    // If the fetcher doesn't support SSL, we can't interact with
    // HTTPS server URLs; remove those endpoints from the list.
    if (!$fetcher->supportsSSL()) {
        $http_endpoints = array();
        list($new_uri, $endpoints) = $result;

        foreach ($endpoints as $e) {
            if (!$fetcher->isHTTPS($e->server_url)) {
                $http_endpoints[] = $e;
            }
        }

        $result = array($new_uri, $http_endpoints);
    }

    return $result;
}


