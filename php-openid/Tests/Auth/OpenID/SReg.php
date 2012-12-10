<?php

/**
 * SReg.php testing code.
 */

require_once 'Auth/OpenID/SReg.php';
require_once 'Auth/OpenID/Message.php';
require_once 'Auth/OpenID/Server.php';

class SRegURITest extends PHPUnit_Framework_TestCase {
    function test_is11()
    {
        $this->assertEquals(Auth_OpenID_SREG_NS_URI_1_1,
                            Auth_OpenID_SREG_NS_URI);
    }
}

class CheckFieldNameTest extends PHPUnit_Framework_TestCase {
    function test_goodNamePasses()
    {
        global $Auth_OpenID_sreg_data_fields;

        foreach ($Auth_OpenID_sreg_data_fields as $field_name => $desc) {
            $this->assertTrue(Auth_OpenID_checkFieldName($field_name));
        }
    }

    function test_badNameFails()
    {
        $this->assertfalse(Auth_OpenID_checkFieldName('INVALID'));
    }

    function test_badTypeFails()
    {
        $this->assertfalse(Auth_OpenID_checkFieldName(null));
    }
}

// For supportsSReg test
class FakeEndpoint {
    function FakeEndpoint($supported)
    {
        $this->supported = $supported;
        $this->checked_uris = array();
    }

    function usesExtension($namespace_uri)
    {
        $this->checked_uris[] = $namespace_uri;
        return in_array($namespace_uri, $this->supported);
    }
}

class SupportsSRegTest extends PHPUnit_Framework_TestCase {
    function test_unsupported()
    {
        $endpoint = new FakeEndpoint(array());
        $this->assertfalse(Auth_OpenID_supportsSReg($endpoint));
        $this->assertEquals(array(Auth_OpenID_SREG_NS_URI_1_1,
                                  Auth_OpenID_SREG_NS_URI_1_0),
                            $endpoint->checked_uris);
    }

    function test_supported_1_1()
    {
        $endpoint = new FakeEndpoint(array(Auth_OpenID_SREG_NS_URI_1_1));
        $this->assertTrue(Auth_OpenID_supportsSReg($endpoint));
        $this->assertEquals(array(Auth_OpenID_SREG_NS_URI_1_1),
                            $endpoint->checked_uris);
    }

    function test_supported_1_0()
    {
        $endpoint = new FakeEndpoint(array(Auth_OpenID_SREG_NS_URI_1_0));
        $this->assertTrue(Auth_OpenID_supportsSReg($endpoint));
        $this->assertEquals(array(Auth_OpenID_SREG_NS_URI_1_1,
                                     Auth_OpenID_SREG_NS_URI_1_0),
                               $endpoint->checked_uris);
    }
}

class FakeMessage {
    function FakeMessage()
    {
        $this->openid1 = false;
        $this->namespaces = new Auth_OpenID_NamespaceMap();
    }

    function isOpenID1()
    {
        return $this->openid1;
    }
}

