<?php

require_once "Auth/OpenID/PAPE.php";
require_once "Auth/OpenID/Message.php";
require_once "Auth/OpenID/Server.php";

class PapeRequestTestCase extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->req = new Auth_OpenID_PAPE_Request();
    }

    function test_construct()
    {
      $this->assertEquals(array(), $this->req->preferred_auth_policies);
      $this->assertEquals(null, $this->req->max_auth_age);
      $this->assertEquals('pape', $this->req->ns_alias);

      $req2 = new Auth_OpenID_PAPE_Request(array(PAPE_AUTH_MULTI_FACTOR), 1000);
      $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR), $req2->preferred_auth_policies);
      $this->assertEquals(1000, $req2->max_auth_age);
    }

    function test_add_policy_uri()
    {
      $this->assertEquals(array(), $this->req->preferred_auth_policies);
      $this->req->addPolicyURI(PAPE_AUTH_MULTI_FACTOR);
      $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR), $this->req->preferred_auth_policies);
      $this->req->addPolicyURI(PAPE_AUTH_MULTI_FACTOR);
      $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR), $this->req->preferred_auth_policies);
      $this->req->addPolicyURI(PAPE_AUTH_PHISHING_RESISTANT);
      $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR, PAPE_AUTH_PHISHING_RESISTANT),
                          $this->req->preferred_auth_policies);
      $this->req->addPolicyURI(PAPE_AUTH_MULTI_FACTOR);
      $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR, PAPE_AUTH_PHISHING_RESISTANT),
                          $this->req->preferred_auth_policies);
    }

    function test_getExtensionArgs() {
      $this->assertEquals(array('preferred_auth_policies' => ''), $this->req->getExtensionArgs());
      $this->req->addPolicyURI('http://uri');
      $this->assertEquals(array('preferred_auth_policies' => 'http://uri'), $this->req->getExtensionArgs());
      $this->req->addPolicyURI('http://zig');
      $this->assertEquals(array('preferred_auth_policies' => 'http://uri http://zig'), $this->req->getExtensionArgs());
      $this->req->max_auth_age = 789;
      $this->assertEquals(array('preferred_auth_policies' => 'http://uri http://zig', 'max_auth_age' => '789'), $this->req->getExtensionArgs());
    }

    function test_parseExtensionArgs() {
      $args = array('preferred_auth_policies' => 'http://foo http://bar',
                    'max_auth_age' => '9');
      $this->req->parseExtensionArgs($args);
      $this->assertEquals(9, $this->req->max_auth_age);
      $this->assertEquals(array('http://foo','http://bar'), $this->req->preferred_auth_policies);
    }

    function test_parseExtensionArgs_empty() {
      $this->req->parseExtensionArgs(array());
      $this->assertEquals(null, $this->req->max_auth_age);
      $this->assertEquals(array(), $this->req->preferred_auth_policies);
    }

    function test_fromOpenIDRequest() {
      $openid_req_msg = Auth_OpenID_Message::fromOpenIDArgs(array(
          'mode' => 'checkid_setup',
          'ns' => Auth_OpenID_OPENID2_NS,
          'ns.pape' => Auth_OpenID_PAPE_NS_URI,
          'pape.preferred_auth_policies' => implode(' ', array(PAPE_AUTH_MULTI_FACTOR, PAPE_AUTH_PHISHING_RESISTANT)),
          'pape.max_auth_age' => '5476'
          ));
      $oid_req = new Auth_OpenID_Request();
      $oid_req->message = $openid_req_msg;
      $req = Auth_OpenID_PAPE_Request::fromOpenIDRequest($oid_req);
      $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR, PAPE_AUTH_PHISHING_RESISTANT), $req->preferred_auth_policies);
      $this->assertEquals(5476, $req->max_auth_age);
    }

    function test_fromOpenIDRequest_no_pape() {
      $message = new Auth_OpenID_Message();
      $openid_req = new Auth_OpenID_Request();
      $openid_req->message = $message;
      $pape_req = Auth_OpenID_PAPE_Request::fromOpenIDRequest($openid_req);
      $this->assertTrue($pape_req === null);
    }

    function test_preferred_types() {
        $this->req->addPolicyURI(PAPE_AUTH_PHISHING_RESISTANT);
        $this->req->addPolicyURI(PAPE_AUTH_MULTI_FACTOR);
        $pt = $this->req->preferredTypes(array(PAPE_AUTH_MULTI_FACTOR,
                                               PAPE_AUTH_MULTI_FACTOR_PHYSICAL));
        $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR), $pt);
    }
}

