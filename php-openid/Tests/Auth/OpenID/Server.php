<?php

/**
 * Tests for Auth_OpenID_Server
 */

require_once "Tests/Auth/OpenID/MemStore.php";
require_once "Auth/OpenID.php";
require_once "Auth/OpenID/DiffieHellman.php";
require_once "Auth/OpenID/Server.php";
require_once "Auth/OpenID/Consumer.php";

function altModulus()
{
    $lib = Auth_OpenID_getMathLib();
    static $num = null;

    if (!$num) {
        $num = $lib->init("1423261515703355186607439952816216983770".
                          "5735494988446894302176757360889904836136".
                          "0422513557553514790045512299468953431585".
                          "3008125488594198571710943663581589034331".
                          "6791551733211386105974742540867014420109".
                          "9811846875730766487278261498262568348338".
                          "4764372005569983660877797099908075182915".
                          "81860338635288400119293970087"
                          );
    }

    return $num;
}

global $ALT_GEN;
$ALT_GEN = 5;

function arrayToString($arr)
{
    $s = "Array(";

    $parts = array();
    foreach ($arr as $k => $v) {
        if (is_array($v)) {
            $v = arrayToString($v);
        }
        $parts[] = sprintf("%s => %s", $k, $v);
    }

    $s .= implode(", ", $parts);
    $s .= ")";

    return $s;
}

function _Auth_OpenID_NotAuthorized()
{
    return false;
}

class Tests_Auth_OpenID_Test_ServerError extends PHPUnit_Framework_TestCase {
    function test_browserWithReturnTo()
    {
        $return_to = "http://rp.unittest/consumer";
        // will be a ProtocolError raised by Decode or CheckIDRequest.answer
        $args = array(
            'openid.mode' => 'monkeydance',
            'openid.identity' => 'http://wagu.unittest/',
            'openid.return_to' => $return_to);

        $e = new Auth_OpenID_ServerError(
                   Auth_OpenID_Message::fromPostArgs($args),
                   "plucky");

        $this->assertTrue($e->hasReturnTo());
        $expected_args = array(
            'openid.mode' => 'error',
            'openid.error' => 'plucky');

        $encoded = $e->encodeToURL();
        if (Auth_OpenID_isError($encoded)) {
            $this->fail($encoded->toString());
            return;
        }

        list($rt_base, $_result_args) = explode("?", $e->encodeToURL(), 2);
        $result_args = Auth_OpenID::getQuery($_result_args);

        $this->assertEquals($result_args, $expected_args);
    }

    function test_browserWithReturnTo_OpenID2_GET()
    {
        $return_to = "http://rp.unittest/consumer";
        // will be a ProtocolError raised by Decode or
        // CheckIDRequest.answer
        $args = Auth_OpenID_Message::fromPostArgs(array(
            'openid.ns' => Auth_OpenID_OPENID2_NS,
            'openid.mode' => 'monkeydance',
            'openid.identity' => 'http://wagu.unittest/',
            'openid.claimed_id' => 'http://wagu.unittest/',
            'openid.return_to' => $return_to));

        $e = new Auth_OpenID_ServerError($args, "plucky");
        $this->assertTrue($e->hasReturnTo());
        $expected_args = array('openid.ns' => Auth_OpenID_OPENID2_NS,
                               'openid.mode' => 'error',
                               'openid.error' => 'plucky');

        list($rt_base, $result_args_s) = explode('?', $e->encodeToURL(), 2);
        $result_args = Auth_OpenID::parse_str($result_args_s);

        $this->assertEquals($result_args, $expected_args);
    }

    function test_browserWithReturnTo_OpenID2_POST()
    {
        $return_to = "http://rp.unittest/consumer" . str_repeat('x', Auth_OpenID_OPENID1_URL_LIMIT);
        // will be a ProtocolError raised by Decode or
        // CheckIDRequest.answer
        $args = Auth_OpenID_Message::fromPostArgs(array(
            'openid.ns' => Auth_OpenID_OPENID2_NS,
            'openid.mode' => 'monkeydance',
            'openid.identity' => 'http://wagu.unittest/',
            'openid.claimed_id' => 'http://wagu.unittest/',
            'openid.return_to' => $return_to));

        $e = new Auth_OpenID_ServerError($args, "plucky");
        $this->assertTrue($e->hasReturnTo());
        $expected_args = array('openid.ns' => Auth_OpenID_OPENID2_NS,
                               'openid.mode' => 'error',
                               'openid.error' => 'plucky');

        $this->assertTrue($e->whichEncoding() == Auth_OpenID_ENCODE_HTML_FORM);

        $msg = $e->toMessage();

        $this->assertTrue($e->toFormMarkup() ==
                          $msg->toFormMarkup($args->getArg(Auth_OpenID_OPENID_NS, 'return_to')));
    }

    function test_browserWithReturnTo_OpenID1_exceeds_limit()
    {
        $return_to = "http://rp.unittest/consumer" . str_repeat('x', Auth_OpenID_OPENID1_URL_LIMIT);
        // will be a ProtocolError raised by Decode or
        // CheckIDRequest.answer
        $args = Auth_OpenID_Message::fromPostArgs(array(
            'openid.mode' => 'monkeydance',
            'openid.identity' => 'http://wagu.unittest/',
            'openid.return_to' => $return_to));

        $this->assertTrue($args->isOpenID1());

        $e = new Auth_OpenID_ServerError($args, "plucky");
        $this->assertTrue($e->hasReturnTo());
        $expected_args = array('openid.mode' => 'error',
                               'openid.error' => 'plucky');

        $this->assertTrue($e->whichEncoding() == Auth_OpenID_ENCODE_URL);

        list($rt_base, $result_args_s) = explode('?', $e->encodeToURL(), 2);
        $result_args = Auth_OpenID::parse_str($result_args_s);
        $this->assertEquals($result_args, $expected_args);
    }

    function test_noReturnTo()
    {
        // will be a ProtocolError raised by Decode or CheckIDRequest.answer
        $args = array(
            'openid.mode' => 'zebradance',
            'openid.identity' => 'http://wagu.unittest/');

        $e = new Auth_OpenID_ServerError(
                   Auth_OpenID_Message::fromPostArgs($args),
                   "waffles");

        $this->assertFalse($e->hasReturnTo());
        $expected = "error:waffles\nmode:error\n";
        $this->assertEquals($e->encodeToKVForm(), $expected);
    }

    function test_noMessage()
    {
        $e = new Auth_OpenID_ServerError();
        $this->assertFalse($e->hasReturnTo());
        $this->assertEquals($e->whichEncoding(), null);
        $this->assertEquals($e->getReturnTo(), null);
    }
}

