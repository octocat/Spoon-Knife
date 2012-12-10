<?php

require_once 'Tests/Auth/OpenID/TestUtil.php';

require_once 'Auth/OpenID/Association.php';
require_once 'Auth/OpenID/Consumer.php';

class AuthRequest_DummyEndpoint {
    var $preferred_namespace = null;
    var $local_id = null;
    var $server_url = null;
    var $is_op_identifier = false;

    function preferredNamespace()
    {
        return $this->preferred_namespace;
    }

    function getLocalID()
    {
        return $this->local_id;
    }

    function isOPIdentifier()
    {
        return $this->is_op_identifier;
    }
}

class AuthRequest_DummyAssoc {
    var $handle = "assoc-handle";
}

/**
 * Base for AuthRequest tests for OpenID 1 and 2.
 */
class TestAuthRequestMixin extends OpenIDTestMixin {

    var $preferred_namespace = null;
    var $immediate = false;
    var $expected_mode = 'checkid_setup';

    function setUp()
    {
        $this->endpoint = new AuthRequest_DummyEndpoint();
        $this->endpoint->local_id = 'http://server.unittest/joe';
        $this->endpoint->claimed_id = 'http://joe.vanity.example/';
        $this->endpoint->server_url = 'http://server.unittest/';
        $this->endpoint->preferred_namespace = $this->preferred_namespace;
        $this->realm = 'http://example/';
        $this->return_to = 'http://example/return/';
        $this->assoc = new AuthRequest_DummyAssoc();
        $this->authreq = new Auth_OpenID_AuthRequest($this->endpoint, $this->assoc);
    }

    function failUnlessAnonymous($msg)
    {
        foreach (array('claimed_id', 'identity') as $key) {
            $this->failIfOpenIDKeyExists($msg, $key);
        }
    }

    function failUnlessHasRequiredFields($msg)
    {
        $this->assertEquals($this->preferred_namespace,
                               $this->authreq->message->getOpenIDNamespace());

        $this->assertEquals($this->preferred_namespace,
                               $msg->getOpenIDNamespace());

        $this->failUnlessOpenIDValueEquals($msg, 'mode',
                                           $this->expected_mode);

        // Implement these in subclasses because they depend on
        // protocol differences!
        $this->failUnlessHasRealm($msg);
        $this->failUnlessIdentifiersPresent($msg);
    }

    // TESTS

    function test_checkNoAssocHandle()
    {
        $this->authreq->assoc = null;
        $msg = $this->authreq->getMessage($this->realm, $this->return_to,
                                          $this->immediate);

        $this->failIfOpenIDKeyExists($msg, 'assoc_handle');
    }

    function test_checkWithAssocHandle()
    {
        $msg = $this->authreq->getMessage($this->realm, $this->return_to,
                                         $this->immediate);

        $this->failUnlessOpenIDValueEquals($msg, 'assoc_handle',
                                           $this->assoc->handle);
    }

    function test_addExtensionArg()
    {
        $this->authreq->addExtensionArg('bag:', 'color', 'brown');
        $this->authreq->addExtensionArg('bag:', 'material', 'paper');
        $this->assertTrue($this->authreq->message->namespaces->contains('bag:'));
        $this->assertEquals($this->authreq->message->getArgs('bag:'),
                            array('color' => 'brown',
                                  'material' => 'paper'));
        $msg = $this->authreq->getMessage($this->realm, $this->return_to,
                                          $this->immediate);

        // XXX: this depends on the way that Message assigns
        // namespaces. Really it doesn't care that it has alias "0",
        // but that is tested anyway
        $post_args = $msg->toPostArgs();
        $this->assertEquals('brown', $post_args['openid.ext0.color']);
        $this->assertEquals('paper', $post_args['openid.ext0.material']);
    }

    function test_standard()
    {
        $msg = $this->authreq->getMessage($this->realm, $this->return_to,
                                         $this->immediate);

        $this->failUnlessHasIdentifiers(
             $msg, $this->endpoint->local_id,
             $this->endpoint->claimed_id);
    }
}

class TestAuthRequestOpenID2 extends TestAuthRequestMixin {
    var $preferred_namespace = Auth_OpenID_OPENID2_NS;

    function failUnlessHasRealm($msg)
    {
        // check presence of proper realm key and absence of the wrong
        // one.
        $this->failUnlessOpenIDValueEquals($msg, 'realm', $this->realm);
        $this->failIfOpenIDKeyExists($msg, 'trust_root');
    }

    function failUnlessIdentifiersPresent($msg)
    {
        $identity_present = $msg->hasKey(Auth_OpenID_OPENID_NS, 'identity');
        $claimed_present = $msg->hasKey(Auth_OpenID_OPENID_NS, 'claimed_id');

        $this->assertEquals($claimed_present, $identity_present);
    }

    function failUnlessHasIdentifiers($msg, $op_specific_id, $claimed_id)
    {
        $this->failUnlessOpenIDValueEquals($msg, 'identity', $op_specific_id);
        $this->failUnlessOpenIDValueEquals($msg, 'claimed_id', $claimed_id);
    }

    // TESTS

