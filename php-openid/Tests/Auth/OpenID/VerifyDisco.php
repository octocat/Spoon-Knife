<?php

require_once "Tests/Auth/OpenID/TestUtil.php";
require_once "Tests/Auth/OpenID/MemStore.php";

require_once "Auth/OpenID/Message.php";
require_once "Auth/OpenID/Consumer.php";

class Tests_Auth_OpenID_VerifyDisco_1 extends Auth_OpenID_GenericConsumer {
    function _discoverAndVerify($claimed_id, $to_match_endpoints)
    {
        $this->test_case->assertEquals($this->endpoint->claimed_id, $claimed_id);
        return new Auth_OpenID_FailureResponse(null, $this->text);
    }
}

class __VerifiedError extends Auth_OpenID_FailureResponse {
}

class VerifyDisco_Consumer_verifiedError extends Auth_OpenID_GenericConsumer {
    function _discoverAndVerify($to_match)
    {
        return new __VerifiedError(null, 'verified error');
    }
}

class _DiscoverAndVerify extends OpenIDTestMixin {
    var $consumer_class = 'Auth_OpenID_GenericConsumer';

    function setUp()
    {
        $this->store = new Tests_Auth_OpenID_MemStore();
        $cl = $this->consumer_class;
        $this->consumer = new $cl($this->store);
        $this->return_to = "http://some.host/path";
        $this->endpoint = new Auth_OpenID_ServiceEndpoint();

        $this->server_id = "sirod";
        $this->server_url = "serlie";
        $this->consumer_id = "consu";

        $this->endpoint->claimed_id = $this->consumer_id;
        $this->endpoint->server_url = $this->server_url;
        $this->endpoint->local_id = $this->server_id;
        $this->endpoint->type_uris = array(Auth_OpenID_TYPE_1_1);
    }

    function failUnlessProtocolError($thing)
    {
        $this->assertTrue(Auth_OpenID::isFailure($thing));
    }
}

class _Tests_discoveryOverride {
    function _Tests_discoveryOverride($endpoint)
    {
        $this->endpoint = $endpoint;
    }

    function discover($unused_url)
    {
        return array($this->endpoint->claimed_id, array($this->endpoint));
    }
}
class Tests_openID1Fallback1_0 extends _DiscoverAndVerify {
    function test_openID1Fallback1_0()
    {
        $claimed_id = 'http://claimed.id/';
        $resp_msg = Auth_OpenID_Message::fromOpenIDArgs(
            array('ns' => Auth_OpenID_OPENID1_NS,
                  'identity' => $claimed_id));
        $resp_msg->setArg(Auth_OpenID_BARE_NS, 'openid1_claimed_id',
                          $claimed_id);
        $expected_endpoint = new Auth_OpenID_ServiceEndpoint();
        $expected_endpoint->type_uris = array(Auth_OpenID_TYPE_1_0);
        $expected_endpoint->local_id = null;
        $expected_endpoint->claimed_id = $claimed_id;

        $discovery_override = new _Tests_discoveryOverride($expected_endpoint);
        $this->consumer->discoverMethod = array($discovery_override, 'discover');

        $actual_endpoint = $this->consumer->_verifyDiscoveryResults(
            $resp_msg, null);

        $this->assertTrue(is_a($actual_endpoint, "Auth_OpenID_ServiceEndpoint"));

        $this->assertEquals($expected_endpoint->local_id,
                            $actual_endpoint->local_id);
        $this->assertEquals($expected_endpoint->server_url,
                            $actual_endpoint->server_url);

        $this->assertEquals($expected_endpoint->type_uris,
                            $actual_endpoint->type_uris);

        $this->assertEquals($expected_endpoint->claimed_id,
                            $actual_endpoint->claimed_id);

    }
}

class Tests_Auth_OpenID_VerifyDisco extends _DiscoverAndVerify {
    function test_openID1NoLocalID()
    {
        $endpoint = new Auth_OpenID_ServiceEndpoint();
        $endpoint->claimed_id = 'bogus';

        $msg = Auth_OpenID_Message::fromOpenIDArgs(array());
        // 'Missing required field openid.identity'
        $this->failUnlessProtocolError($this->consumer->_verifyDiscoveryResults($msg, $endpoint));
    }