class Tests_Auth_OpenID_Test_Decode extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->id_url = "http://decoder.am.unittest/";
        $this->rt_url = "http://rp.unittest/foobot/?qux=zam";
        $this->tr_url = "http://rp.unittest/";
        $this->assoc_handle = "{assoc}{handle}";

        $this->claimed_id = 'http://de.legating.de.coder.unittest/';
        $this->op_endpoint = 'http://endpoint.unittest/encode';

        $this->store = new Tests_Auth_OpenID_MemStore();
        $this->server = new Auth_OpenID_Server($this->store,
                                               $this->op_endpoint);
        $this->decoder = new Auth_OpenID_Decoder($this->server);
    }

    function test_none()
    {
        $args = array();
        $r = $this->decoder->decode($args);
        $this->assertEquals($r, null);
    }

    function test_irrelevant()
    {
        $args = array(
            'pony' => 'spotted',
            'sreg.mutant_power' => 'decaffinator');

        $r = $this->decoder->decode($args);

        $this->assertTrue(is_a($r, 'Auth_OpenID_ServerError'));
    }

    function test_bad()
    {
        $args = array(
            'openid.mode' => 'twos-compliment',
            'openid.pants' => 'zippered');

        // Be sure that decoding the args returns an error.
        $result = $this->decoder->decode($args);

        $this->assertTrue(Auth_OpenID_isError($result));
    }

    function test_checkidImmediate()
    {
        $args = array(
            'openid.mode' => 'checkid_immediate',
            'openid.identity' => $this->id_url,
            'openid.assoc_handle' => $this->assoc_handle,
            'openid.return_to' => $this->rt_url,
            'openid.trust_root' => $this->tr_url,
            # should be ignored
            'openid.some.extension' => 'junk');

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_CheckIDRequest'));
        $this->assertEquals($r->mode, "checkid_immediate");
        $this->assertEquals($r->immediate, true);
        $this->assertEquals($r->identity, $this->id_url);
        $this->assertEquals($r->trust_root, $this->tr_url);
        $this->assertEquals($r->return_to, $this->rt_url);
        $this->assertEquals($r->assoc_handle, $this->assoc_handle);
    }

    function test_checkidSetup()
    {
        $args = array(
            'openid.mode' => 'checkid_setup',
            'openid.identity' => $this->id_url,
            'openid.assoc_handle' => $this->assoc_handle,
            'openid.return_to' => $this->rt_url,
            'openid.trust_root' => $this->tr_url);

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_CheckIDRequest'));
        $this->assertEquals($r->mode, "checkid_setup");
        $this->assertEquals($r->immediate, false);
        $this->assertEquals($r->identity, $this->id_url);
        $this->assertEquals($r->trust_root, $this->tr_url);
        $this->assertEquals($r->return_to, $this->rt_url);
    }

    function test_checkidSetupOpenID2()
    {
        $args = array(
            'openid.ns' => Auth_OpenID_OPENID2_NS,
            'openid.mode' => 'checkid_setup',
            'openid.identity' => $this->id_url,
            'openid.claimed_id' => $this->claimed_id,
            'openid.assoc_handle' => $this->assoc_handle,
            'openid.return_to' => $this->rt_url,
            'openid.realm' => $this->tr_url
            );

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_CheckIDRequest'));
        $this->assertEquals($r->mode, "checkid_setup");
        $this->assertEquals($r->immediate, False);
        $this->assertEquals($r->identity, $this->id_url);
        $this->assertEquals($r->claimed_id, $this->claimed_id);
        $this->assertEquals($r->trust_root, $this->tr_url);
        $this->assertEquals($r->return_to, $this->rt_url);
    }

    function test_checkidSetupNoClaimedIDOpenID2()
    {
        $args = array(
            'openid.ns' => Auth_OpenID_OPENID2_NS,
            'openid.mode' => 'checkid_setup',
            'openid.identity' => $this->id_url,
            'openid.assoc_handle' => $this->assoc_handle,
            'openid.return_to' => $this->rt_url,
            'openid.realm' => $this->tr_url
            );

        $result = $this->decoder->decode($args);
        $this->assertTrue(is_a($result, "Auth_OpenID_ServerError"));
    }

    function test_checkidSetupNoIdentityOpenID2()
    {
        $args = array(
            'openid.ns' => Auth_OpenID_OPENID2_NS,
            'openid.mode' => 'checkid_setup',
            'openid.assoc_handle' => $this->assoc_handle,
            'openid.return_to' => $this->rt_url,
            'openid.realm' => $this->tr_url);

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_CheckIDRequest'));
        $this->assertEquals($r->mode, "checkid_setup");
        $this->assertEquals($r->immediate, false);
        $this->assertEquals($r->identity, null);
        $this->assertEquals($r->trust_root, $this->tr_url);
        $this->assertEquals($r->return_to, $this->rt_url);
    }

    function test_checkidSetupNoReturnOpenID1()
    {
        $args = array(
            'openid.mode' => 'checkid_setup',
            'openid.identity' => $this->id_url,
            'openid.assoc_handle' => $this->assoc_handle,
            'openid.trust_root' => $this->tr_url);

        $result = $this->decoder->decode($args);
        if (!Auth_OpenID_isError($result)) {
            $this->fail("Expected Auth_OpenID_ServerError");
        }
    }

    function test_checkidSetupNoReturnOpenID2()
    {
        // Make sure an OpenID 2 request with no return_to can be
        // decoded, and make sure a response to such a request raises
        // NoReturnToError.
        $args = array(
            'openid.ns' => Auth_OpenID_OPENID2_NS,
            'openid.mode' => 'checkid_setup',
            'openid.identity' => $this->id_url,
            'openid.claimed_id' => $this->id_url,
            'openid.assoc_handle' => $this->assoc_handle,
            'openid.realm' => $this->tr_url);

        $req = $this->decoder->decode($args);

        $this->assertTrue(is_a($req,
                               'Auth_OpenID_CheckIDRequest'));

        $this->assertTrue(is_a($req->answer(false), 'Auth_OpenID_NoReturnToError'));
        $this->assertTrue(is_a($req->encodeToURL('bogus'), 'Auth_OpenID_NoReturnToError'));
        $this->assertTrue(is_a($req->getCancelURL(), 'Auth_OpenID_NoReturnToError'));
    }

    function test_checkidSetupRealmRequiredOpenID2()
    {
        // Make sure that an OpenID 2 request which lacks return_to
        // cannot be decoded if it lacks a realm.  Spec: This value
        // (openid.realm) MUST be sent if openid.return_to is omitted.

        $args = array(
            'openid.ns' => Auth_OpenID_OPENID2_NS,
            'openid.mode' => 'checkid_setup',
            'openid.identity' => $this->id_url,
            'openid.assoc_handle' => $this->assoc_handle);

        $this->assertTrue(is_a($this->decoder->decode($args),
                               'Auth_OpenID_ServerError'));
    }

    function test_checkidSetupBadReturn()
    {
        $args = array(
            'openid.mode' => 'checkid_setup',
            'openid.identity' => $this->id_url,
            'openid.assoc_handle' => $this->assoc_handle,
            'openid.return_to' => 'not a url');

        $result = $this->decoder->decode($args);;
        if (Auth_OpenID_isError($result)) {
            $this->assertTrue($result->message);
        } else {
            $this->fail(sprintf("Expected ProtocolError, instead " .
                                "returned with %s", gettype($result)));
        }
    }

    function test_checkidSetupUntrustedReturn()
    {
        $args = array(
            'openid.mode' => 'checkid_setup',
            'openid.identity' => $this->id_url,
            'openid.assoc_handle' => $this->assoc_handle,
            'openid.return_to' => $this->rt_url,
            'openid.trust_root' => 'http://not-the-return-place.unittest/');

        $result = $this->decoder->decode($args);
        $this->assertTrue(is_a($result, 'Auth_OpenID_UntrustedReturnURL'));
    }

    function test_checkAuth()
    {
        $args = array(
            'openid.mode' => 'check_authentication',
            'openid.assoc_handle' => '{dumb}{handle}',
            'openid.sig' => 'sigblob',
            'openid.signed' => 'foo,bar,mode',
            'openid.foo' => 'signedval1',
            'openid.bar' => 'signedval2',
            'openid.baz' => 'unsigned');

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_CheckAuthRequest'));
        $this->assertEquals($r->mode, 'check_authentication');
        $this->assertEquals($r->sig, 'sigblob');
    }

    function test_checkAuthMissingSignature()
    {
        $args = array(
            'openid.mode' => 'check_authentication',
            'openid.assoc_handle' => '{dumb}{handle}',
            'openid.signed' => 'foo,bar,mode',
            'openid.foo' => 'signedval1',
            'openid.bar' => 'signedval2',
            'openid.baz' => 'unsigned');

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_ServerError'));
    }

    function test_checkAuthAndInvalidate()
    {
        $args = array(
            'openid.mode' => 'check_authentication',
            'openid.assoc_handle' => '{dumb}{handle}',
            'openid.invalidate_handle' => '[[SMART_handle]]',
            'openid.sig' => 'sigblob',
            'openid.signed' => 'foo,bar,mode',
            'openid.foo' => 'signedval1',
            'openid.bar' => 'signedval2',
            'openid.baz' => 'unsigned');

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_CheckAuthRequest'));
        $this->assertEquals($r->invalidate_handle, '[[SMART_handle]]');
    }

    function test_associateDH()
    {
        if (defined('Auth_OpenID_NO_MATH_SUPPORT')) {
            print "(Skipping test_associateDH)";
            return;
        }
        $args = array(
                      'openid.mode' => 'associate',
                      'openid.session_type' => 'DH-SHA1',
                      'openid.dh_consumer_public' => "Rzup9265tw==");

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_AssociateRequest'));
        $this->assertEquals($r->mode, "associate");
        $this->assertEquals($r->session->session_type, "DH-SHA1");
        $this->assertEquals($r->assoc_type, "HMAC-SHA1");
        $this->assertTrue($r->session->consumer_pubkey);
    }

    function test_associateDHMissingKey()
    {
        if (defined('Auth_OpenID_NO_MATH_SUPPORT')) {
            print "(Skipping test_associateDHMissingKey)";
            return;
        }
        $args = array(
            'openid.mode' => 'associate',
            'openid.session_type' => 'DH-SHA1');

        // Using DH-SHA1 without supplying dh_consumer_public is an error.
        $result = $this->decoder->decode($args);
        if (!Auth_OpenID_isError($result)) {
            $this->fail(sprintf("Expected Auth_OpenID_ServerError, got %s",
                                gettype($result)));
        }
    }

    /**
     * XXX: Cannot produce a value to break base64_decode
    function test_associateDHpubKeyNotB64()
    {
        $args = array(
            'openid.mode' => 'associate',
            'openid.session_type' => 'DH-SHA1',
            'openid.dh_consumer_public' => "donkeydonkeydonkey");

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_ServerError'));
    }
    */

    function test_associateDHModGen()
    {
        if (defined('Auth_OpenID_NO_MATH_SUPPORT')) {
            print "(Skipping test_associateDHModGen)";
            return;
        }

        global $ALT_GEN;

        // test dh with non-default but valid values for dh_modulus
        // and dh_gen
        $lib = Auth_OpenID_getMathLib();

        $args = array(
            'openid.mode' => 'associate',
            'openid.session_type' => 'DH-SHA1',
            'openid.dh_consumer_public' => "Rzup9265tw==",
            'openid.dh_modulus' => $lib->longToBase64(altModulus()),
            'openid.dh_gen' => $lib->longToBase64($ALT_GEN));

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_AssociateRequest'));
        $this->assertEquals($r->mode, "associate");
        $this->assertEquals($r->session->session_type, "DH-SHA1");
        $this->assertEquals($r->assoc_type, "HMAC-SHA1");
        $this->assertTrue($lib->cmp($r->session->dh->mod, altModulus()) === 0);
        $this->assertTrue($lib->cmp($r->session->dh->gen, $ALT_GEN) === 0);
        $this->assertTrue($r->session->consumer_pubkey);
    }

    /**
     * XXX: Can't test invalid base64 values for mod and gen because
     * PHP's base64 decoder is much too forgiving or just plain
     * broken.
    function test_associateDHCorruptModGen()
    {
        // test dh with non-default but valid values for dh_modulus
        // and dh_gen
        $args = array(
            'openid.mode' => 'associate',
            'openid.session_type' => 'DH-SHA1',
            'openid.dh_consumer_public' => "Rzup9265tw==",
            'openid.dh_modulus' => 'pizza',
            'openid.dh_gen' => 'gnocchi');

        $r = $this->decoder->decode($args);
        print_r($r);

        $this->assertTrue(is_a($r, 'Auth_OpenID_ServerError'));
    }
    */

    function test_associateDHMissingModGen()
    {
        if (defined('Auth_OpenID_NO_MATH_SUPPORT')) {
            print "(Skipping test_associateDHMissingModGen)";
            return;
        }

        // test dh with non-default but valid values for dh_modulus
        // and dh_gen
        $args = array(
            'openid.mode' => 'associate',
            'openid.session_type' => 'DH-SHA1',
            'openid.dh_consumer_public' => "Rzup9265tw==",
            'openid.dh_modulus' => 'pizza');

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_ServerError'));
    }

    function test_associateWeirdSession()
    {
        $args = array(
            'openid.mode' => 'associate',
            'openid.session_type' => 'FLCL6',
            'openid.dh_consumer_public' => "YQ==\n");

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_ServerError'));
    }

    function test_associatePlain()
    {
        $args = array('openid.mode' => 'associate');

        $r = $this->decoder->decode($args);
        $this->assertTrue(is_a($r, 'Auth_OpenID_AssociateRequest'));
        $this->assertEquals($r->mode, "associate");
        $this->assertEquals($r->session->session_type, "no-encryption");
        $this->assertEquals($r->assoc_type, "HMAC-SHA1");
    }

    function test_nomode()
    {
        $args = array(
            'openid.session_type' => 'DH-SHA1',
            'openid.dh_consumer_public' => "my public keeey");

        $result = $this->decoder->decode($args);
        if (!Auth_OpenID_isError($result)) {
            $this->fail(sprintf("Expected Auth_OpenID_Error. Got %s",
                                gettype($result)));
        }
    }

    function test_invalidns()
    {
        $args = array('openid.ns' => 'Tuesday',
                      'openid.mode' => 'associate');

        $result = $this->decoder->decode($args);

        $this->assertTrue(is_a($result, 'Auth_OpenID_ServerError'));

        // Assert that the ProtocolError does have a Message attached
        // to it, even though the request wasn't a well-formed Message.
        $this->assertTrue($result->message);

        // The error message contains the bad openid.ns.
        $this->assertTrue(strpos($result->text, 'Tuesday') != -1);
    }
}

