<?php

require_once "Tests/Auth/OpenID/TestUtil.php";
require_once "Tests/Auth/OpenID/MemStore.php";

require_once "Auth/OpenID/Message.php";
require_once "Auth/OpenID/Consumer.php";

/**
 * A consumer whose _requestAssocation will return predefined results
 * instead of trying to actually perform association requests.
 */
class ErrorRaisingConsumer extends Auth_OpenID_GenericConsumer {
    // The list of objects to be returned by successive calls to
    // _requestAssocation.  Each call will pop the first element from
    // this list and return it to _negotiateAssociation.  If the
    // element is a Message object, it will be wrapped in a
    // ServerErrorContainer exception.  Otherwise it will be returned
    // as-is.
    var $return_messages = array();

    function _requestAssociation($endpoint, $assoc_type, $session_type)
    {
        $m = array_pop($this->return_messages);
        if (is_a($m, 'Auth_OpenID_Message')) {
            return Auth_OpenID_ServerErrorContainer::fromMessage($m);
        } else if (Auth_OpenID::isFailure($m)) {
            return $m;
        } else {
            return $m;
        }
    }
}

/**
 * Test the session type negotiation behavior of an OpenID 2 consumer.
 */
class TestOpenID2SessionNegotiation extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $dumb = null;
        $this->consumer = new ErrorRaisingConsumer($dumb);
        $this->endpoint = new Auth_OpenID_ServiceEndpoint();
        $this->endpoint->type_uris = array(Auth_OpenID_TYPE_2_0);
        $this->endpoint->server_url = 'bogus';
    }

    /**
     * Test the case where the response to an associate request is a
     * server error or is otherwise undecipherable.
     */
    function testBadResponse()
    {
        $this->consumer->return_messages = array(
           new Auth_OpenID_Message($this->endpoint->preferredNamespace()));
        $this->assertEquals($this->consumer->_negotiateAssociation($this->endpoint), null);
        // $this->failUnlessLogMatches('Server error when requesting an association')
    }

    /**
     * Test the case where the response to an associate request is a
     * a failure response object.
     */
    function testBadResponseWithFailure()
    {
        $this->consumer->return_messages = array(
             new Auth_OpenID_FailureResponse($this->endpoint));
        $this->assertEquals($this->consumer->_negotiateAssociation($this->endpoint), null);
        // $this->failUnlessLogMatches('Server error when requesting an association')
    }

    /**
     * Test the case where the association type (assoc_type) returned
     * in an unsupported-type response is absent.
     */
    function testEmptyAssocType()
    {
        $msg = new Auth_OpenID_Message($this->endpoint->preferredNamespace());
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error', 'Unsupported type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error_code', 'unsupported-type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_type', null);
        $msg->setArg(Auth_OpenID_OPENID_NS, 'session_type', 'new-session-type');

        $this->consumer->return_messages = array($msg);
        $this->assertEquals($this->consumer->_negotiateAssociation($this->endpoint), null);

        // $this->failUnlessLogMatches('Unsupported association type',
        //                           'Server responded with unsupported association ' +
        //                           'session but did not supply a fallback.')
    }

    /**
     * Test the case where the session type (session_type) returned in
     * an unsupported-type response is absent.
     */
    function testEmptySessionType()
    {
        $msg = new Auth_OpenID_Message($this->endpoint->preferredNamespace());
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error', 'Unsupported type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error_code', 'unsupported-type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_type', 'new-assoc-type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'session_type', null);

        $this->consumer->return_messages = array($msg);
        $this->assertEquals($this->consumer->_negotiateAssociation($this->endpoint), null);

        // $this->failUnlessLogMatches('Unsupported association type',
        //                           'Server responded with unsupported association ' +
        //                           'session but did not supply a fallback.')
    }

    /**
     * Test the case where an unsupported-type response specifies a
     * preferred (assoc_type, session_type) combination that is not
     * allowed by the consumer's SessionNegotiator.
     */
    function testNotAllowed()
    {
        $allowed_types = array();

        $negotiator = new Auth_OpenID_SessionNegotiator($allowed_types);
        $this->consumer->negotiator = $negotiator;

        $msg = new Auth_OpenID_Message($this->endpoint->preferredNamespace());
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error', 'Unsupported type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error_code', 'unsupported-type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_type', 'not-allowed');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'session_type', 'not-allowed');

        $this->consumer->return_messages = array($msg);
        $this->assertEquals($this->consumer->_negotiateAssociation($this->endpoint), null);

        // $this->failUnlessLogMatches('Unsupported association type',
        //                       'Server sent unsupported session/association type:')
    }

    /**
     * Test the case where an unsupported-type response triggers a
     * retry to get an association with the new preferred type.
     */
    function testUnsupportedWithRetry()
    {
        $msg = new Auth_OpenID_Message($this->endpoint->preferredNamespace());
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error', 'Unsupported type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error_code', 'unsupported-type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_type', 'HMAC-SHA1');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'session_type', 'DH-SHA1');

        $assoc = new Auth_OpenID_Association(
                   'handle', 'secret', 'issued', 10000, 'HMAC-SHA1');

        $this->consumer->return_messages = array($msg, $assoc);
        $this->assertTrue($this->consumer->_negotiateAssociation($this->endpoint) === $assoc);

        // $this->failUnlessLogMatches('Unsupported association type');
    }

    /**
     * Test the case where an unsupported-typ response triggers a
     * retry, but the retry fails and None is returned instead.
     */
    function testUnsupportedWithRetryAndFail()
    {
        $msg = new Auth_OpenID_Message($this->endpoint->preferredNamespace());
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error', 'Unsupported type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error_code', 'unsupported-type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_type', 'HMAC-SHA1');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'session_type', 'DH-SHA1');

        $this->consumer->return_messages = array($msg,
           new Auth_OpenID_Message($this->endpoint->preferredNamespace()));

        $this->assertEquals($this->consumer->_negotiateAssociation($this->endpoint), null);

        // $this->failUnlessLogMatches('Unsupported association type',
        //                           'Server %s refused' % ($this->endpoint.server_url))
    }

    /**
     * Test the valid case, wherein an association is returned on the
     * first attempt to get one.
     */
    function testValid()
    {
        $assoc = new Auth_OpenID_Association(
                   'handle', 'secret', 'issued', 10000, 'HMAC-SHA1');

        $this->consumer->return_messages = array($assoc);
        $this->assertTrue($this->consumer->_negotiateAssociation($this->endpoint) === $assoc);
        // $this->failUnlessLogEmpty()
    }
}