    function test_openID1NoEndpoint()
    {
        $msg = Auth_OpenID_Message::fromOpenIDArgs(array('identity' => 'snakes on a plane'));
        $this->failUnlessProtocolError($this->consumer->_verifyDiscoveryResults($msg));
    }

    function test_openID2NoOPEndpointArg()
    {
        $msg = Auth_OpenID_Message::fromOpenIDArgs(array('ns' => Auth_OpenID_OPENID2_NS));
        $this->failUnlessProtocolError($this->consumer->_verifyDiscoveryResults($msg, null));
    }

    function test_openID2LocalIDNoClaimed()
    {
        $msg = Auth_OpenID_Message::fromOpenIDArgs(array('ns' => Auth_OpenID_OPENID2_NS,
                                                         'op_endpoint' => 'Phone Home',
                                                         'identity' => 'Jose Lius Borges'));
        // 'openid.identity is present without',
        $this->failUnlessProtocolError($this->consumer->_verifyDiscoveryResults($msg));
    }

    function test_openID2NoLocalIDClaimed()
    {
        $msg = Auth_OpenID_Message::fromOpenIDArgs(array('ns' => Auth_OpenID_OPENID2_NS,
                                                         'op_endpoint' => 'Phone Home',
                                                         'claimed_id' => 'Manuel Noriega'));
        // 'openid.claimed_id is present without',
        $this->failUnlessProtocolError(
           $this->consumer->_verifyDiscoveryResults($msg));
    }

    function test_openID2NoIdentifiers()
    {
        $op_endpoint = 'Phone Home';
        $msg = Auth_OpenID_Message::fromOpenIDArgs(array('ns' => Auth_OpenID_OPENID2_NS,
                                                         'op_endpoint' => $op_endpoint));
        $result_endpoint = $this->consumer->_verifyDiscoveryResults($msg);
        $this->assertTrue($result_endpoint->isOPIdentifier());
        $this->assertEquals($op_endpoint, $result_endpoint->server_url);
        $this->assertEquals(null, $result_endpoint->claimed_id);
    }

    function test_openid2UsePreDiscovered()
    {
        $endpoint = new Auth_OpenID_ServiceEndpoint();
        $endpoint->local_id = 'my identity';
        $endpoint->claimed_id = 'i am sam';
        $endpoint->server_url = 'Phone Home';
        $endpoint->type_uris = array(Auth_OpenID_TYPE_2_0);

        $msg = Auth_OpenID_Message::fromOpenIDArgs(
                    array('ns' => Auth_OpenID_OPENID2_NS,
                          'identity' => $endpoint->local_id,
                          'claimed_id' => $endpoint->claimed_id,
                          'op_endpoint' => $endpoint->server_url));

        $result = $this->consumer->_verifyDiscoveryResults($msg, $endpoint);
        $this->assertTrue($result === $endpoint);
    }

    function test_openid2UsePreDiscoveredWrongType()
    {
        $this->consumer = new Tests_Auth_OpenID_VerifyDisco_1($this->store);
        $this->consumer->test_case =& $this;
        $this->consumer->text = "verify failed";

        $endpoint = new Auth_OpenID_ServiceEndpoint();
        $endpoint->local_id = 'my identity';
        $endpoint->claimed_id = 'i am sam';
        $endpoint->server_url = 'Phone Home';
        $endpoint->type_uris = array(Auth_OpenID_TYPE_1_1);

        $this->consumer->endpoint =& $endpoint;

        $msg = Auth_OpenID_Message::fromOpenIDArgs(
              array('ns' => Auth_OpenID_OPENID2_NS,
                    'identity' => $endpoint->local_id,
                    'claimed_id' => $endpoint->claimed_id,
                    'op_endpoint' => $endpoint->server_url));

        $result = $this->consumer->_verifyDiscoveryResults($msg, $endpoint);
        $this->failUnlessProtocolError($result);
        $this->assertTrue($result->message == "verify failed");
    }

    function test_openid1UsePreDiscovered()
    {
        $endpoint = new Auth_OpenID_ServiceEndpoint();
        $endpoint->local_id = 'my identity';
        $endpoint->claimed_id = 'i am sam';
        $endpoint->server_url = 'Phone Home';
        $endpoint->type_uris = array(Auth_OpenID_TYPE_1_1);

        $msg = Auth_OpenID_Message::fromOpenIDArgs(
            array('ns' => Auth_OpenID_OPENID1_NS,
                  'identity' => $endpoint->local_id));
        $result = $this->consumer->_verifyDiscoveryResults($msg, $endpoint);
        $this->assertTrue($result == $endpoint);
    }