class Tests_Auth_OpenID_Test_Encode extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->encoder = new Auth_OpenID_Encoder();
        $this->encode = $this->encoder;
        $this->op_endpoint = 'http://endpoint.unittest/encode';
        $this->store = new Tests_Auth_OpenID_MemStore();
        $this->server = new Auth_OpenID_Server($this->store,
                                               $this->op_endpoint);
    }

    function encode($thing) {
        return $this->encoder->encode($thing);
    }

    function test_id_res_OpenID2_GET()
    {
        /* Check that when an OpenID 2 response does not exceed the
         OpenID 1 message size, a GET response (i.e., redirect) is
         issued. */
        $request = new Auth_OpenID_CheckIDRequest(
            'http://bombom.unittest/',
            'http://burr.unittest/999',
            'http://burr.unittest/',
            false,
            $this->server->op_endpoint);

        $response = new Auth_OpenID_ServerResponse($request);
        $response->fields = Auth_OpenID_Message::fromOpenIDArgs(array(
            'ns' => Auth_OpenID_OPENID2_NS,
            'mode' => 'id_res',
            'identity' => $request->identity,
            'claimed_id' => $request->identity,
            'return_to' => $request->return_to));

        $this->assertFalse($response->renderAsForm());
        $this->assertTrue($response->whichEncoding() == Auth_OpenID_ENCODE_URL);
        $webresponse = $this->encode($response);
        $this->assertTrue(array_key_exists('location', $webresponse->headers));
    }

    function test_id_res_OpenID2_POST()
    {
        /* Check that when an OpenID 2 response exceeds the OpenID 1
         message size, a POST response (i.e., an HTML form) is
         returned. */
        $request = new Auth_OpenID_CheckIDRequest(
            'http://bombom.unittest/',
            'http://burr.unittest/999',
            'http://burr.unittest/',
            false,
            $this->server->op_endpoint);

        $response = new Auth_OpenID_ServerResponse($request);
        $response->fields = Auth_OpenID_Message::fromOpenIDArgs(array(
            'ns' => Auth_OpenID_OPENID2_NS,
            'mode' => 'id_res',
            'identity' => $request->identity,
            'claimed_id' => $request->identity,
            'return_to' => str_repeat('x', Auth_OpenID_OPENID1_URL_LIMIT)));

        $this->assertTrue($response->renderAsForm());
        $this->assertTrue(strlen($response->encodeToURL()) > Auth_OpenID_OPENID1_URL_LIMIT);
        $this->assertTrue($response->whichEncoding() == Auth_OpenID_ENCODE_HTML_FORM);
        $webresponse = $this->encode($response);
        $this->assertEquals($webresponse->body, $response->toFormMarkup());
    }

    function test_id_res_OpenID1_exceeds_limit()
    {
        /* Check that when an OpenID 1 response exceeds the OpenID 1
        message size, a GET response is issued.  Technically, this
        shouldn't be permitted by the library, but this test is in
        place to preserve the status quo for OpenID 1. */
        $request = new Auth_OpenID_CheckIDRequest(
            'http://bombom.unittest/',
            'http://burr.unittest/999',
            'http://burr.unittest/',
            false,
            $this->server->op_endpoint);

        $response = new Auth_OpenID_ServerResponse($request);
        $response->fields = Auth_OpenID_Message::fromOpenIDArgs(array(
            'mode' => 'id_res',
            'identity' => $request->identity,
            'return_to' => str_repeat('x', Auth_OpenID_OPENID1_URL_LIMIT)));

        $this->assertFalse($response->renderAsForm());
        $this->assertTrue(strlen($response->encodeToURL()) > Auth_OpenID_OPENID1_URL_LIMIT);
        $this->assertTrue($response->whichEncoding() == Auth_OpenID_ENCODE_URL);
        $webresponse = $this->encode($response);
        $this->assertEquals($webresponse->headers['location'], $response->encodeToURL());
    }

    function test_id_res()
    {
        $request = new Auth_OpenID_CheckIDRequest(
            'http://bombom.unittest/',
            'http://burr.unittest/',
            'http://burr.unittest/999',
            false,
            $this->server);

        $response = new Auth_OpenID_ServerResponse($request);
        $response->fields = Auth_OpenID_Message::fromOpenIDArgs(
               array(
                     'mode' => 'id_res',
                     'identity' => $request->identity,
                     'return_to' => $request->return_to));

        $webresponse = $this->encoder->encode($response);
        $this->assertEquals($webresponse->code, AUTH_OPENID_HTTP_REDIRECT);
        $this->assertTrue(array_key_exists('location',
                                           $webresponse->headers));

        $location = $webresponse->headers['location'];
        $this->assertTrue(strpos($location, $request->return_to) === 0);
        //                        "%s does not start with %s" % ($location,
        //                                             $request->return_to));

        $parsed = parse_url($location);
        $query = array();
        $query = Auth_OpenID::parse_str($parsed['query']);

        $expected = $response->fields->toPostArgs();
        $this->assertEquals($query, $expected);
    }

    function test_cancel()
    {
        $request = new Auth_OpenID_CheckIDRequest(
            'http://bombom.unittest/',
            'http://burr.unittest/',
            'http://burr.unittest/999',
            false, null,
            $this->server);

        $response = new Auth_OpenID_ServerResponse($request);
        $response->fields = Auth_OpenID_Message::fromOpenIDArgs(array('mode' => 'cancel'));

        $webresponse = $this->encoder->encode($response);
        $this->assertEquals($webresponse->code, AUTH_OPENID_HTTP_REDIRECT);
        $this->assertTrue(array_key_exists('location', $webresponse->headers));
    }

    function test_cancelToForm()
    {
        $request = new Auth_OpenID_CheckIDRequest(
            'http://bombom.unittest/',
            'http://burr.unittest/999',
            'http://burr.unittest/',
            false, null,
            $this->server);

        $response = new Auth_OpenID_ServerResponse($request);
        $response->fields = Auth_OpenID_Message::fromOpenIDArgs(array('mode' => 'cancel'));

        $form = $response->toFormMarkup();
        $pos = strpos($form, 'http://burr.unittest/999');
        $this->assertTrue($pos !== false, var_export($pos, true));
    }

    function test_assocReply()
    {
        if (!defined('Auth_OpenID_NO_MATH_SUPPORT')) {
            $message = new Auth_OpenID_Message(Auth_OpenID_OPENID2_NS);
            $message->setArg(Auth_OpenID_OPENID2_NS, 'session_type',
                             'no-encryption');
            $request = Auth_OpenID_AssociateRequest::fromMessage($message,
                                                                 $this->server);
            $response = new Auth_OpenID_ServerResponse($request);
            $response->fields = Auth_OpenID_Message::fromOpenIDArgs(
                              array('assoc_handle' => "every-zig"));
            $webresponse = $this->encoder->encode($response);
            $body = "assoc_handle:every-zig\n";
            $this->assertEquals($webresponse->code, AUTH_OPENID_HTTP_OK);
            $this->assertEquals($webresponse->headers, array());
            $this->assertEquals($webresponse->body, $body);
        }
    }

    function test_checkauthReply()
    {
        $request = new Auth_OpenID_CheckAuthRequest('a_sock_monkey',
                                                    'siggggg',
                                                    array());
        $response = new Auth_OpenID_ServerResponse($request);
        $response->fields = Auth_OpenID_Message::fromOpenIDArgs(array(
            'is_valid' => 'true',
            'invalidate_handle' => 'xXxX:xXXx'));

        $body = "invalidate_handle:xXxX:xXXx\nis_valid:true\n";
        $webresponse = $this->encoder->encode($response);
        $this->assertEquals($webresponse->code, AUTH_OPENID_HTTP_OK);
        $this->assertEquals($webresponse->headers, array());
        $this->assertEquals($webresponse->body, $body);
    }

    function test_unencodableError()
    {
        $args = array('openid.identity' => 'http://limu.unittest/');

        $e = new Auth_OpenID_ServerError(Auth_OpenID_Message::fromPostArgs($args),
                                         "wet paint");

        $result = $this->encoder->encode($e);
        if (!Auth_OpenID_isError($result, 'Auth_OpenID_EncodingError')) {
            $this->fail(sprintf("Expected Auth_OpenID_ServerError, got %s",
                                gettype($result)));
        }
    }

    function test_encodableError()
    {
        $args = array(
            'openid.mode' => 'associate',
            'openid.identity' => 'http://limu.unittest/');

        $body="error:snoot\nmode:error\n";
        $err = new Auth_OpenID_ServerError(Auth_OpenID_Message::fromPostArgs($args),
                                           "snoot");

        $webresponse = $this->encoder->encode($err);
        $this->assertEquals($webresponse->code, AUTH_OPENID_HTTP_ERROR);
        $this->assertEquals($webresponse->headers, array());
        $this->assertEquals($webresponse->body, $body);
    }
}

class Tests_Auth_OpenID_SigningEncode extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        // Use filestore here instead of memstore
        $this->store = new Tests_Auth_OpenID_MemStore();

        $this->op_endpoint = 'http://endpoint.unittest/encode';

        $this->server = new Auth_OpenID_Server($this->store,
                                               $this->op_endpoint);

        $this->request = new Auth_OpenID_CheckIDRequest(
            'http://bombom.unittest/',
            'http://burr.unittest/',
            'http://burr.unittest/999',
            false,
            null,
            $this->server);

        $this->response = new Auth_OpenID_ServerResponse($this->request);
        $this->response->fields = Auth_OpenID_Message::fromOpenIDArgs(array(
            'mode' => 'id_res',
            'identity' => $this->request->identity,
            'return_to' => $this->request->return_to));

        $this->signatory = new Auth_OpenID_Signatory($this->store);
        $this->dumb_key = $this->signatory->dumb_key;
        $this->normal_key = $this->signatory->normal_key;

        $this->encoder = new Auth_OpenID_SigningEncoder($this->signatory);
    }

    function test_idres()
    {
        $assoc_handle = '{bicycle}{shed}';
        $assoc = Auth_OpenID_Association::fromExpiresIn(60, $assoc_handle,
                                                        'sekrit', 'HMAC-SHA1');
        $this->store->storeAssociation($this->normal_key, $assoc);
        $this->request->assoc_handle = $assoc_handle;
        $webresponse = $this->encoder->encode($this->response);
        $this->assertEquals($webresponse->code, AUTH_OPENID_HTTP_REDIRECT);
        $this->assertTrue(array_key_exists('location',
                                           $webresponse->headers));

        $location = $webresponse->headers['location'];
        $parsed = parse_url($location);
        $query = Auth_OpenID::getQuery($parsed['query']);

        $this->assertTrue(array_key_exists('openid.sig', $query));
        $this->assertTrue(array_key_exists('openid.assoc_handle', $query));
        $this->assertTrue(array_key_exists('openid.signed', $query));
    }

    function test_idresDumb()
    {
        $webresponse = $this->encoder->encode($this->response);
        $this->assertEquals($webresponse->code, AUTH_OPENID_HTTP_REDIRECT);
        $this->assertTrue(array_key_exists('location', $webresponse->headers));

        $location = $webresponse->headers['location'];
        $parsed = parse_url($location);
        $query = Auth_OpenID::getQuery($parsed['query']);

        $this->assertTrue(array_key_exists('openid.sig', $query));
        $this->assertTrue(array_key_exists('openid.assoc_handle', $query));
        $this->assertTrue(array_key_exists('openid.signed', $query));
    }

    function test_forgotStore()
    {
        $this->encoder->signatory = null;
        $result = $this->encoder->encode($this->response);
        if (!is_a($result, 'Auth_OpenID_ServerError')) {
            $this->fail(sprintf("Expected Auth_OpenID_ServerError, got %s",
                                gettype($result)));
        }
    }

    function test_cancel()
    {
        $request = new Auth_OpenID_CheckIDRequest(
            'http://bombom.unittest/',
            'http://burr.unittest/',
            'http://burr.unittest/999',
            false,
            null,
            $this->server);

        $response = new Auth_OpenID_ServerResponse($request, 'cancel');
        $webresponse = $this->encoder->encode($response);
        $this->assertEquals($webresponse->code, AUTH_OPENID_HTTP_REDIRECT);
        $this->assertTrue(array_key_exists('location', $webresponse->headers));
        $location = $webresponse->headers['location'];
        $parsed = parse_url($location);
        $query = Auth_OpenID::getQuery($parsed['query']);

        $this->assertFalse(array_key_exists('openid.sig', $query));
    }

    function test_assocReply()
    {
        if (!defined('Auth_OpenID_NO_MATH_SUPPORT')) {
            $message = new Auth_OpenID_Message(Auth_OpenID_OPENID1_NS);
            $request = Auth_OpenID_AssociateRequest::fromMessage($message,
                                                                 $this->server);
            $response = new Auth_OpenID_ServerResponse($request);
            $response->fields = Auth_OpenID_Message::fromOpenIDArgs(
                  array('assoc_handle' => "every-zig"));
            $webresponse = $this->encoder->encode($response);
            $body = "assoc_handle:every-zig\n";

            $this->assertEquals($webresponse->code, AUTH_OPENID_HTTP_OK);
            $this->assertEquals($webresponse->headers, array());
            $this->assertEquals($webresponse->body, $body);
        }
    }

    function test_alreadySigned()
    {
        $this->response->fields->setArg(Auth_OpenID_OPENID_NS, 'sig', 'priorSig==');
        $result = $this->encoder->encode($this->response);
        if (!is_a($result, 'Auth_OpenID_AlreadySigned')) {
            $this->fail(sprintf("Expected Auth_OpenID_AlreadySigned " .
                                "instance, got %s", gettype($result)));
        }
    }
}