/**
 * Tests for the OpenID 1 consumer association session behavior.  See
 * the docs for TestOpenID2SessionNegotiation.  Notice that this class
 * is not a subclass of the OpenID 2 tests.  Instead, it uses many of
 * the same inputs but inspects the log messages logged with
 * oidutil.log.  See the calls to $this->failUnlessLogMatches.  Some
 * of these tests pass openid2-style messages to the openid 1
 * association processing logic to be sure it ignores the extra data.
 */
class TestOpenID1SessionNegotiation extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $dumb = null;
        $this->consumer = new ErrorRaisingConsumer($dumb);

        $this->endpoint = new Auth_OpenID_ServiceEndpoint();
        $this->endpoint->type_uris = array(Auth_OpenID_OPENID1_NS);
        $this->endpoint->server_url = 'bogus';
    }

    function testBadResponse()
    {
        $this->consumer->return_messages =
            array(new Auth_OpenID_Message($this->endpoint->preferredNamespace()));
        $this->assertEquals($this->consumer->_negotiateAssociation($this->endpoint), null);
        // $this->failUnlessLogMatches('Server error when requesting an association')
    }

    function testEmptyAssocType()
    {
        $msg = new Auth_OpenID_Message($this->endpoint->preferredNamespace());
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error', 'Unsupported type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error_code', 'unsupported-type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_type', null);
        $msg->setArg(Auth_OpenID_OPENID_NS, 'session_type', 'new-session-type');

        $this->consumer->return_messages = array($msg);
        $this->assertEquals($this->consumer->_negotiateAssociation($this->endpoint), null);

        // $this->failUnlessLogMatches('Server error when requesting an association')
    }

    function testEmptySessionType()
    {
        $msg = new Auth_OpenID_Message($this->endpoint->preferredNamespace());
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error', 'Unsupported type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error_code', 'unsupported-type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_type', 'new-assoc-type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'session_type', null);

        $this->consumer->return_messages = array($msg);
        $this->assertEquals($this->consumer->_negotiateAssociation($this->endpoint), null);

        // $this->failUnlessLogMatches('Server error when requesting an association');
    }

    function testNotAllowed()
    {
        $allowed_types = array();

        $negotiator = new Auth_OpenID_SessionNegotiator($allowed_types);
        $this->consumer->negotiator = $negotiator;

        $msg = new Auth_OpenID_Message($this->endpoint->preferredNamespace());
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error', 'Unsupported type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error_code', 'unsupported-type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_type', 'not-allowed');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'session_type', 'not-allowed');

        $this->consumer->return_messages = array($msg);
        $this->assertEquals($this->consumer->_negotiateAssociation($this->endpoint), null);

        // $this->failUnlessLogMatches('Server error when requesting an association')
    }

    function testUnsupportedWithRetry()
    {
        $msg = new Auth_OpenID_Message($this->endpoint->preferredNamespace());
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error', 'Unsupported type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'error_code', 'unsupported-type');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_type', 'HMAC-SHA1');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'session_type', 'DH-SHA1');

        $assoc = new Auth_OpenID_Association(
                   'handle', 'secretxx', 'issued', 10000, 'HMAC-SHA1');

        $this->consumer->return_messages = array($assoc, $msg);

        $result = $this->consumer->_negotiateAssociation($this->endpoint);
        $this->assertTrue($result === null);

        // $this->failUnlessLogMatches('Server error when requesting an association')
    }

    function testValid()
    {
        $assoc = new Auth_OpenID_Association(
                   'handle', 'secret', 'issued', 10000, 'HMAC-SHA1');

        $this->consumer->return_messages = array($assoc);
        $this->assertTrue($this->consumer->_negotiateAssociation($this->endpoint) === $assoc);
        // $this->failUnlessLogEmpty()
    }
}