    function test_openid2Fragment()
    {
        $claimed_id = "http://unittest.invalid/";
        $claimed_id_frag = $claimed_id . "#fragment";

        $endpoint = new Auth_OpenID_ServiceEndpoint();
        $endpoint->local_id = 'my identity';
        $endpoint->claimed_id = $claimed_id;
        $endpoint->server_url = 'Phone Home';
        $endpoint->type_uris = array(Auth_OpenID_TYPE_2_0);

        $msg = Auth_OpenID_Message::fromOpenIDArgs(
                    array('ns' => Auth_OpenID_OPENID2_NS,
                          'identity' => $endpoint->local_id,
                          'claimed_id' => $claimed_id_frag,
                          'op_endpoint' => $endpoint->server_url));
        $result = $this->consumer->_verifyDiscoveryResults($msg, $endpoint);

        $this->assertEquals($result->local_id, $endpoint->local_id);
        $this->assertEquals($result->server_url, $endpoint->server_url);

        $this->assertEquals($result->type_uris, $endpoint->type_uris);

        $this->assertEquals($result->claimed_id, $claimed_id_frag);
    }

}

class Tests_openid1UsePreDiscoveredWrongType extends _DiscoverAndVerify {
    var $consumer_class = 'VerifyDisco_Consumer_verifiedError';

    function test_openid1UsePreDiscoveredWrongType()
    {
        $endpoint = new Auth_OpenID_ServiceEndpoint();
        $endpoint->local_id = 'my identity';
        $endpoint->claimed_id = 'i am sam';
        $endpoint->server_url = 'Phone Home';
        $endpoint->type_uris = array(Auth_OpenID_TYPE_2_0);

        $msg = Auth_OpenID_Message::fromOpenIDArgs(
            array('ns' => Auth_OpenID_OPENID1_NS,
                  'identity' => $endpoint->local_id));

        $result = $this->consumer->_verifyDiscoveryResults($msg, $endpoint);
        $this->failUnlessProtocolError($result);
        $this->assertTrue(is_a($result, '__VerifiedError'));
    }
}

// XXX: test the implementation of _discoverAndVerify

class Tests_openID2NoEndpointDoesDisco_sentinel extends Auth_OpenID_GenericConsumer {
    var $sentinel = 'blah';

    function _discoverAndVerify($to_match)
    {
        return $this->sentinel;
    }
}

class Tests_openID2NoEndpointDoesDisco_failure extends Auth_OpenID_GenericConsumer {
    var $failure_message = 'A fake failure response message';

    function _verifyDiscoverySingle($to_match)
    {
        return new Auth_OpenID_FailureResponse(null, $this->failure_message);
    }
}

class Tests_openID2NoEndpointDoesDisco extends Tests_Auth_OpenID_VerifyDisco {
    var $consumer_class = 'Tests_openID2NoEndpointDoesDisco_sentinel';

    function test_openID2NoEndpointDoesDisco()
    {
        $op_endpoint = 'Phone Home';
        $this->consumer->sentinel = new Auth_OpenID_ServiceEndpoint();
        $this->consumer->sentinel->claimed_id = 'monkeysoft';

        $msg = Auth_OpenID_Message::fromOpenIDArgs(
            array('ns' => Auth_OpenID_OPENID2_NS,
                  'identity' => 'sour grapes',
                  'claimed_id' => 'monkeysoft',
                  'op_endpoint' => $op_endpoint));

        $result = $this->consumer->_verifyDiscoveryResults($msg);
        $this->assertEquals($this->consumer->sentinel, $result);
    }
}

class Tests_openID2MismatchedDoesDisco extends Tests_Auth_OpenID_VerifyDisco {
    var $consumer_class = 'Tests_openID2NoEndpointDoesDisco_sentinel';