class Tests_Auth_OpenID_CheckID extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->store = new Tests_Auth_OpenID_MemStore();

        $this->op_endpoint = 'http://endpoint.unittest/encode';

        $this->server = new Auth_OpenID_Server($this->store,
                                               $this->op_endpoint);

        $this->request = new Auth_OpenID_CheckIDRequest(
            'http://bambam.unittest/',
            'http://bar.unittest/999',
            'http://bar.unittest/',
            false, null,
            $this->server);

        $this->request->message = new Auth_OpenID_Message(
            Auth_OpenID_OPENID2_NS);
    }

    function test_fromMessageClaimedIDWithoutIdentityOpenID2()
    {
        $name = 'https://example.myopenid.com';

        $msg = new Auth_OpenID_Message(Auth_OpenID_OPENID2_NS);
        $msg->setArg(Auth_OpenID_OPENID_NS, 'mode', 'checkid_setup');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'return_to',
                     'http://invalid:8000/rt');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'claimed_id', $name);

        $result = Auth_OpenID_CheckIDRequest::fromMessage(
                       $msg, $this->server);

        $this->assertTrue(is_a($result, 'Auth_OpenID_ServerError'));
    }

    function test_fromMessageIdentityWithoutClaimedIDOpenID2()
    {
        $name = 'https://example.myopenid.com';

        $msg = new Auth_OpenID_Message(Auth_OpenID_OPENID2_NS);
        $msg->setArg(Auth_OpenID_OPENID_NS, 'mode', 'checkid_setup');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'return_to',
                     'http://invalid:8000/rt');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'identity', $name);

        $result = Auth_OpenID_CheckIDRequest::fromMessage(
                       $msg, $this->server);

        $this->assertTrue(is_a($result, 'Auth_OpenID_ServerError'));
    }

    function test_fromMessageWithEmptyTrustRoot()
    {
        $return_to = 'http://does.not.matter/';
        $msg = Auth_OpenID_Message::fromPostArgs(array(
                 'openid.assoc_handle' => '{blah}{blah}{OZivdQ==}',
                 'openid.claimed_id' => 'http://delegated.invalid/',
                 'openid.identity' => 'http://op-local.example.com/',
                 'openid.mode' => 'checkid_setup',
                 'openid.ns' => 'http://openid.net/signon/1.0',
                 'openid.return_to' => $return_to,
                 'openid.trust_root' => ''
              ));
        $result = Auth_OpenID_CheckIDRequest::fromMessage(
                       $msg, $this->server);
        $this->assertEquals($return_to, $result->trust_root);
    }

    function test_trustRootInvalid()
    {
        $this->request->trust_root = "http://foo.unittest/17";
        $this->request->return_to = "http://foo.unittest/39";
        $this->assertFalse($this->request->trustRootValid());
    }

    function test_trustRootValid()
    {
        $this->request->trust_root = "http://foo.unittest/";
        $this->request->return_to = "http://foo.unittest/39";
        $this->assertTrue($this->request->trustRootValid());
    }

    function test_malformedTrustRoot()
    {
        $this->request->trust_root = "invalid://trust*root/";
        $this->request->return_to = "http://foo.unittest/39";
        $sentinel = 'Sentinel';
        $this->request->message = $sentinel;

        $result = $this->request->trustRootValid();
        $this->assertTrue(Auth_OpenID_isError($result));
        $this->assertEquals($result->message, $sentinel);
    }

    function _verify($trust_root, $return_to, $value)
    {
        $this->assertEquals($this->request->trust_root, $trust_root);
        $this->assertEquals($this->request->return_to, $return_to);
        return $value;
    }

    function _verifyTrue($trust_root, $return_to)
    {
        return $this->_verify($trust_root, $return_to, true);
    }

    function _verifyFalse($trust_root, $return_to)
    {
        return $this->_verify($trust_root, $return_to, false);
    }

    /*
     * Make sure that verifyReturnTo is calling
     * Auth_OpenID_verifyReturnTo
     */
    function test_returnToVerified_callsVerify()
    {
        // Ensure that True and False are passed through unchanged
        $this->request->verifyReturnTo = array($this, '_verifyTrue');
        $this->assertEquals(true, $this->request->returnToVerified());

        $this->request->verifyReturnTo = array($this, '_verifyFalse');
        $this->assertEquals(false, $this->request->returnToVerified());
    }

    function test_answerToInvalidRoot()
    {
        $this->request->trust_root = "http://foo.unittest/17";
        $this->request->return_to = "http://foo.unittest/39";
        $result = $this->request->answer(true);
        if (!is_a($result, 'Auth_OpenID_UntrustedReturnURL')) {
            $this->fail(sprintf("Expected Auth_OpenID_UntrustedReturnURL, " .
                                "got %s", gettype($result)));
        }
        $this->assertTrue($this->request->answer(false));
    }

    function _expectAnswer($answer, $identity=null, $claimed_id=null)
    {
        if (is_a($answer, 'Auth_OpenID_ServerError')) {
            $this->fail("Got ServerError, expected valid response in ".$this->getName());
            return;
        }

        $expected_list = array(
                               array('mode', 'id_res'),
                               array('return_to', $this->request->return_to),
                               array('op_endpoint', $this->op_endpoint));

        if ($identity) {
            $expected_list[] = array('identity', $identity);

            if ($claimed_id) {
                $expected_list[] = array('claimed_id', $claimed_id);
            } else {
                $expected_list[] = array('claimed_id', $identity);
            }
        }

        foreach ($expected_list as $pair) {
            list($k, $expected) = $pair;
            $actual = $answer->fields->getArg(Auth_OpenID_OPENID_NS, $k);
            $this->assertEquals($expected, $actual,
				"Got wrong value for field '".$k."'");
        }

        $this->assertTrue($answer->fields->hasKey(Auth_OpenID_OPENID_NS, 'response_nonce'));
        $this->assertTrue($answer->fields->getOpenIDNamespace() == Auth_OpenID_OPENID2_NS);

        # One for nonce, one for ns
        $this->assertEquals(count($answer->fields->toPostArgs()),
                            count($expected_list) + 2);
    }

    function test_answerAllow()
    {
        $answer = $this->request->answer(true);

        if (Auth_OpenID_isError($answer)) {
            $this->fail($answer->toString());
            return;
        }
	$this->assertEquals($answer->request, $this->request);
        $this->_expectAnswer($answer, $this->request->identity);
    }

    function test_answerAllowDelegatedIdentity()
    {
        $this->request->claimed_id = 'http://delegating.unittest/';
        $answer = $this->request->answer(true);
        $this->_expectAnswer($answer, $this->request->identity,
                             $this->request->claimed_id);
    }

    function test_answerAllowWithoutIdentityReally()
    {
        $this->request->identity = null;
        $answer = $this->request->answer(true);
        $this->assertEquals($answer->request, $this->request);
        $this->_expectAnswer($answer);
    }

    function test_answerAllowAnonymousFail()
    {
        $this->request->identity = null;
        // XXX - Check on this, I think this behavior is legal in
        // OpenID 2.0?
        // $this->failUnlessRaises(
        //     ValueError, $this->request->answer, true, identity="=V");
        $this->assertTrue(is_a($this->request->answer(true, null, "=V"),
                               'Auth_OpenID_ServerError'));
    }

    function test_answerAllowWithIdentity()
    {
        $this->request->identity = Auth_OpenID_IDENTIFIER_SELECT;
        $selected_id = 'http://anon.unittest/9861';
        $answer = $this->request->answer(true, null, $selected_id);
        $this->_expectAnswer($answer, $selected_id);
    }

    function test_fromMessageWithoutTrustRoot()
    {
        $msg = new Auth_OpenID_Message(Auth_OpenID_OPENID2_NS);;
        $msg->setArg(Auth_OpenID_OPENID_NS, 'mode', 'checkid_setup');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'return_to',
                     'http://real_trust_root/foo');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_handle', 'bogus');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'identity', 'george');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'claimed_id', 'george');

        $result = Auth_OpenID_CheckIDRequest::fromMessage(
                       $msg, $this->server->op_endpoint);

        $this->assertEquals($result->trust_root,
                            'http://real_trust_root/foo');
    }

    function test_fromMessageWithoutTrustRootOrReturnTo()
    {
        $msg = new Auth_OpenID_Message(Auth_OpenID_OPENID2_NS);
        $msg->setArg(Auth_OpenID_OPENID_NS, 'mode', 'checkid_setup');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_handle', 'bogus');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'identity', 'george');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'claimed_id', 'george');

        $result = Auth_OpenID_CheckIDRequest::fromMessage(
                       $msg, $this->server);
        $this->assertTrue(is_a($result, 'Auth_OpenID_ServerError'));
    }

    function test_answerAllowNoEndpointOpenID1()
    {
        $identity = 'http://bambam.unittest/';
        $reqmessage = Auth_OpenID_Message::fromOpenIDArgs(array(
            'identity' => $identity,
            'trust_root' => 'http://bar.unittest/',
            'return_to' => 'http://bar.unittest/999',
            ));
        $this->server->op_endpoint = null;
        $this->request = Auth_OpenID_CheckIDRequest::fromMessage($reqmessage, $this->server);
        $answer = $this->request->answer(true);

        $expected_list = array('mode' => 'id_res',
                               'return_to' => $this->request->return_to,
                               'identity' => $identity,
                               );

        foreach ($expected_list as $k => $expected) {
            $actual = $answer->fields->getArg(Auth_OpenID_OPENID_NS, $k);
            $this->assertEquals($expected, $actual);
        }

        $this->assertTrue($answer->fields->hasKey(Auth_OpenID_OPENID_NS,
                                                  'response_nonce'));
        $this->assertTrue($answer->fields->getOpenIDNamespace(),
                          Auth_OpenID_OPENID1_NS);
        $this->assertTrue(
            $answer->fields->namespaces->isImplicit(Auth_OpenID_OPENID1_NS));

        // One for nonce (OpenID v1 namespace is implicit)
        $this->assertEquals(count($answer->fields->toPostArgs()),
                            count($expected_list) + 1,
                            var_export($answer->fields->toPostArgs(), true));
    }

    function test_answerAllowWithDelegatedIdentityOpenID2()
    {
        // Answer an IDENTIFIER_SELECT case with a delegated
        // identifier.  claimed_id delegates to selected_id here.
        $this->request->identity = Auth_OpenID_IDENTIFIER_SELECT;
        $selected_id = 'http://anon.unittest/9861';
        $claimed_id = 'http://monkeyhat.unittest/';
        $answer = $this->request->answer(true, null, $selected_id,
                                         $claimed_id);
        $this->_expectAnswer($answer, $selected_id, $claimed_id);
    }

    function test_answerAllowWithDelegatedIdentityOpenID1()
    {
        // claimed_id parameter doesn't exist in OpenID 1.
        $msg = new Auth_OpenID_Message(Auth_OpenID_OPENID1_NS);
        $this->request->message = $msg;
        // claimed_id delegates to selected_id here.
        $this->request->identity = Auth_OpenID_IDENTIFIER_SELECT;
        $selected_id = 'http://anon.unittest/9861';
        $claimed_id = 'http://monkeyhat.unittest/';

        $result = $this->request->answer(true,
                                         null,
                                         $selected_id,
                                         $claimed_id);

        $this->assertTrue(is_a($result, "Auth_OpenID_ServerError"),
                          var_export($result, true));
    }

    function test_answerAllowWithAnotherIdentity()
    {
        // XXX - Check on this, I think this behavior is legal is
        // OpenID 2.0?
        // $this->failUnlessRaises(ValueError, $this->request->answer, true,
        //                       identity="http://pebbles.unittest/");
        $result = $this->request->answer(true, null, "http://pebbles.unittest/");
        $this->assertTrue(is_a($result, "Auth_OpenID_ServerError"));
    }

    function test_answerAllowNoIdentityOpenID1()
    {
        $msg = new Auth_OpenID_Message(Auth_OpenID_OPENID1_NS);
        $this->request->message = $msg;
        $this->request->identity = null;
        // $this->failUnlessRaises(ValueError, $this->request->answer, true,
        //                       identity=null);
        $result = $this->request->answer(true);
        $this->assertTrue(is_a($result, "Auth_OpenID_ServerError"));
    }

    function test_answerAllowForgotEndpoint()
    {
        $this->request->server->op_endpoint = null;
        $result = $this->request->answer(true);
        $this->assertTrue(is_a($result, "Auth_OpenID_ServerError"));
    }

    function test_checkIDWithNoIdentityOpenID1()
    {
        $msg = new Auth_OpenID_Message(Auth_OpenID_OPENID1_NS);
        $msg->setArg(Auth_OpenID_OPENID_NS, 'return_to', 'bogus');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'trust_root', 'bogus');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'mode', 'checkid_setup');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_handle', 'bogus');

        // $this->failUnlessRaises(server->ProtocolError,
        //                       server->CheckIDRequest->fromMessage,
        //                       msg, $this->server);
        $result = Auth_OpenID_CheckIDRequest::fromMessage($msg, $this->server);

        $this->assertTrue(is_a($result, 'Auth_OpenID_ServerError'));
    }

    function test_trustRootOpenID1()
    {
        // Ignore openid.realm in OpenID 1
        $msg = new Auth_OpenID_Message(Auth_OpenID_OPENID1_NS);
        $msg->setArg(Auth_OpenID_OPENID_NS, 'mode', 'checkid_setup');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'trust_root', 'http://real_trust_root/');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'realm', 'http://fake_trust_root/');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'return_to', 'http://real_trust_root/foo');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_handle', 'bogus');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'identity', 'george');

        $result = Auth_OpenID_CheckIDRequest::fromMessage($msg, $this->server);

        $this->assertTrue($result->trust_root == 'http://real_trust_root/');
    }

    function test_trustRootOpenID2()
    {
        // Ignore openid.trust_root in OpenID 2
        $msg = new Auth_OpenID_Message(Auth_OpenID_OPENID2_NS);
        $msg->setArg(Auth_OpenID_OPENID_NS, 'mode', 'checkid_setup');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'realm', 'http://real_trust_root/');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'trust_root', 'http://fake_trust_root/');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'return_to', 'http://real_trust_root/foo');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'assoc_handle', 'bogus');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'identity', 'george');
        $msg->setArg(Auth_OpenID_OPENID_NS, 'claimed_id', 'george');

        $result = Auth_OpenID_CheckIDRequest::fromMessage($msg, $this->server);

        $this->assertTrue($result->trust_root == 'http://real_trust_root/');
    }

    function test_encodeToURL()
    {
        $server_url = 'http://openid-server.unittest/';
        $result = $this->request->encodeToURL($server_url);

        $this->assertFalse(is_a($result, 'Auth_OpenID_ServerError'));

        // How to check?  How about a round-trip test.
        list($base, $result_args) = explode("?", $result, 2);
        $args = Auth_OpenID::getQuery($result_args);
        $message = Auth_OpenID_Message::fromPostArgs($args);

        $rebuilt_request = Auth_OpenID_CheckIDRequest::fromMessage($message,
                                                                   $this->server);
        // argh, lousy hack
        $this->assertTrue($rebuilt_request->equals($this->request));
    }

    function test_answerAllowNoTrustRoot()
    {
        $this->request->trust_root = null;
        $answer = $this->request->answer(true);
	$this->assertEquals($answer->request, $this->request);
	$this->_expectAnswer($answer, $this->request->identity);
    }

    function test_answerImmediateDenyOpenID1()
    {
        $msg = new Auth_OpenID_Message(Auth_OpenID_OPENID1_NS);
        $this->request->message = $msg;
        $this->request->namespace = $msg->getOpenIDNamespace();
        $this->request->mode = 'checkid_immediate';
        $this->request->claimed_id = 'http://claimed-id.test/';
        $this->request->immediate = true;
        $server_url = "http://setup-url.unittest/";
        $answer = $this->request->answer(false, $server_url);

        $this->assertEquals($answer->request, $this->request);
        $this->assertEquals(count($answer->fields->toPostArgs()), 2);
	$this->assertEquals($answer->fields->getOpenIDNamespace(),
			    Auth_OpenID_OPENID1_NS);
        $this->assertTrue(
                          $answer->fields->namespaces->isImplicit(Auth_OpenID_OPENID1_NS));
        $this->assertEquals($answer->fields->getArg(Auth_OpenID_OPENID_NS, 'mode'),
                            'id_res');

        $usu = $answer->fields->getArg(Auth_OpenID_OPENID_NS,'user_setup_url');
        $this->assertTrue(strpos($usu, $server_url) == 0);
        $expected_substr = 'openid.claimed_id=http%3A%2F%2Fclaimed-id.test%2F';
        $this->assertTrue(strpos($usu, $expected_substr), $usu);
    }

    function test_answerImmediateDenyOpenID2()
    {
        $this->request->mode = 'checkid_immediate';
        $this->request->immediate = true;
        $server_url = "http://setup-url.unittest/";
        $answer = $this->request->answer(false, $server_url);

        $this->assertEquals($answer->request, $this->request);
        $this->assertEquals(count($answer->fields->toPostArgs()), 3);
	$this->assertEquals($answer->fields->getOpenIDNamespace(),
			    Auth_OpenID_OPENID2_NS);
        $this->assertEquals($answer->fields->getArg(Auth_OpenID_OPENID_NS, 'mode'),
                            'setup_needed');
    }

    function test_answerSetupDeny()
    {
        $answer = $this->request->answer(false);
        $this->assertEquals($answer->fields->getArgs(Auth_OpenID_OPENID_NS),
                            array('mode' => 'cancel'));
    }

    function test_getCancelURL()
    {
        $url = $this->request->getCancelURL();

        $parsed = parse_url($url);
        $query = Auth_OpenID::getQuery($parsed['query']);

	$this->assertEquals(array('openid.mode' => 'cancel',
				  'openid.ns' => Auth_OpenID_OPENID2_NS),
			    $query);
    }

    function test_getCancelURLimmed()
    {
        $this->request->mode = 'checkid_immediate';
        $this->request->immediate = true;
        $result = $this->request->getCancelURL();
        if (!is_a($result, 'Auth_OpenID_ServerError')) {
            $this->fail(sprintf("Expected Auth_OpenID_ServerError, got %s",
                                gettype($result)));
        }
    }
}

