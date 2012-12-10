<?php

/**
 * Tests for the combination of Yadis discovery and the OpenID
 * protocol.
 */

require_once "Auth/Yadis/XRDS.php";
require_once "Auth/OpenID/Discover.php";

global $__XRDS_BOILERPLATE;
$__XRDS_BOILERPLATE = '<?xml version="1.0" encoding="UTF-8"?>
<xrds:XRDS xmlns:xrds="xri://$xrds"
           xmlns="xri://$xrd*($v*2.0)"
           xmlns:openid="http://openid.net/xmlns/1.0">
    <XRD>
%s
    </XRD>
</xrds:XRDS>
';

// Different sets of server URLs for use in the URI tag
global $__server_url_options;
$__server_url_options = array(
           array(), // This case should not generate an endpoint object
           array('http://server.url/'),
           array('https://server.url/'),
           array('https://server.url/', 'http://server.url/'),
           array('https://server.url/',
                 'http://server.url/',
                 'http://example.server.url/'),
           );

// A couple of example extension type URIs. These are not at all
// official, but are just here for testing.
global $__ext_types;
$__ext_types = array(
                     'http://janrain.com/extension/blah',
                     'http://openid.net/sreg/1.0');

// All valid combinations of Type tags that should produce an OpenID
// endpoint
global $__openid_types;
$__openid_types = array(
                        Auth_OpenID_TYPE_1_0,
                        Auth_OpenID_TYPE_1_1);

$temp = array();
foreach (__subsets($__ext_types) as $exts) {
    foreach (__subsets($__openid_types) as $ts) {
        if ($ts) {
            $temp[] = array_merge($exts, $ts);
        }
    }
}

global $__type_uri_options;
$__type_uri_options = $temp;

// Range of valid Delegate tag values for generating test data
global $__delegate_options;
$__delegate_options = array(
                            null,
                            'http://vanity.domain/',
                            'https://somewhere/yadis/');

$temp = array();
foreach ($__delegate_options as $delegate) {
    foreach ($__type_uri_options as $type_uris) {
        foreach ($__server_url_options as $uris) {
            $temp[] = array($uris, $type_uris, $delegate);
        }
    }
}

// All combinations of valid URIs, Type URIs and Delegate tags
global $__data;
$__data = $temp;

function _mkXRDS($services_str)
{
    global $__XRDS_BOILERPLATE;
    return sprintf($__XRDS_BOILERPLATE, $services_str);
}

function _mkService($uris = null, $type_uris = null,
                    $delegate = null, $dent = '        ')
{
    $chunks = array($dent, "<Service>\n");
    $dent2 = $dent . '    ';
    if ($type_uris) {
        foreach ($type_uris as $type_uri) {
            $chunks = array_merge($chunks,
                                  array($dent2 . '<Type>',
                                        $type_uri, "</Type>\n"));
        }
    }

    if ($uris) {
        foreach ($uris as $uri) {
            if (is_array($uri)) {
                list($uri, $prio) = $uri;
            } else {
                $prio = null;
            }
            $chunks = array_merge($chunks, array($dent2, '<URI'));
            if ($prio !== null) {
                    $chunks = array_merge($chunks, array(' priority="', strval($prio), '"'));
            }
            $chunks = array_merge($chunks, array('>', $uri, "</URI>\n"));
        }
    }

    if ($delegate) {
        $chunks = array_merge($chunks,
                              array($dent2, '<openid:Delegate>',
                                    $delegate, "</openid:Delegate>\n"));
    }

    $chunks = array_merge($chunks, array($dent, "</Service>\n"));

    return implode("", $chunks);
}

// Used for generating test data
function __subsets($list)
{
    // Generate all non-empty sublists of a list
    $subsets_list = array(array());
    foreach ($list as $elem) {

        $temp = array();
        foreach ($subsets_list as $t) {
            $temp[] = array_merge(array($elem), $t);
        }

        $subsets_list = array_merge($subsets_list, $temp);
    }

    return $subsets_list;
}

class Tests_Auth_OpenID_Tester extends PHPUnit_Framework_TestCase {
    function Tests_Auth_OpenID_Tester($uris, $type_uris, $delegate)
    {
        parent::__construct();
        $this->uris = $uris;
        $this->type_uris = $type_uris;
        $this->local_id = $delegate;
    }

    function setUp()
    {
        $this->yadis_url = 'http://unit.test/';

        // Create an XRDS document to parse
        $services = _mkService($this->uris,
                               $this->type_uris,
                               $this->local_id);
        $this->xrds = _mkXRDS($services);
    }

    function runTest()
    {
        // Parse into endpoint objects that we will check
        $xrds_object = Auth_Yadis_XRDS::parseXRDS($this->xrds);

        $endpoints = array();

        if ($xrds_object) {
            $endpoints = $xrds_object->services(array('filter_MatchesAnyOpenIDType'));
            $endpoints = Auth_OpenID_makeOpenIDEndpoints($this->yadis_url, $endpoints);
        }

        // make sure there are the same number of endpoints as
        // URIs. This assumes that the type_uris contains at least one
        // OpenID type.
        $this->assertEquals(count($this->uris), count($endpoints),
                            "URI <-> Endpoint count");

        // So that we can check equality on the endpoint types
        $type_uris = $this->type_uris;
        sort($type_uris);


        $seen_uris = array();
        foreach ($endpoints as $endpoint) {
            $seen_uris[] = $endpoint->server_url;

            // All endpoints will have same yadis_url
            $this->assertEquals($this->yadis_url, $endpoint->claimed_id);

            // and delegate
            $this->assertEquals($this->local_id, $endpoint->local_id);

            // and types
            $actual_types = $endpoint->type_uris;
            sort($actual_types);
            $this->assertEquals($actual_types, $type_uris);
        }

        // So that they will compare equal, because we don't care what
        // order they are in
        sort($seen_uris);
        $uris = $this->uris;
        sort($uris);

        // Make sure we saw all URIs, and saw each one once
        $this->assertEquals($uris, $seen_uris);
    }
}

class Tests_Auth_OpenID_OpenID_Yadis extends PHPUnit_Framework_TestSuite {
    function Tests_Auth_OpenID_OpenID_Yadis()
    {
        global $__data;
        foreach ($__data as $case) {
            $this->addTest(new Tests_Auth_OpenID_Tester($case[0], $case[1], $case[2]));
        }
    }

    function getName()
    {
        return 'Tests_Auth_OpenID_OpenID_Yadis';
    }

}