class GetNSTest extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->msg = new FakeMessage();
    }

    function test_openID2Empty()
    {
        $ns_uri = Auth_OpenID_SRegBase::_getSRegNS($this->msg);
        $this->assertEquals($this->msg->namespaces->getAlias($ns_uri), 'sreg');
        $this->assertEquals(Auth_OpenID_SREG_NS_URI, $ns_uri);
    }

    function test_openID1Empty()
    {
        $this->msg->openid1 = true;
        $ns_uri = Auth_OpenID_SRegBase::_getSRegNS($this->msg);
        $this->assertEquals($this->msg->namespaces->getAlias($ns_uri), 'sreg');
        $this->assertEquals(Auth_OpenID_SREG_NS_URI, $ns_uri);
    }

    function test_openID1Defined_1_0()
    {
        $this->msg->openid1 = true;
        $this->msg->namespaces->add(Auth_OpenID_SREG_NS_URI_1_0);
        $ns_uri = Auth_OpenID_SRegBase::_getSRegNS($this->msg);
        $this->assertEquals(Auth_OpenID_SREG_NS_URI_1_0, $ns_uri);
    }

    function test_openID1Defined_1_0_overrideAlias()
    {
        foreach (array(true, false) as $openid_version) {
            foreach (array(Auth_OpenID_SREG_NS_URI_1_0,
                           Auth_OpenID_SREG_NS_URI_1_1) as $sreg_version) {
                foreach (array('sreg', 'bogus') as $alias) {
                    $this->setUp();

                    $this->msg->openid1 = $openid_version;
                    $this->assertTrue($this->msg->namespaces->addAlias($sreg_version, $alias) !== null);
                    $ns_uri = Auth_OpenID_SRegBase::_getSRegNS($this->msg);
                    $this->assertEquals($this->msg->namespaces->getAlias($ns_uri), $alias);
                    $this->assertEquals($sreg_version, $ns_uri);
                }
            }
        }
    }

    function test_openID1DefinedBadly()
    {
        $this->msg->openid1 = true;
        $this->msg->namespaces->addAlias('http://invalid/', 'sreg');
        $this->assertTrue(Auth_OpenID_SRegBase::_getSRegNS($this->msg) === null);
    }

    function test_openID2DefinedBadly()
    {
        $this->msg->openid1 = false;
        $this->msg->namespaces->addAlias('http://invalid/', 'sreg');
        $this->assertTrue(Auth_OpenID_SRegBase::_getSRegNS($this->msg) === null);
    }

    function test_openID2Defined_1_0()
    {
        $this->msg->namespaces->add(Auth_OpenID_SREG_NS_URI_1_0);
        $ns_uri = Auth_OpenID_SRegBase::_getSRegNS($this->msg);
        $this->assertEquals(Auth_OpenID_SREG_NS_URI_1_0, $ns_uri);
    }

    function test_openID1_sregNSfromArgs()
    {
        $args = array(
            'sreg.optional' => 'nickname',
            'sreg.required' => 'dob');

        $m = Auth_OpenID_Message::fromOpenIDArgs($args);

        $this->assertTrue($m->getArg(Auth_OpenID_SREG_NS_URI_1_1, 'optional') == 'nickname');
        $this->assertTrue($m->getArg(Auth_OpenID_SREG_NS_URI_1_1, 'required') == 'dob');
    }
}

global $__args_sentinel;
global $__ns_sentinel;
$__args_sentinel = 'args_sentinel';
$__ns_sentinel = 'ns_sentinel';

class SentinelFakeMessage {
    function SentinelFakeMessage($test_case)
    {
        $this->test_case =& $test_case;
        $this->message = new Auth_OpenID_Message();
    }

    function getArgs($ns_uri)
    {
        global $__ns_sentinel, $__args_sentinel;
        $this->test_case->assertEquals($__ns_sentinel, $ns_uri);
        return $__args_sentinel;
    }
}

// XXX Ugly hack.  Thanks, PHP.
global $__TestingReq_TEST_CASE;
$__TestingReq_TEST_CASE = "FLUB";

function __setTestCase($thing) {
  global $__TestingReq_TEST_CASE;
  $__TestingReq_TEST_CASE = $thing;
}

function &__getTestCase() {
  global $__TestingReq_TEST_CASE;
  return $__TestingReq_TEST_CASE;
}

class TestingReq extends Auth_OpenID_SRegRequest {
    static function fromOpenIDRequest($thing, $test_case)
    {
        __setTestCase($test_case);
        $obj = parent::fromOpenIDRequest($thing, 'TestingReq');
        return $obj;
    }

    static function _getSRegNS($unused)
    {
        global $__ns_sentinel;
        return $__ns_sentinel;
    }

    function parseExtensionArgs($args)
    {
        global $__args_sentinel;
        $tc =& __getTestCase();
        $tc->assertEquals($__args_sentinel, $args);
    }
}