class Tests_Auth_OpenID_CheckIDExtension extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->op_endpoint = 'http://endpoint.unittest/ext';
        $this->store = new Tests_Auth_OpenID_MemStore();
        $this->server = new Auth_OpenID_Server($this->store, $this->op_endpoint);
        $this->request = new Auth_OpenID_CheckIDRequest(
            'http://bambam.unittest/',
            'http://bar.unittest/',
            'http://bar.unittest/999',
            false,
            null,
            $this->server);

        $this->response = new Auth_OpenID_ServerResponse($this->request);
        $this->response->fields->setArg(Auth_OpenID_OPENID_NS, 'mode', 'id_res');
        $this->response->fields->setArg(Auth_OpenID_OPENID_NS, 'blue', 'star');
    }

    function test_addField()
    {
        $namespace = 'something:';
        $this->response->fields->setArg($namespace, 'bright', 'potato');
        $this->assertEquals($this->response->fields->getArgs(Auth_OpenID_OPENID_NS),
                            array('blue' => 'star',
                                  'mode' => 'id_res'));

        $this->assertEquals($this->response->fields->getArgs($namespace),
                            array('bright' => 'potato'));
    }

    function test_addFields()
    {
        $namespace = 'mi5:';
        $args =  array('tangy' => 'suspenders',
                       'bravo' => 'inclusion');

        $this->response->fields->updateArgs($namespace, $args);
        $this->assertEquals($this->response->fields->getArgs(Auth_OpenID_OPENID_NS),
                            array('blue' => 'star',
                                  'mode' => 'id_res'));
        $this->assertEquals($this->response->fields->getArgs($namespace), $args);
    }
}

class _MockSignatory {
    var $isValid = true;

    function _MockSignatory($assoc)
    {
        $this->assocs = array($assoc);
    }

    function verify($assoc_handle, $message)
    {
        if (!$message->hasKey(Auth_OpenID_OPENID_NS, 'sig')) {
            return false;
        }

        if (in_array(array(true, $assoc_handle), $this->assocs)) {
            return $this->isValid;
        } else {
            return false;
        }
    }

    function getAssociation($assoc_handle, $dumb)
    {
        if (in_array(array($dumb, $assoc_handle), $this->assocs)) {
            // This isn't a valid implementation for many uses of this
            // function, mind you.
            return true;
        } else {
            return null;
        }
    }

    function invalidate($assoc_handle, $dumb)
    {
        if (in_array(array($dumb, $assoc_handle), $this->assocs)) {
            $i = 0;
            foreach ($this->assocs as $pair) {
                if ($pair == array($dumb, $assoc_handle)) {
                    unset($this->assocs[$i]);
                    break;
                }
                $i++;
            }
        }
    }
}