class PAPE_DummySuccessResponse {
  function PAPE_DummySuccessResponse($message, $signed_stuff)
  {
    $this->message = $message;
    $this->signed_stuff = $signed_stuff;
  }

  function getSignedNS($ns_uri)
  {
    return $this->signed_stuff;
  }
}

class PapeResponseTestCase extends PHPUnit_Framework_TestCase {
  function setUp() {
    $this->req = new Auth_OpenID_PAPE_Response();
  }

  function test_construct() {
    $this->assertEquals(array(), $this->req->auth_policies);
    $this->assertEquals(null, $this->req->auth_time);
    $this->assertEquals('pape', $this->req->ns_alias);
    $this->assertEquals(null, $this->req->nist_auth_level);

    $req2 = new Auth_OpenID_PAPE_Response(array(PAPE_AUTH_MULTI_FACTOR),
                                          '2001-01-01T04:05:23Z',
                                          3);
    $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR), $req2->auth_policies);
    $this->assertEquals('2001-01-01T04:05:23Z', $req2->auth_time);
    $this->assertEquals(3, $req2->nist_auth_level);
  }

  function test_add_policy_uri() {
    $this->assertEquals(array(), $this->req->auth_policies);
    $this->req->addPolicyURI(PAPE_AUTH_MULTI_FACTOR);
    $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR), $this->req->auth_policies);
    $this->req->addPolicyURI(PAPE_AUTH_MULTI_FACTOR);
    $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR), $this->req->auth_policies);
    $this->req->addPolicyURI(PAPE_AUTH_PHISHING_RESISTANT);
    $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR, PAPE_AUTH_PHISHING_RESISTANT), $this->req->auth_policies);
    $this->req->addPolicyURI(PAPE_AUTH_MULTI_FACTOR);
    $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR, PAPE_AUTH_PHISHING_RESISTANT), $this->req->auth_policies);
  }

  function test_getExtensionArgs() {
    $this->assertEquals(array('auth_policies' => 'none'), $this->req->getExtensionArgs());
    $this->req->addPolicyURI('http://uri');
    $this->assertEquals(array('auth_policies' => 'http://uri'), $this->req->getExtensionArgs());
    $this->req->addPolicyURI('http://zig');
    $this->assertEquals(array('auth_policies' => 'http://uri http://zig'), $this->req->getExtensionArgs());
    $this->req->auth_time = '2008-03-02T12:34:56Z';
    $this->assertEquals(array('auth_policies' => 'http://uri http://zig', 'auth_time' => '2008-03-02T12:34:56Z'), $this->req->getExtensionArgs());
    $this->req->nist_auth_level = 3;
    $this->assertEquals(array('auth_policies' => 'http://uri http://zig', 'auth_time' => '2008-03-02T12:34:56Z', 'nist_auth_level' => '3'), $this->req->getExtensionArgs());
  }

  function test_getExtensionArgs_error_auth_age() {
    $this->req->auth_time = "foo2008-03-02T12:34:56Z";
    $this->assertEquals(false, $this->req->getExtensionArgs());
    $this->req->auth_time = "2008-03-02T12:34:56Zbar";
    $this->assertEquals(false, $this->req->getExtensionArgs());
  }

  function test_getExtensionArgs_error_nist_auth_level() {
    $this->req->nist_auth_level = "high as a kite";
    $this->assertEquals(false, $this->req->getExtensionArgs());
    $this->req->nist_auth_level = 5;
    $this->assertEquals(false, $this->req->getExtensionArgs());
    $this->req->nist_auth_level = -1;
    $this->assertEquals(false, $this->req->getExtensionArgs());
  }

  function test_parseExtensionArgs() {
    $args = array('auth_policies' => 'http://foo http://bar',
                  'auth_time' => '2008-03-02T12:34:56Z');
    $this->req->parseExtensionArgs($args);
    $this->assertEquals('2008-03-02T12:34:56Z', $this->req->auth_time);
    $this->assertEquals(array('http://foo','http://bar'), $this->req->auth_policies);
  }

  function test_parseExtensionArgs_empty() {
    $this->req->parseExtensionArgs(array());
    $this->assertEquals(null, $this->req->auth_time);
    $this->assertEquals(array(), $this->req->auth_policies);
  }

  function test_parseExtensionArgs_strict_bogus1() {
    $args = array('auth_policies' => 'http://foo http://bar',
                  'auth_time' => 'yesterday');
    $this->assertEquals(false, $this->req->parseExtensionArgs($args, true));
  }

  function test_parseExtensionArgs_strict_bogus2() {
    $args = array('auth_policies' => 'http://foo http://bar',
                  'auth_time' => '63',
                  'nist_auth_level' => 'some');
    $this->assertEquals(false, $this->req->parseExtensionArgs($args, true));
  }

  function test_parseExtensionArgs_strict_good() {
    $args = array('auth_policies' => 'http://foo http://bar',
                  'auth_time' => '2008-03-02T12:34:56Z',
                  'nist_auth_level' => '0');
    $this->req->parseExtensionArgs($args, true);
    $this->assertEquals(array('http://foo','http://bar'), $this->req->auth_policies);
    $this->assertEquals('2008-03-02T12:34:56Z', $this->req->auth_time);
    $this->assertEquals(0, $this->req->nist_auth_level);
  }

  function test_parseExtensionArgs_nostrict_bogus() {
    $args = array('auth_policies' => 'http://foo http://bar',
                  'auth_time' => 'the other day',
                  'nist_auth_level' => 'some');
    $this->req->parseExtensionArgs($args);
    $this->assertEquals(array('http://foo','http://bar'), $this->req->auth_policies);
    $this->assertEquals(null, $this->req->auth_time);
    $this->assertEquals(null, $this->req->nist_auth_level);
  }

  function test_fromSuccessResponse() {
    $openid_req_msg = Auth_OpenID_Message::fromOpenIDArgs(array(
          'mode' => 'id_res',
          'ns' => Auth_OpenID_OPENID2_NS,
          'ns.pape' => Auth_OpenID_PAPE_NS_URI,
          'auth_policies' => implode(' ', array(PAPE_AUTH_MULTI_FACTOR, PAPE_AUTH_PHISHING_RESISTANT)),
          'auth_time' => '2008-03-02T12:34:56Z'
          ));
    $signed_stuff = array(
          'auth_policies' => implode(' ', array(PAPE_AUTH_MULTI_FACTOR, PAPE_AUTH_PHISHING_RESISTANT)),
          'auth_time' => '2008-03-02T12:34:56Z'
        );
    $oid_req = new PAPE_DummySuccessResponse($openid_req_msg, $signed_stuff);
    $req = Auth_OpenID_PAPE_Response::fromSuccessResponse($oid_req);
    $this->assertEquals(array(PAPE_AUTH_MULTI_FACTOR, PAPE_AUTH_PHISHING_RESISTANT), $req->auth_policies);
    $this->assertEquals('2008-03-02T12:34:56Z', $req->auth_time);
  }
}

class Tests_Auth_OpenID_PAPE extends PHPUnit_Framework_TestSuite {
  function getName() {
    return "Tests_Auth_OpenID_PAPE";
  }

  function Tests_Auth_OpenID_PAPE() {
    $this->addTestSuite('PapeRequestTestCase');
    $this->addTestSuite('PapeResponseTestCase');
  }
}