class SRegRequestTest extends PHPUnit_Framework_TestCase {
    function test_constructEmpty()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertEquals(array(), $req->optional);
        $this->assertEquals(array(), $req->required);
        $this->assertEquals(null, $req->policy_url);
        $this->assertEquals(Auth_OpenID_SREG_NS_URI, $req->ns_uri);
    }

    function test_constructFields()
    {
        $req = Auth_OpenID_SRegRequest::build(
                                              array('nickname'),
                                              array('gender'),
                                              'http://policy',
                                              'http://sreg.ns_uri');
        $this->assertEquals(array('gender'), $req->optional);
        $this->assertEquals(array('nickname'), $req->required);
        $this->assertEquals('http://policy', $req->policy_url);
        $this->assertEquals('http://sreg.ns_uri', $req->ns_uri);
    }

    function test_constructBadFields()
    {
        $this->assertTrue(Auth_OpenID_SRegRequest::build(array('elvis')) === null);
    }

    function test_fromOpenIDResponse()
    {
        $openid_req = new Auth_OpenID_Request();

        $msg = new SentinelFakeMessage($this);
        $openid_req->message =& $msg;

        $req = TestingReq::fromOpenIDRequest($openid_req, $this);
        $this->assertTrue(is_a($req, 'TestingReq'));
    }

    function test_parseExtensionArgs_empty()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertTrue($req->parseExtensionArgs(array()));
    }

    function test_parseExtensionArgs_extraIgnored()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertTrue($req->parseExtensionArgs(array('janrain' => 'inc')));
    }

    function test_parseExtensionArgs_nonStrict()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertTrue($req->parseExtensionArgs(array('required' => 'beans')));
        $this->assertEquals(array(), $req->required);
    }

    function test_parseExtensionArgs_strict()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertFalse($req->parseExtensionArgs(array('required' => 'beans'),
                                                    true));
    }

    function test_parseExtensionArgs_policy()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertTrue($req->parseExtensionArgs(
                                array('policy_url' => 'http://policy'), true));
        $this->assertEquals('http://policy', $req->policy_url);
    }

    function test_parseExtensionArgs_requiredEmpty()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertTrue($req->parseExtensionArgs(array('required' => ''), true));
        $this->assertEquals(array(), $req->required);
    }

    function test_parseExtensionArgs_optionalEmpty()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertTrue($req->parseExtensionArgs(array('optional' => ''), true));
        $this->assertEquals(array(), $req->optional);
    }

    function test_parseExtensionArgs_optionalSingle()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertTrue($req->parseExtensionArgs(array('optional' => 'nickname'), true));
        $this->assertEquals(array('nickname'), $req->optional);
    }

    function test_parseExtensionArgs_optionalList()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertTrue($req->parseExtensionArgs(array('optional' => 'nickname,email'), true));
        $this->assertEquals(array('nickname','email'), $req->optional);
    }

    function test_parseExtensionArgs_optionalListBadNonStrict()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertTrue($req->parseExtensionArgs(array('optional' => 'nickname,email,beer')));
        $this->assertEquals(array('nickname','email'), $req->optional);
    }

    function test_parseExtensionArgs_optionalListBadStrict()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertFalse($req->parseExtensionArgs(array('optional' => 'nickname,email,beer'),
                                                    true));
    }

    function test_parseExtensionArgs_bothNonStrict()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertTrue($req->parseExtensionArgs(array('optional' => 'nickname',
                                                         'required' => 'nickname')));
        $this->assertEquals(array(), $req->optional);
        $this->assertEquals(array('nickname'), $req->required);
    }

    function test_parseExtensionArgs_bothStrict()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertFalse($req->parseExtensionArgs(
                                                    array('optional' => 'nickname',
                                                          'required' => 'nickname'),
                                                    true));
    }

    function test_parseExtensionArgs_bothList()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertTrue($req->parseExtensionArgs(array('optional' => 'nickname,email',
                                                         'required' => 'country,postcode'),
                                                   true));
        $this->assertEquals(array('nickname','email'), $req->optional);
        $this->assertEquals(array('country','postcode'), $req->required);
    }

    function test_allRequestedFields()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertEquals(array(), $req->allRequestedFields());
        $req->requestField('nickname');
        $this->assertEquals(array('nickname'), $req->allRequestedFields());
        $req->requestField('gender', true);
        $requested = $req->allRequestedFields();
        sort($requested);
        $this->assertEquals(array('gender', 'nickname'), $requested);
    }

    function test_wereFieldsRequested()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertFalse($req->wereFieldsRequested());
        $req->requestField('gender');
        $this->assertTrue($req->wereFieldsRequested());
    }

    function test_contains()
    {
        global $Auth_OpenID_sreg_data_fields;

        $req = Auth_OpenID_SRegRequest::build();
        foreach ($Auth_OpenID_sreg_data_fields as $field_name => $desc) {
            $this->assertFalse($req->contains($field_name));
        }

        $this->assertFalse($req->contains('something else'));

        $req->requestField('nickname');
        foreach ($Auth_OpenID_sreg_data_fields as $field_name => $desc) {
            if ($field_name == 'nickname') {
                $this->assertTrue($req->contains($field_name));
            } else {
                $this->assertFalse($req->contains($field_name));
            }
        }
    }

    function test_requestField_bogus()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertFalse($req->requestField('something else'));
        $this->assertFalse($req->requestField('something else', true));
    }

    function test_requestField()
    {
        global $Auth_OpenID_sreg_data_fields;

        // Add all of the fields, one at a time
        $req = Auth_OpenID_SRegRequest::build();
        $fields = array_keys($Auth_OpenID_sreg_data_fields);
        foreach ($fields as $field_name) {
            $req->requestField($field_name);
        }

        $this->assertEquals($fields, $req->optional);
        $this->assertEquals(array(), $req->required);

        // By default, adding the same fields over again has no effect
        foreach ($fields as $field_name) {
            $req->requestField($field_name);
        }

        $this->assertEquals($fields, $req->optional);
        $this->assertEquals(array(), $req->required);

        // Requesting a field as required overrides requesting it as
        // optional
        $expected = $fields;
        $overridden = array_pop($expected);

        $this->assertTrue($req->requestField($overridden, true));

        $this->assertEquals($expected, $req->optional);
        $this->assertEquals(array($overridden), $req->required);

        // Requesting a field as required overrides requesting it as
        // optional
        foreach ($fields as $field_name) {
            $this->assertTrue($req->requestField($field_name, true));
        }

        $this->assertEquals(array(), $req->optional);
        foreach ($fields as $f) {
            $this->assertTrue(in_array($f, $req->required));
        }

        // Requesting it as optional does not downgrade it to optional
        foreach ($fields as $field_name) {
            $req->requestField($field_name);
        }

        $this->assertEquals(array(), $req->optional);

        foreach ($fields as $f) {
            $this->assertTrue(in_array($f, $req->required));
        }
    }

    function test_requestFields_type()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertFalse($req->requestFields('nickname'));
    }

    function test_requestFields()
    {
        global $Auth_OpenID_sreg_data_fields;

        // Add all of the fields
        $req = Auth_OpenID_SRegRequest::build();

        $fields = array_keys($Auth_OpenID_sreg_data_fields);
        $req->requestFields($fields);

        $this->assertEquals($fields, $req->optional);
        $this->assertEquals(array(), $req->required);

        // By default, adding the same fields over again has no effect
        $req->requestFields($fields);

        $this->assertEquals($fields, $req->optional);
        $this->assertEquals(array(), $req->required);

        // Requesting a field as required overrides requesting it as
        // optional
        $expected = $fields;
        $overridden = array_shift($expected);
        $req->requestFields(array($overridden), true);

        foreach ($expected as $f) {
            $this->assertTrue(in_array($f, $req->optional));
        }

        $this->assertEquals(array($overridden), $req->required);

        // Requesting a field as required overrides requesting it as
        // optional
        $req->requestFields($fields, true);

        $this->assertEquals(array(), $req->optional);
        $this->assertEquals($fields, $req->required);

        // Requesting it as optional does not downgrade it to optional
        $req->requestFields($fields);

        $this->assertEquals(array(), $req->optional);
        $this->assertEquals($fields, $req->required);
    }

    function test_getExtensionArgs()
    {
        $req = Auth_OpenID_SRegRequest::build();
        $this->assertEquals(array(), $req->getExtensionArgs());

        $this->assertTrue($req->requestField('nickname'));
        $this->assertEquals(array('optional' => 'nickname'),
                            $req->getExtensionArgs());

        $this->assertTrue($req->requestField('email'));
        $this->assertEquals(array('optional' => 'nickname,email'),
                            $req->getExtensionArgs());

        $this->assertTrue($req->requestField('gender', true));
        $this->assertEquals(array('optional' => 'nickname,email',
                                  'required' => 'gender'),
                            $req->getExtensionArgs());

        $this->assertTrue($req->requestField('postcode', true));
        $this->assertEquals(array('optional' => 'nickname,email',
                                  'required' => 'gender,postcode'),
                            $req->getExtensionArgs());

        $req->policy_url = 'http://policy.invalid/';
        $this->assertEquals(array('optional' => 'nickname,email',
                                  'required' => 'gender,postcode',
                                  'policy_url' => 'http://policy.invalid/'),
                            $req->getExtensionArgs());
    }
}