    function test_markup_checkidImmediate()
    {
        $result = $this->authreq->formMarkup($this->realm,
                                             null, true);
        $this->assertTrue(Auth_OpenID::isFailure($result));
    }

    function test_markup_returnToArgs()
    {
        $this->authreq->return_to_args = array('extra' => 'args');
        $result = $this->authreq->formMarkup($this->realm,
                                             null, false);
        $this->assertTrue(Auth_OpenID::isFailure($result));
    }

    function test_setAnonymousWorksForOpenID2()
    {
        // OpenID AuthRequests should be able to set 'anonymous' to true.
        $this->assertTrue($this->authreq->message->isOpenID2());
        $this->assertTrue($this->authreq->setAnonymous(true));
        $this->assertTrue($this->authreq->setAnonymous(false));
    }

    function test_userAnonymousIgnoresIdentfier()
    {
        $this->authreq->setAnonymous(true);
        $msg = $this->authreq->getMessage($this->realm, $this->return_to,
                                          $this->immediate);
        $this->failUnlessHasRequiredFields($msg);
        $this->failUnlessAnonymous($msg);
    }

    function test_opAnonymousIgnoresIdentifier()
    {
        $this->endpoint->is_op_identifier = true;
        $this->authreq->setAnonymous(true);
        $msg = $this->authreq->getMessage($this->realm, $this->return_to,
                                          $this->immediate);
        $this->failUnlessHasRequiredFields($msg);
        $this->failUnlessAnonymous($msg);
    }

    function test_opIdentifierSendsIdentifierSelect()
    {
        $this->endpoint->is_op_identifier = true;
        $msg = $this->authreq->getMessage($this->realm, $this->return_to,
                                          $this->immediate);
        $this->failUnlessHasRequiredFields($msg);
        $this->failUnlessHasIdentifiers($msg,
                                        Auth_OpenID_IDENTIFIER_SELECT,
                                        Auth_OpenID_IDENTIFIER_SELECT);
    }
}

class TestAuthRequestOpenID1 extends TestAuthRequestMixin {
    var $preferred_namespace = Auth_OpenID_OPENID1_NS;

    function setUpEndpoint()
    {
        parent::setUpEndpoint();
        $this->endpoint->preferred_namespace = Auth_OpenID_OPENID1_NS;
    }

    function failUnlessHasIdentifiers($msg, $op_specific_id, $claimed_id)
    {
        // Make sure claimed_is is *absent* in request.
        $this->failUnlessOpenIDValueEquals($msg, 'identity', $op_specific_id);
        $this->failIfOpenIDKeyExists($msg, 'claimed_id');
    }

    function failUnlessIdentifiersPresent($msg)
    {
        $this->failIfOpenIDKeyExists($msg, 'claimed_id');
        $this->assertTrue($msg->hasKey(Auth_OpenID_OPENID_NS, 'identity'));
    }

    function failUnlessHasRealm($msg)
    {
        // check presence of proper realm key and absence of the wrong
        // one.
        $this->failUnlessOpenIDValueEquals($msg, 'trust_root', $this->realm);
        $this->failIfOpenIDKeyExists($msg, 'realm');
    }

    // TESTS

    function test_markup_missingReturnTo()
    {
        $result = $this->authreq->formMarkup($this->realm,
                                             null, false);
        $this->assertTrue(Auth_OpenID::isFailure($result));
    }

    function test_setAnonymousFailsForOpenID1()
    {
        // OpenID 1 requests MUST NOT be able to set anonymous to True
        $this->assertTrue($this->authreq->message->isOpenID1());
        $this->assertFalse($this->authreq->setAnonymous(true));
        $this->assertTrue($this->authreq->setAnonymous(false));
    }

    function test_identifierSelect()
    {
        // Identfier select SHOULD NOT be sent, but this pathway is in
        // here in case some special discovery stuff is done to
        // trigger it with OpenID 1. If it is triggered, it will send
        // identifier_select just like OpenID 2.
        $this->endpoint->is_op_identifier = true;
        $msg = $this->authreq->getMessage($this->realm, $this->return_to,
                                          $this->immediate);
        $this->failUnlessHasRequiredFields($msg);
        $this->assertEquals(Auth_OpenID_IDENTIFIER_SELECT,
                            $msg->getArg(Auth_OpenID_OPENID1_NS,
                                         'identity'));
    }
}

class TestAuthRequestOpenID1Immediate extends TestAuthRequestOpenID1 {
    var $immediate = true;
    var $expected_mode = 'checkid_immediate';
}

class TestAuthRequestOpenID2Immediate extends TestAuthRequestOpenID2 {
    var $immediate = true;
    var $expected_mode = 'checkid_immediate';
}

class Tests_Auth_OpenID_AuthRequest extends PHPUnit_Framework_TestSuite {

    function getName()
    {
        return "Tests_Auth_OpenID_AuthRequest";
    }

    function Tests_Auth_OpenID_AuthRequest()
    {
        $this->addTestSuite('TestAuthRequestOpenID1');
        $this->addTestSuite('TestAuthRequestOpenID1Immediate');
        $this->addTestSuite('TestAuthRequestOpenID2');
        $this->addTestSuite('TestAuthRequestOpenID2Immediate');
    }
}