class Tests_Auth_OpenID_CheckAuth extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->assoc_handle = 'mooooooooo';
        $this->message = Auth_OpenID_Message::fromPostArgs(
                           array('openid.sig' => 'signarture',
                                 'one' => 'alpha',
                                 'two' => 'beta'));

        $this->request = new Auth_OpenID_CheckAuthRequest(
                               $this->assoc_handle, $this->message);

        $this->signatory = new _MockSignatory(array(true, $this->assoc_handle));
    }

    function test_valid()
    {
        $this->request->namespace = Auth_OpenID_OPENID1_NS;
        $r = $this->request->answer($this->signatory);
        $this->assertEquals($r->fields->getArgs(Auth_OpenID_OPENID1_NS),
                            array('is_valid' => 'true'));
        $this->assertEquals($r->request, $this->request);
    }

    function test_invalid()
    {
        $this->request->namespace = Auth_OpenID_OPENID1_NS;
        $this->signatory->isValid = false;
        $r = $this->request->answer($this->signatory);
        $this->assertEquals($r->fields->getArgs(Auth_OpenID_OPENID1_NS),
                            array('is_valid' => 'false'));
    }

    function test_replay()
    {
        $this->request->namespace = Auth_OpenID_OPENID1_NS;
        $r = $this->request->answer($this->signatory);
        $r = $this->request->answer($this->signatory);
        $this->assertEquals($r->fields->getArgs(Auth_OpenID_OPENID1_NS),
                            array('is_valid' => 'false'));
    }

    function test_invalidatehandle()
    {
        $this->request->namespace = Auth_OpenID_OPENID1_NS;
        $this->request->invalidate_handle = "bogusHandle";
        $r = $this->request->answer($this->signatory);
        $this->assertEquals($r->fields->getArgs(Auth_OpenID_OPENID1_NS),
                            array('is_valid' => 'true',
                                  'invalidate_handle' => "bogusHandle"));
        $this->assertEquals($r->request, $this->request);
    }

    function test_invalidatehandleNo()
    {
        $this->request->namespace = Auth_OpenID_OPENID1_NS;
        $assoc_handle = 'goodhandle';
        $this->signatory->assocs[] = array(false, 'goodhandle');
        $this->request->invalidate_handle = $assoc_handle;
        $r = $this->request->answer($this->signatory);
        $this->assertEquals($r->fields->getArgs(Auth_OpenID_OPENID1_NS),
                            array('is_valid' => 'true'));
    }
}

class Tests_Auth_OpenID_Associate extends PHPUnit_Framework_TestCase {
    // TODO: test DH with non-default values for modulus and gen.
    // (important to do because we actually had it broken for a
    // while.)

    function setUp()
    {
        $message = new Auth_OpenID_Message(Auth_OpenID_OPENID1_NS);
        $this->request = Auth_OpenID_AssociateRequest::fromMessage($message);
        $this->store = new Tests_Auth_OpenID_MemStore();
        $this->signatory = new Auth_OpenID_Signatory($this->store);
    }

    function test_dhSHA1()
    {
        if (!defined('Auth_OpenID_NO_MATH_SUPPORT')) {
            $this->assoc = $this->signatory->createAssociation(false,
                                                               'HMAC-SHA1');

            $dh = new Auth_OpenID_DiffieHellman();
            $ml = Auth_OpenID_getMathLib();

            $cpub = $dh->public;
            $session = new Auth_OpenID_DiffieHellmanSHA1ServerSession(
                                           new Auth_OpenID_DiffieHellman(),
                                           $cpub);

            $this->request = new Auth_OpenID_AssociateRequest($session,
                                                              'HMAC-SHA1');
            $response = $this->request->answer($this->assoc);

            $this->assertEquals(
                      $response->fields->getArg(Auth_OpenID_OPENID_NS, "assoc_type"),
                      "HMAC-SHA1");

            $this->assertEquals(
                      $response->fields->getArg(Auth_OpenID_OPENID_NS, "assoc_handle"),
                      $this->assoc->handle);

            $this->assertFalse(
                      $response->fields->getArg(Auth_OpenID_OPENID_NS, "mac_key"));

            $this->assertEquals(
                      $response->fields->getArg(Auth_OpenID_OPENID_NS, "session_type"),
                      "DH-SHA1");

            $this->assertTrue(
                      $response->fields->getArg(Auth_OpenID_OPENID_NS, "enc_mac_key"));

            $this->assertTrue(
                      $response->fields->getArg(Auth_OpenID_OPENID_NS,
                                            "dh_server_public"));

            $enc_key = base64_decode(
                      $response->fields->getArg(Auth_OpenID_OPENID_NS, "enc_mac_key"));

            $spub = $ml->base64ToLong(
                      $response->fields->getArg(Auth_OpenID_OPENID_NS,
                                            "dh_server_public"));

            $secret = $dh->xorSecret($spub, $enc_key, $session->hash_func);

            $this->assertEquals($secret, $this->assoc->secret);
        }
    }

    function test_dhSHA256()
    {
        if (defined('Auth_OpenID_NO_MATH_SUPPORT') ||
            !Auth_OpenID_SHA256_SUPPORTED) {
            print "(Skipping test_dhSHA256)";
            return;
        }

        $this->assoc = $this->signatory->createAssociation(false,
                                                           'HMAC-SHA256');
        $consumer_dh = new Auth_OpenID_DiffieHellman();
        $cpub = $consumer_dh->public;
        $server_dh = new Auth_OpenID_DiffieHellman();
        $session = new Auth_OpenID_DiffieHellmanSHA256ServerSession($server_dh, $cpub);

        $this->request = new Auth_OpenID_AssociateRequest($session, 'HMAC-SHA256');
        $response = $this->request->answer($this->assoc);

        $this->assertFalse($response->fields->getArg(Auth_OpenID_OPENID_NS, "mac_key"));
        $this->assertTrue($response->fields->getArg(Auth_OpenID_OPENID_NS, "enc_mac_key"));
        $this->assertTrue($response->fields->getArg(Auth_OpenID_OPENID_NS, "dh_server_public"));

        $fields = array(
                        'assoc_type' => 'HMAC-SHA256',
                        'assoc_handle' => $this->assoc->handle,
                        'session_type' => 'DH-SHA256',
                        );

        foreach ($fields as $k => $v) {
            $this->assertEquals(
               $response->fields->getArg(Auth_OpenID_OPENID_NS, $k), $v);
        }

        $enc_key = base64_decode(
                     $response->fields->getArg(Auth_OpenID_OPENID_NS, "enc_mac_key"));

        $lib = Auth_OpenID_getMathLib();
        $spub = $lib->base64ToLong($response->fields->getArg(Auth_OpenID_OPENID_NS,
                                                             "dh_server_public"));
        $secret = $consumer_dh->xorSecret($spub, $enc_key, 'Auth_OpenID_SHA256');

        $s = base64_encode($secret);
        $assoc_s = base64_encode($this->assoc->secret);

        $this->assertEquals($s, $assoc_s);
    }

    function test_protoError256()
    {
        if (defined('Auth_OpenID_NO_MATH_SUPPORT') ||
            !Auth_OpenID_HMACSHA256_SUPPORTED) {
            print "(Skipping test_protoError256)";
            return;
        }

        $s256_session = new Auth_OpenID_DiffieHellmanSHA256ConsumerSession();

        $invalid_s256 = array('openid.assoc_type' => 'HMAC-SHA1',
                              'openid.session_type' => 'DH-SHA256');

        $invalid_s256 = array_merge($invalid_s256, $s256_session->getRequest());

        $invalid_s256_2 = array('openid.assoc_type' => 'MONKEY-PIRATE',
                                'openid.session_type' => 'DH-SHA256');

        $invalid_s256_2 = array_merge($invalid_s256_2, $s256_session->getRequest());

        $bad_request_argss = array(
                                   $invalid_s256,
                                   $invalid_s256_2);

        foreach ($bad_request_argss as $request_args) {
            $message = Auth_OpenID_Message::fromPostArgs($request_args);
            $result = Auth_OpenID_Associaterequest::fromMessage($message);
            $this->assertTrue(is_a($result, 'Auth_OpenID_ServerError'));
        }
    }

    function test_plaintext()
    {
        $this->assoc = $this->signatory->createAssociation(false,
                                                           'HMAC-SHA1');
        $response = $this->request->answer($this->assoc);

        $this->assertEquals(
                     $response->fields->getArg(Auth_OpenID_OPENID_NS, "assoc_type"),
                     "HMAC-SHA1");

        $this->assertEquals(
                     $response->fields->getArg(Auth_OpenID_OPENID_NS, "assoc_handle"),
                     $this->assoc->handle);

        $this->assertEquals(
            $response->fields->getArg(Auth_OpenID_OPENID_NS, "expires_in"),
            sprintf("%d", $this->signatory->SECRET_LIFETIME));

        $this->assertEquals(
            $response->fields->getArg(Auth_OpenID_OPENID_NS, "mac_key"),
            base64_encode($this->assoc->secret));

        $this->assertFalse($response->fields->getArg(Auth_OpenID_OPENID_NS,
                                                 "session_type"));

        $this->assertFalse($response->fields->getArg(Auth_OpenID_OPENID_NS,
                                                 "enc_mac_key"));

        $this->assertFalse($response->fields->getArg(Auth_OpenID_OPENID_NS,
                                                 "dh_server_public"));
    }

    function test_plaintextV2()
    {
        // The main difference between this and the v1 test is that
        // the session_typ is always returned in v2.
        $args = array('openid.mode' => 'associate',
                      'openid.ns' => Auth_OpenID_OPENID2_NS,
                      'openid.assoc_type' => 'HMAC-SHA1',
                      'openid.session_type' => 'no-encryption');

        $this->request = Auth_OpenID_AssociateRequest::fromMessage(
            Auth_OpenID_Message::fromPostArgs($args));
        $this->assertFalse($this->request->message->isOpenID1());

        $this->assoc = $this->signatory->createAssociation(false,
                                                           'HMAC-SHA1');
        $response = $this->request->answer($this->assoc);

        $this->assertEquals(
                     $response->fields->getArg(Auth_OpenID_OPENID_NS, "assoc_type"),
                     "HMAC-SHA1");

        $this->assertEquals(
                     $response->fields->getArg(Auth_OpenID_OPENID_NS, "assoc_handle"),
                     $this->assoc->handle);

        $this->assertEquals(
            $response->fields->getArg(Auth_OpenID_OPENID_NS, "expires_in"),
            sprintf("%d", $this->signatory->SECRET_LIFETIME));

        $this->assertEquals(
            $response->fields->getArg(Auth_OpenID_OPENID_NS, "mac_key"),
            base64_encode($this->assoc->secret));

        $session_type = $response->fields->getArg(Auth_OpenID_OPENID_NS,
                                                  "session_type");
        $this->assertEquals('no-encryption', $session_type);

        $this->assertFalse($response->fields->getArg(Auth_OpenID_OPENID_NS,
                                                 "enc_mac_key"));
        $this->assertFalse($response->fields->getArg(Auth_OpenID_OPENID_NS,
                                                 "dh_server_public"));
    }

    function test_protoError()
    {
        $s1_session = new Auth_OpenID_DiffieHellmanSHA1ConsumerSession();

        $invalid_s1 = array('openid.assoc_type' => 'HMAC-SHA256',
                            'openid.session_type' => 'DH-SHA1');
        $invalid_s1 = array_merge($invalid_s1, $s1_session->getRequest());

        $invalid_s1_2 = array('openid.assoc_type' => 'ROBOT-NINJA',
                              'openid.session_type' => 'DH-SHA1');
        $invalid_s1_2 = array_merge($invalid_s1_2, $s1_session->getRequest());

        $bad_request_argss = array(array('openid.assoc_type' => 'Wha?'),
                                   $invalid_s1,
                                   $invalid_s1_2);

        foreach ($bad_request_argss as $request_args) {
            $message = Auth_OpenID_Message::fromPostArgs($request_args);
            $result = Auth_OpenID_AssociateRequest::fromMessage($message);
            $this->assertTrue(is_a($result, 'Auth_OpenID_ServerError'));
        }
    }