class DummySuccessResponse {
    function DummySuccessResponse($message, $signed_stuff)
    {
        $this->message = $message;
        $this->signed_stuff = $signed_stuff;
    }

    function getSignedNS($ns_uri)
    {
        return $this->signed_stuff;
    }
}

class SRegResponseTest extends PHPUnit_Framework_TestCase {
    function test_fromSuccessResponse_signed()
    {
        $message = Auth_OpenID_Message::fromOpenIDArgs(array(
            'sreg.nickname' => 'The Mad Stork',
            ));
        $success_resp = new DummySuccessResponse($message, array());
        $sreg_resp = Auth_OpenID_SRegResponse::fromSuccessResponse($success_resp);
        $this->assertTrue(count($sreg_resp->contents()) === 0);
    }

    function test_fromSuccessResponse_unsigned()
    {
        $message = Auth_OpenID_Message::fromOpenIDArgs(array(
            'sreg.nickname' => 'The Mad Stork',
            ));

        $success_resp = new DummySuccessResponse($message, array());
        $sreg_resp = Auth_OpenID_SRegResponse::fromSuccessResponse($success_resp,
                                                                   false);

        $this->assertEquals(array('nickname' => 'The Mad Stork'),
                            $sreg_resp->contents());
    }
}

class SendFieldsTest extends PHPUnit_Framework_TestCase {
    function _test($uri)
    {
        // Create a request message with simple registration fields
        $sreg_req = Auth_OpenID_SRegRequest::build(array('nickname', 'email'),
                                                   array('fullname'));
        $req_msg = new Auth_OpenID_Message($uri);
        $req_msg->updateArgs(Auth_OpenID_SREG_NS_URI,
                             $sreg_req->getExtensionArgs());

        $req = new Auth_OpenID_Request();
        $req->message =& $req_msg;
        $req->namespace = $req_msg->getOpenIDNamespace();

        // -> send checkid_* request

        // Create an empty response message
        $resp_msg = new Auth_OpenID_Message($uri);
        $resp = new Auth_OpenID_ServerResponse($req);
        $resp->fields = $resp_msg;

        $data = array(
                      'nickname' => 'linusaur',
                      'postcode' => '12345',
                      'country' => 'US',
                      'gender' => 'M',
                      'fullname' => 'Leonhard Euler',
                      'email' => 'president@whitehouse.gov',
                      'dob' => '0000-00-00',
                      'language' => 'en-us');

        // Put the requested data fields in the response message
        $sreg_resp = Auth_OpenID_SRegResponse::extractResponse($sreg_req, $data);
        $resp->addExtension($sreg_resp);

        // <- send id_res response

        // Extract the fields that were sent
        $sreg_data_resp = $resp->fields->getArgs(Auth_OpenID_SREG_NS_URI);
        $this->assertEquals(
                            array('nickname' => 'linusaur',
                                  'email' => 'president@whitehouse.gov',
                                  'fullname' => 'Leonhard Euler'),
                            $sreg_data_resp);
    }

    function test()
    {
        foreach (array(Auth_OpenID_OPENID1_NS,
                       Auth_OpenID_OPENID2_NS) as $uri) {
            $this->_test($uri);
        }
    }
}

class Tests_Auth_OpenID_SReg extends PHPUnit_Framework_TestSuite {
    function getName()
    {
        return "Tests_Auth_OpenID_SReg";
    }

    function Tests_Auth_OpenID_SReg()
    {
        $this->addTestSuite('SRegURITest');
        $this->addTestSuite('CheckFieldNameTest');
        $this->addTestSuite('SupportsSRegTest');
        $this->addTestSuite('GetNSTest');
        $this->addTestSuite('SRegRequestTest');
        $this->addTestSuite('SRegResponseTest');
        $this->addTestSuite('SendFieldsTest');
    }
}