class TestNegotiatorBehaviors extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->allowed_types = array(
                                     array('HMAC-SHA1', 'no-encryption'),
                                     array('HMAC-SHA256', 'no-encryption')
                                     );

        $this->n = new Auth_OpenID_SessionNegotiator($this->allowed_types);
    }

    function testAddAllowedTypeNoSessionTypes()
    {
        $this->assertFalse($this->n->addAllowedType('invalid'));
    }

    function testAddAllowedTypeBadSessionType()
    {
        $this->assertFalse($this->n->addAllowedType('assoc1', 'invalid'));
    }

    function testAddAllowedTypeContents()
    {
        $assoc_type = 'HMAC-SHA1';
        $this->assertTrue($this->n->addAllowedType($assoc_type));

        foreach (Auth_OpenID_getSessionTypes($assoc_type) as $typ) {
            $this->assertTrue(in_array(array($assoc_type, $typ),
                                       $this->n->allowed_types));
        }
    }
}

class Tests_Auth_OpenID_Negotiation extends PHPUnit_Framework_TestSuite {

    function getName()
    {
        return 'Tests_Auth_OpenID_Negotiation';
    }

    function Tests_Auth_OpenID_Negotiation()
    {
        $this->addTestSuite('TestNegotiatorBehaviors');
        $this->addTestSuite('TestOpenID1SessionNegotiation');
        $this->addTestSuite('TestOpenID2SessionNegotiation');
    }
}