    function test_protoErrorFields()
    {
        $contact = 'user@example.invalid';
        $reference = 'Trac ticket number MAX_INT';
        $error = 'poltergeist';

        $openid1_args = array(
            'openid.identitiy' => 'invalid',
            'openid.mode' => 'checkid_setup');

        $openid2_args = $openid1_args;
        $openid2_args = array_merge($openid2_args,
                                    array('openid.ns' => Auth_OpenID_OPENID2_NS));

        // Check presence of optional fields in both protocol versions

        $openid1_msg = Auth_OpenID_Message::fromPostArgs($openid1_args);
        $p = new Auth_OpenID_ServerError($openid1_msg, $error,
                                         $reference, $contact);
        $reply = $p->toMessage();

        $this->assertEquals($reply->getArg(Auth_OpenID_OPENID_NS, 'reference'),
                            $reference);
        $this->assertEquals($reply->getArg(Auth_OpenID_OPENID_NS, 'contact'),
                            $contact);

        $openid2_msg = Auth_OpenID_Message::fromPostArgs($openid2_args);
        $p = new Auth_OpenID_ServerError($openid2_msg, $error,
                                         $reference, $contact);
        $reply = $p->toMessage();

        $this->assertEquals($reply->getArg(Auth_OpenID_OPENID_NS, 'reference'),
                            $reference);
        $this->assertEquals($reply->getArg(Auth_OpenID_OPENID_NS, 'contact'),
                            $contact);
    }

    function failUnlessExpiresInMatches($msg, $expected_expires_in)
    {
        $expires_in_str = $msg->getArg(Auth_OpenID_OPENID_NS, 'expires_in');
        if ($expires_in_str === null) {
            $this->fail("Expected expires_in value.");
            return;
        }

        $expires_in = intval($expires_in_str);

        // Slop is necessary because the tests can sometimes get run
        // right on a second boundary
        $slop = 1; // second
        $difference = $expected_expires_in - $expires_in;

        $error_message = sprintf('"expires_in" value not within %s of expected: '.
                                 'expected=%s, actual=%s',
                                 $slop, $expected_expires_in, $expires_in);
        $this->assertTrue((0 <= $difference &&
                           $difference <= $slop), $error_message);
    }

    function test_plaintext256()
    {
        if (defined('Auth_OpenID_NO_MATH_SUPPORT') ||
            !Auth_OpenID_SHA256_SUPPORTED) {
            print "(Skipping test_plaintext256)";
            return;
        }

        $this->assoc = $this->signatory->createAssociation(false,
                                                           'HMAC-SHA256');
        $response = $this->request->answer($this->assoc);
        $f = $response->fields;

        $this->assertEquals($f->getArg(Auth_OpenID_OPENID_NS, "assoc_type"),
                            "HMAC-SHA1");
        $this->assertEquals($f->getArg(Auth_OpenID_OPENID_NS, "assoc_handle"),
                            $this->assoc->handle);

        $this->failUnlessExpiresInMatches(
                                          $f,
                                          $this->signatory->SECRET_LIFETIME);

        $this->assertEquals(
                            $f->getArg(Auth_OpenID_OPENID_NS, "mac_key"),
                            base64_encode($this->assoc->secret));
        $this->assertFalse($f->hasKey(Auth_OpenID_OPENID_NS, "session_type"));
        $this->assertFalse($f->hasKey(Auth_OpenID_OPENID_NS, "enc_mac_key"));
        $this->assertFalse($f->hasKey(Auth_OpenID_OPENID_NS, "dh_server_public"));
    }

    function test_unsupportedPrefer()
    {
        $allowed_assoc = 'COLD-PET-RAT';
        $allowed_sess = 'FROG-BONES';
        $message = 'This is a unit test';

        // Set an OpenID 2 message so answerUnsupported doesn't raise
        // ProtocolError.
        $this->request->message = new Auth_OpenID_Message(Auth_OpenID_OPENID2_NS);

        $response = $this->request->answerUnsupported(
                                                      $message,
                                                      $allowed_assoc,
                                                      $allowed_sess);
        $f = $response->fields;
        $this->assertEquals($f->getArg(Auth_OpenID_OPENID_NS, 'error_code'),
                            'unsupported-type');

        $this->assertEquals($f->getArg(Auth_OpenID_OPENID_NS, 'assoc_type'),
                            $allowed_assoc);

        $this->assertEquals($f->getArg(Auth_OpenID_OPENID_NS, 'error'),
                            $message);

        $this->assertEquals($f->getArg(Auth_OpenID_OPENID_NS, 'session_type'),
                            $allowed_sess);
    }

    function test_unsupported()
    {
        $message = 'This is a unit test';

        $this->request->message = new Auth_OpenID_Message(Auth_OpenID_OPENID2_NS);

        $response = $this->request->answerUnsupported($message);

        $f = $response->fields;
        $this->assertEquals($f->getArg(Auth_OpenID_OPENID_NS, 'error_code'),
                            'unsupported-type');

        $this->assertEquals($f->getArg(Auth_OpenID_OPENID_NS, 'assoc_type'), null);
        $this->assertEquals($f->getArg(Auth_OpenID_OPENID_NS, 'error'), $message);
        $this->assertEquals($f->getArg(Auth_OpenID_OPENID_NS, 'session_type'), null);
    }
}

class Counter {
    function Counter()
    {
        $this->count = 0;
    }

    function inc()
    {
        $this->count += 1;
    }
}

class Tests_Auth_OpenID_ServerTest extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->store = new Tests_Auth_OpenID_MemStore();
        $this->server = new Auth_OpenID_Server($this->store);
    }

    function test_associate()
    {
        if (!defined('Auth_OpenID_NO_MATH_SUPPORT')) {
            $message = new Auth_OpenID_Message(Auth_OpenID_OPENID1_NS);
            $request = Auth_OpenID_AssociateRequest::fromMessage($message);
            $response = $this->server->openid_associate($request);
            $this->assertTrue($response->fields->hasKey(Auth_OpenID_OPENID_NS,
                                                        'assoc_handle'));
        }
    }

    function test_associate2()
    {
        // Associate when the server has no allowed association types
        //
        // Gives back an error with error_code and no fallback session
        // or assoc types.
        $this->server->negotiator->setAllowedTypes(array());

        $msg = Auth_OpenID_Message::fromPostArgs(array(
                 'openid.ns' => Auth_OpenID_OPENID2_NS,
                 'openid.session_type' => 'no-encryption'));

        $request = Auth_OpenID_AssociateRequest::fromMessage($msg);

        $response = $this->server->openid_associate($request);
        $this->assertTrue($response->fields->hasKey(Auth_OpenID_OPENID_NS, "error"));
        $this->assertTrue($response->fields->hasKey(Auth_OpenID_OPENID_NS, "error_code"));
        $this->assertFalse($response->fields->hasKey(Auth_OpenID_OPENID_NS, "assoc_handle"));
        $this->assertFalse($response->fields->hasKey(Auth_OpenID_OPENID_NS, "assoc_type"));
        $this->assertFalse($response->fields->hasKey(Auth_OpenID_OPENID_NS, "session_type"));
    }

    function test_associate3()
    {
        if (defined('Auth_OpenID_NO_MATH_SUPPORT') ||
            !Auth_OpenID_HMACSHA256_SUPPORTED) {
            print "(Skipping test_associate3)";
            return;
        }

        // Request an assoc type that is not supported when there are
        // supported types.
        //
        // Should give back an error message with a fallback type.
        $this->server->negotiator->setAllowedTypes(array(array('HMAC-SHA256', 'DH-SHA256')));

        $msg = Auth_OpenID_Message::fromPostArgs(array(
                 'openid.ns' => Auth_OpenID_OPENID2_NS,
                 'openid.session_type' => 'no-encryption'));

        $request = Auth_OpenID_AssociateRequest::fromMessage($msg);
        $response = $this->server->openid_associate($request);

        $this->assertTrue($response->fields->hasKey(Auth_OpenID_OPENID_NS, "error"));
        $this->assertTrue($response->fields->hasKey(Auth_OpenID_OPENID_NS, "error_code"));
        $this->assertFalse($response->fields->hasKey(Auth_OpenID_OPENID_NS, "assoc_handle"));
        $this->assertEquals($response->fields->getArg(Auth_OpenID_OPENID_NS, "assoc_type"),
                            'HMAC-SHA256');
        $this->assertEquals($response->fields->getArg(Auth_OpenID_OPENID_NS, "session_type"),
                            'DH-SHA256');
    }

    function test_associate4()
    {
        if (defined('Auth_OpenID_NO_MATH_SUPPORT') ||
            !Auth_OpenID_HMACSHA256_SUPPORTED) {
            print "(Skipping test_associate4)";
            return;
        }

        $this->assertTrue($this->server->negotiator->setAllowedTypes(
           array(array('HMAC-SHA256', 'DH-SHA256'))));

        $query = array(
                       'openid.dh_consumer_public' =>
                       'ALZgnx8N5Lgd7pCj8K86T/DDMFjJXSss1SKoLmxE72kJTzOtG6I2PaYrHX'.
                       'xku4jMQWSsGfLJxwCZ6280uYjUST/9NWmuAfcrBfmDHIBc3H8xh6RBnlXJ'.
                       '1WxJY3jHd5k1/ZReyRZOxZTKdF/dnIqwF8ZXUwI6peV0TyS/K1fOfF/s',
                       'openid.assoc_type' => 'HMAC-SHA256',
                       'openid.session_type' => 'DH-SHA256');

        $message = Auth_OpenID_Message::fromPostArgs($query);
        $request = Auth_OpenID_AssociateRequest::fromMessage($message);
        $response = $this->server->openid_associate($request);
        $this->assertTrue($response->fields->hasKey(Auth_OpenID_OPENID_NS, "assoc_handle"));
    }

    function test_missingSessionTypeOpenID2()
    {
        // Make sure session_type is required in OpenID 2
        $msg = Auth_OpenID_Message::fromPostArgs(array('openid.ns' => Auth_OpenID_OPENID2_NS));

        $result = Auth_OpenID_AssociateRequest::fromMessage($msg);

        $this->assertTrue(is_a($result, 'Auth_OpenID_ServerError'));
    }

    function test_checkAuth()
    {
        $request = new Auth_OpenID_CheckAuthRequest('arrrrrf',
                                                    '0x3999', array());

        $response = $this->server->openid_check_authentication($request);
        $this->assertTrue($response->fields->hasKey(Auth_OpenID_OPENID_NS, 'is_valid'));
    }
}