    function test_openID2MismatchedDoesDisco()
    {
        $mismatched = new Auth_OpenID_ServiceEndpoint();
        $mismatched->identity = 'nothing special, but different';
        $mismatched->local_id = 'green cheese';

        $sentinel = new Auth_OpenID_ServiceEndpoint();
        $sentinel->claimed_id = 'monkeysoft';
        $this->consumer->sentinel = $sentinel;

        $op_endpoint = 'Phone Home';

        $msg = Auth_OpenID_Message::fromOpenIDArgs(
            array('ns' => Auth_OpenID_OPENID2_NS,
                  'identity' => 'sour grapes',
                  'claimed_id' => 'monkeysoft',
                  'op_endpoint' => $op_endpoint));

        $result = $this->consumer->_verifyDiscoveryResults($msg, $mismatched);
        $this->assertEquals($this->consumer->sentinel, $result);
    }
}

class Tests_openID2MismatchedDoesDisco_failure extends PHPUnit_Framework_TestCase {
    var $consumer_class = 'Tests_openID2NoEndpointDoesDisco_failure';

    function setUp()
    {
        $this->store = new Tests_Auth_OpenID_MemStore();
        $cl = $this->consumer_class;
        $this->consumer = new $cl($this->store);
        $this->return_to = "http://some.host/path";
        $this->endpoint = new Auth_OpenID_ServiceEndpoint();

        $this->consumer->discoverMethod = array($this, "_getServices");

        $this->server_id = "sirod";
        $this->server_url = "serlie";
        $this->consumer_id = "consu";

        $this->endpoint->claimed_id = $this->consumer_id;
        $this->endpoint->server_url = $this->server_url;
        $this->endpoint->local_id = $this->server_id;
        $this->endpoint->type_uris = array(Auth_OpenID_TYPE_1_1);
    }

    function _getServices($claimed_id, $fetcher=null) {
        return array(null, array($this->endpoint));
    }

    function test_openID2MismatchedDoesDisco_failure()
    {
        $mismatched = new Auth_OpenID_ServiceEndpoint();
        $mismatched->identity = 'nothing special, but different';
        $mismatched->local_id = 'green cheese';

        $op_endpoint = 'Phone Home';

        $msg = Auth_OpenID_Message::fromOpenIDArgs(
            array('ns' => Auth_OpenID_OPENID2_NS,
                  'identity' => 'sour grapes',
                  'claimed_id' => 'monkeysoft',
                  'op_endpoint' => $op_endpoint));

        $result = $this->consumer->_verifyDiscoveryResults($msg, $mismatched);
        $this->assertTrue(Auth_OpenID::isFailure($result));
    }
}

class TestVerifyDiscoverySingle extends OpenIDTestMixin {
    var $consumer_class = 'Auth_OpenID_GenericConsumer';

    function setUp()
    {
        $this->store = new Tests_Auth_OpenID_MemStore();
        $cl = $this->consumer_class;
        $this->consumer = new $cl($this->store);
        $this->return_to = "http://some.host/path";
        $this->endpoint = new Auth_OpenID_ServiceEndpoint();

        $this->server_id = "sirod";
        $this->server_url = "serlie";
        $this->consumer_id = "consu";

        $this->endpoint->claimed_id = $this->consumer_id;
        $this->endpoint->server_url = $this->server_url;
        $this->endpoint->local_id = $this->server_id;
        $this->endpoint->type_uris = array(Auth_OpenID_TYPE_1_1);
    }

    function test_endpointWithoutLocalID()
    {
        // An endpoint like this with no local_id is generated as a
        // result of e.g. Yadis discovery with no LocalID tag.
        $endpoint = new Auth_OpenID_ServiceEndpoint();
        $endpoint->server_url = "http://localhost:8000/openidserver";
        $endpoint->claimed_id = "http://localhost:8000/id/id-jo";

        $to_match = new Auth_OpenID_ServiceEndpoint();
        $to_match->server_url = "http://localhost:8000/openidserver";
        $to_match->claimed_id = "http://localhost:8000/id/id-jo";
        $to_match->local_id = "http://localhost:8000/id/id-jo";

        $result = $this->consumer->_verifyDiscoverySingle($endpoint, $to_match);

        // result should always be None, raises exception on failure.
        $this->assertEquals($result, null);
    }
}

global $Tests_Auth_OpenID_VerifyDisco_other;
$Tests_Auth_OpenID_VerifyDisco_other = array(
                                             new Tests_openID2MismatchedDoesDisco(),
                                             new Tests_openID2NoEndpointDoesDisco(),
                                             new Tests_openID2MismatchedDoesDisco_failure(),
                                             new Tests_openid1UsePreDiscoveredWrongType(),
                                             new Tests_openID1Fallback1_0(),
                                             );