class Tests_Auth_OpenID_Signatory extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->store = new Tests_Auth_OpenID_MemStore();
        $this->signatory = new Auth_OpenID_Signatory($this->store);
        $this->dumb_key = $this->signatory->dumb_key;
        $this->normal_key = $this->signatory->normal_key;
    }

    function test_sign()
    {
        $request = new Auth_OpenID_ServerRequest();
        $request->namespace = Auth_OpenID_OPENID1_NS;

        $assoc_handle = '{assoc}{lookatme}';
        $assoc = Auth_OpenID_Association::fromExpiresIn(60, $assoc_handle,
                                                        'sekrit', 'HMAC-SHA1');
        $this->store->storeAssociation($this->normal_key, $assoc);
        $request->assoc_handle = $assoc_handle;
        $request->namespace = Auth_OpenID_OPENID1_NS;

        $response = new Auth_OpenID_ServerResponse($request);
        $response->fields = Auth_OpenID_Message::fromOpenIDArgs(array(
            'foo' => 'amsigned',
            'bar' => 'notsigned',
            'azu' => 'alsosigned'));

        $sresponse = $this->signatory->sign($response);

        $this->assertEquals($sresponse->fields->getArg(Auth_OpenID_OPENID_NS,
                                                       'assoc_handle'),
                            $assoc_handle);

        $this->assertEquals($sresponse->fields->getArg(Auth_OpenID_OPENID_NS, 'signed'),
                            'assoc_handle,azu,bar,foo,signed');

        $this->assertTrue($sresponse->fields->hasKey(Auth_OpenID_OPENID_NS, 'sig'));
    }

    function test_signDumb()
    {
        $request = new Auth_OpenID_ServerRequest();
        $request->assoc_handle = null;
        $request->namespace = Auth_OpenID_OPENID1_NS;

        $response = new Auth_OpenID_ServerResponse($request);
        $response->fields = Auth_OpenID_Message::fromOpenIDArgs(array(
            'foo' => 'amsigned',
            'bar' => 'notsigned',
            'azu' => 'alsosigned'));

        $sresponse = $this->signatory->sign($response);

        $assoc_handle = $sresponse->fields->getArg(Auth_OpenID_OPENID_NS,
                                                   'assoc_handle');

        $this->assertTrue($assoc_handle);
        $assoc = $this->signatory->getAssociation($assoc_handle, true);

        $this->assertTrue($assoc);
        $this->assertEquals($sresponse->fields->getArg(Auth_OpenID_OPENID_NS, 'signed'),
                            'assoc_handle,azu,bar,foo,signed');
        $this->assertTrue($sresponse->fields->hasKey(Auth_OpenID_OPENID_NS, 'sig'));
    }

    function test_signExpired()
    {
        $request = new Auth_OpenID_ServerRequest();
        $assoc_handle = '{assoc}{lookatme}';
        $assoc = Auth_OpenID_Association::fromExpiresIn(-10, $assoc_handle,
                                                        'sekrit', 'HMAC-SHA1');
        $this->store->storeAssociation($this->normal_key, $assoc);
        $this->assertTrue($this->store->getAssociation($this->normal_key,
                                                       $assoc_handle));

        $request->assoc_handle = $assoc_handle;
        $request->namespace = Auth_OpenID_OPENID1_NS;

        $response = new Auth_OpenID_ServerResponse($request);
        $response->fields = Auth_OpenID_Message::fromOpenIDArgs(array(
            'foo' => 'amsigned',
            'bar' => 'notsigned',
            'azu' => 'alsosigned'));

        $sresponse = $this->signatory->sign($response);

        $new_assoc_handle = $sresponse->fields->getArg(Auth_OpenID_OPENID_NS,
                                                       'assoc_handle');
        $this->assertTrue($new_assoc_handle);
        $this->assertFalse($new_assoc_handle == $assoc_handle);

        $this->assertEquals($sresponse->fields->getArg(Auth_OpenID_OPENID_NS,
                                                       'invalidate_handle'),
                            $assoc_handle);

        $this->assertEquals($sresponse->fields->getArg(Auth_OpenID_OPENID_NS,
                                                       'signed'),
                            'assoc_handle,azu,bar,foo,invalidate_handle,signed');
        $this->assertTrue($sresponse->fields->hasKey(Auth_OpenID_OPENID_NS,
                                                     'sig'));

        // make sure the expired association is gone
        $this->assertFalse($this->store->getAssociation($this->normal_key,
                                                        $assoc_handle));

        // make sure the new key is a dumb mode association
        $this->assertTrue($this->store->getAssociation($this->dumb_key,
                                                       $new_assoc_handle));

        $this->assertFalse($this->store->getAssociation($this->normal_key,
                                                        $new_assoc_handle));
    }

    function test_signInvalidHandle()
    {
        $request = new Auth_OpenID_ServerRequest();
        $assoc_handle = '{bogus-assoc}{notvalid}';

        $request->assoc_handle = $assoc_handle;
        $request->namespace = Auth_OpenID_OPENID1_NS;

        $response = new Auth_OpenID_ServerResponse($request);
        $response->fields = Auth_OpenID_Message::fromOpenIDArgs(array(
            'foo' => 'amsigned',
            'bar' => 'notsigned',
            'azu' => 'alsosigned'));

        $response->signed = array('foo', 'azu');
        $sresponse = $this->signatory->sign($response);

        $new_assoc_handle = $sresponse->fields->getArg(Auth_OpenID_OPENID_NS,
                                                       'assoc_handle');

        $this->assertTrue($new_assoc_handle);
        $this->assertFalse($new_assoc_handle == $assoc_handle);

        $this->assertEquals($sresponse->fields->getArg(Auth_OpenID_OPENID_NS,
                                                       'invalidate_handle'),
                            $assoc_handle);

        $this->assertEquals($sresponse->fields->getArg(Auth_OpenID_OPENID_NS,
                                                       'signed'),
                            'assoc_handle,azu,bar,foo,invalidate_handle,signed');
        $this->assertTrue($sresponse->fields->hasKey(Auth_OpenID_OPENID_NS,
                                                     'sig'));

        // make sure the new key is a dumb mode association
        $this->assertTrue($this->store->getAssociation($this->dumb_key,
                                                       $new_assoc_handle));

        $this->assertFalse($this->store->getAssociation($this->normal_key,
                                                        $new_assoc_handle));
    }

    function test_verify()
    {
        $assoc_handle = '{vroom}{zoom}';
        $assoc = Auth_OpenID_Association::fromExpiresIn(60, $assoc_handle,
                                                        'sekrit', 'HMAC-SHA1');

        $this->store->storeAssociation($this->dumb_key, $assoc);

        $signed = Auth_OpenID_Message::fromPostArgs(array(
            'openid.foo' => 'bar',
            'openid.apple' => 'orange',
            'openid.assoc_handle' => $assoc_handle,
            'openid.signed' => 'apple,assoc_handle,foo,signed',
            'openid.sig' => 'uXoT1qm62/BB09Xbj98TQ8mlBco='));

        $verified = $this->signatory->verify($assoc_handle, $signed);
        $this->assertTrue($verified);
    }

    function test_verifyBadSig()
    {
        $assoc_handle = '{vroom}{zoom}';
        $assoc = Auth_OpenID_Association::fromExpiresIn(60, $assoc_handle,
                                                        'sekrit', 'HMAC-SHA1');

        $this->store->storeAssociation($this->dumb_key, $assoc);

        $signed = Auth_OpenID_Message::fromPostArgs(array(
            'openid.foo' => 'bar',
            'openid.apple' => 'orange',
            'openid.assoc_handle' => $assoc_handle,
            'openid.signed' => 'apple,assoc_handle,foo,signed',
            'openid.sig' => str_rot13('uXoT1qm62/BB09Xbj98TQ8mlBco=')));

        $verified = $this->signatory->verify($assoc_handle, $signed);

        $this->assertFalse($verified);
    }

    function test_verifyBadHandle()
    {
        $assoc_handle = '{vroom}{zoom}';
        $signed = Auth_OpenID_Message::fromPostArgs(
                       array('foo' => 'bar',
                             'apple' => 'orange',
                             'openid.sig' => "Ylu0KcIR7PvNegB/K41KpnRgJl0="));

        $verified = $this->signatory->verify($assoc_handle, $signed);
        $this->assertFalse($verified);
    }

    function test_verifyAssocMismatch()
    {
        // Attempt to validate sign-all message with a signed-list
        // assoc.
        $assoc_handle = '{vroom}{zoom}';
        $assoc = Auth_OpenID_Association::fromExpiresIn(
                   60, $assoc_handle, 'sekrit', 'HMAC-SHA1');

        $this->store->storeAssociation($this->dumb_key, $assoc);

        $signed = Auth_OpenID_Message::fromPostArgs(array(
            'foo' => 'bar',
            'apple' => 'orange',
            'openid.sig' => "d71xlHtqnq98DonoSgoK/nD+QRM="
            ));

        $verified = $this->signatory->verify($assoc_handle, $signed);
        $this->assertFalse($verified);
    }

    function test_getAssoc()
    {
        $assoc_handle = $this->makeAssoc(true);
        $assoc = $this->signatory->getAssociation($assoc_handle, true);
        $this->assertTrue($assoc);
        $this->assertEquals($assoc->handle, $assoc_handle);
    }

    function test_getAssocExpired()
    {
        $assoc_handle = $this->makeAssoc(true, -10);
        $assoc = $this->signatory->getAssociation($assoc_handle, true);
        $this->assertFalse($assoc);
    }

    function test_getAssocInvalid()
    {
        $ah = 'no-such-handle';
        $this->assertEquals(
            $this->signatory->getAssociation($ah, false), null);
    }

    function test_getAssocDumbVsNormal()
    {
        $assoc_handle = $this->makeAssoc(true);
        $this->assertEquals(
            $this->signatory->getAssociation($assoc_handle, false), null);
    }

    function test_createAssociation()
    {
        $assoc = $this->signatory->createAssociation(false);
        $this->assertTrue($this->signatory->getAssociation($assoc->handle,
                                                           false));
    }

    function makeAssoc($dumb, $lifetime = 60)
    {
        $assoc_handle = '{bling}';
        $assoc = Auth_OpenID_Association::fromExpiresIn(
                                               $lifetime, $assoc_handle,
                                               'sekrit', 'HMAC-SHA1');

        $this->store->storeAssociation((($dumb) ? $this->dumb_key :
                                        $this->normal_key), $assoc);
        return $assoc_handle;
    }

    function test_invalidate()
    {
        $assoc_handle = '-squash-';
        $assoc = Auth_OpenID_Association::fromExpiresIn(60, $assoc_handle,
                                                        'sekrit', 'HMAC-SHA1');

        $this->store->storeAssociation($this->dumb_key, $assoc);
        $assoc = $this->signatory->getAssociation($assoc_handle, true);
        $this->assertTrue($assoc);
        $assoc = $this->signatory->getAssociation($assoc_handle, true);
        $this->assertTrue($assoc);
        $this->signatory->invalidate($assoc_handle, true);
        $assoc = $this->signatory->getAssociation($assoc_handle, true);
        $this->assertFalse($assoc);
    }
}

class Tests_Auth_OpenID_Server extends PHPUnit_Framework_TestSuite {

    function getName()
    {
        return "Tests_Auth_OpenID_Server";
    }

    function Tests_Auth_OpenID_Server()
    {
        $this->addTestSuite('Tests_Auth_OpenID_Signatory');
        $this->addTestSuite('Tests_Auth_OpenID_ServerTest');
        if (!defined('Auth_OpenID_NO_MATH_SUPPORT')) {
            $this->addTestSuite('Tests_Auth_OpenID_Associate');
        }
        $this->addTestSuite('Tests_Auth_OpenID_CheckAuth');
        $this->addTestSuite('Tests_Auth_OpenID_CheckIDExtension');
        $this->addTestSuite('Tests_Auth_OpenID_CheckAuth');
        $this->addTestSuite('Tests_Auth_OpenID_SigningEncode');
        $this->addTestSuite('Tests_Auth_OpenID_Test_Encode');
        $this->addTestSuite('Tests_Auth_OpenID_Test_Decode');
        $this->addTestSuite('Tests_Auth_OpenID_Test_ServerError');
        $this->addTestSuite('Tests_Auth_OpenID_CheckID');
    }
}


