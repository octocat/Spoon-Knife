<?php

/**
 * Unit tests for the Auth_OpenID_Message implementation.
 */

require_once "Auth/OpenID/Message.php";
require_once "Auth/OpenID.php";

class MessageTest extends PHPUnit_Framework_TestCase {
    function _argTest($ns, $key, $expected = null)
    {
        $a_default = 'a bogus default value';

        $this->assertEquals($this->msg->getArg($ns, $key), $expected);
        if ($expected === null) {
            $this->assertEquals(
                $this->msg->getArg($ns, $key, $a_default), $a_default);
            $result = $this->msg->getArg($ns, $key, Auth_OpenID_NO_DEFAULT);
            $this->assertTrue(Auth_OpenID::isFailure($result));
        } else {
            $this->assertEquals(
                $this->msg->getArg($ns, $key, $a_default), $expected);
            $this->assertEquals(
                $this->msg->getArg($ns, $key, Auth_OpenID_NO_DEFAULT),
                $expected);
        }
    }
}

class Tests_Auth_OpenID_EmptyMessage extends MessageTest {
    function setUp()
    {
        $this->msg = new Auth_OpenID_Message();
    }

    function test_toPostArgs()
    {
        $this->assertEquals($this->msg->toPostArgs(), array());
    }

    function test_toArgs()
    {
        $this->assertEquals($this->msg->toArgs(), array());
    }

    function test_toKVForm()
    {
        $this->assertEquals($this->msg->toKVForm(), '');
    }

    function test_toURLEncoded()
    {
        $this->assertEquals($this->msg->toURLEncoded(), '');
    }

    function test_toURL()
    {
        $base_url = 'http://base.url/';
        $this->assertEquals($this->msg->toURL($base_url), $base_url);
    }

    function test_getOpenID()
    {
        $this->assertEquals($this->msg->getOpenIDNamespace(), null);
    }

    function test_getKeyOpenID()
    {
        $key = $this->msg->getKey(Auth_OpenID_OPENID_NS, 'foo');
        $this->assertTrue(Auth_OpenID::isFailure($key));

        $this->msg->setOpenIDNamespace(Auth_OpenID_OPENID1_NS, false);
        $key = $this->msg->getKey(Auth_OpenID_OPENID_NS, 'foo');
        $this->assertEquals('openid.foo', $key);
    }

    function test_getKeyBARE()
    {
        $this->assertEquals($this->msg->getKey(Auth_OpenID_BARE_NS, 'foo'), 'foo');
    }

    function test_getKeyNS1()
    {
        $this->assertEquals($this->msg->getKey(Auth_OpenID_OPENID1_NS, 'foo'), null);
    }

    function test_getKeyNS2()
    {
        $this->assertEquals($this->msg->getKey(Auth_OpenID_OPENID2_NS, 'foo'), null);
    }

    function test_getKeyNS3()
    {
        $this->assertEquals($this->msg->getKey('urn:nothing-significant', 'foo'),
                               null);
    }

    function test_hasKey()
    {
        $this->assertEquals($this->msg->hasKey(Auth_OpenID_OPENID_NS, 'foo'), false);
    }

    function test_hasKeyBARE()
    {
        $this->assertEquals($this->msg->hasKey(Auth_OpenID_BARE_NS, 'foo'), false);
    }

    function test_hasKeyNS1()
    {
        $this->assertEquals($this->msg->hasKey(Auth_OpenID_OPENID1_NS, 'foo'), false);
    }

    function test_hasKeyNS2()
    {
        $this->assertEquals($this->msg->hasKey(Auth_OpenID_OPENID2_NS, 'foo'), false);
    }

    function test_hasKeyNS3()
    {
        $this->assertEquals($this->msg->hasKey('urn:nothing-significant', 'foo'),
                               false);
    }

    function test_getArg()
    {
        $result = $this->msg->getArg(Auth_OpenID_OPENID_NS, 'foo');
        $this->assertTrue(Auth_OpenID::isFailure($result));
    }

    function test_getArgs()
    {
        $result = $this->msg->getArgs(Auth_OpenID_OPENID_NS);
        $this->assertTrue(Auth_OpenID::isFailure($result));
    }

    function test_getArgsBARE()
    {
        $this->assertEquals($this->msg->getArgs(Auth_OpenID_BARE_NS), array());
    }

    function test_getArgsNS1()
    {
        $this->assertEquals($this->msg->getArgs(Auth_OpenID_OPENID1_NS), array());
    }

    function test_getArgsNS2()
    {
        $this->assertEquals($this->msg->getArgs(Auth_OpenID_OPENID2_NS), array());
    }

    function test_getArgsNS3()
    {
        $this->assertEquals($this->msg->getArgs('urn:nothing-significant'), array());
    }

    function test_updateArgs()
    {
        $result= $this->msg->updateArgs(Auth_OpenID_OPENID_NS,
                                        array('does not' => 'matter'));
        $this->assertTrue(Auth_OpenID::isFailure($result));
    }

    function _test_updateArgsNS($ns)
    {
        $update_args = array(
            'Camper van Beethoven' => 'David Lowery',
            'Magnolia Electric Co.' => 'Jason Molina');

        $this->assertEquals($this->msg->getArgs($ns), array());
        $this->msg->updateArgs($ns, $update_args);
        $this->assertEquals($this->msg->getArgs($ns), $update_args);
    }

    function test_updateArgsBARE()
    {
        $this->_test_updateArgsNS(Auth_OpenID_BARE_NS);
    }

    function test_updateArgsNS1()
    {
        $this->_test_updateArgsNS(Auth_OpenID_OPENID1_NS);
    }

    function test_updateArgsNS2()
    {
        $this->_test_updateArgsNS(Auth_OpenID_OPENID2_NS);
    }

    function test_updateArgsNS3()
    {
        $this->_test_updateArgsNS('urn:nothing-significant');
    }

    function test_setArg()
    {
        $result = $this->msg->setArg(Auth_OpenID_OPENID_NS,
                                     'does not', 'matter');
        $this->assertTrue(Auth_OpenID::isFailure($result));
    }

    function _test_setArgNS($ns)
    {
        $key = 'Camper van Beethoven';
        $value = 'David Lowery';
        $this->assertEquals($this->msg->getArg($ns, $key), null);
        $this->msg->setArg($ns, $key, $value);
        $this->assertEquals($this->msg->getArg($ns, $key), $value);
    }

    function test_setArgBARE()
    {
        $this->_test_setArgNS(Auth_OpenID_BARE_NS);
    }

    function test_setArgNS1()
    {
        $this->_test_setArgNS(Auth_OpenID_OPENID1_NS);
    }

    function test_setArgNS2()
    {
        $this->_test_setArgNS(Auth_OpenID_OPENID2_NS);
    }

    function test_setArgNS3()
    {
        $this->_test_setArgNS('urn:nothing-significant');
    }

    function test_delArg()
    {
        $result = $this->msg->delArg(Auth_OpenID_OPENID_NS, 'does not');
        $this->assertTrue(Auth_OpenID::isFailure($result));
    }

    function _test_delArgNS($ns)
    {
        $key = 'Camper van Beethoven';
        $this->assertEquals($this->msg->delArg($ns, $key), false);
    }

    function test_delArgBARE()
    {
        $this->_test_delArgNS(Auth_OpenID_BARE_NS);
    }

    function test_delArgNS1()
    {
        $this->_test_delArgNS(Auth_OpenID_OPENID1_NS);
    }

    function test_delArgNS2()
    {
        $this->_test_delArgNS(Auth_OpenID_OPENID2_NS);
    }

    function test_delArgNS3()
    {
        $this->_test_delArgNS('urn:nothing-significant');
    }

    function test_isOpenID1()
    {
        $this->assertFalse($this->msg->isOpenID1());
    }

    function test_isOpenID2()
    {
        $this->assertFalse($this->msg->isOpenID2());
    }

    function test_args()
    {
        $this->_argTest(Auth_OpenID_BARE_NS, 'foo');
        $this->_argTest(Auth_OpenID_OPENID1_NS, 'foo');
        $this->_argTest(Auth_OpenID_OPENID2_NS, 'foo');
        $this->_argTest('urn:nothing-significant', 'foo');
    }
}

class Tests_Auth_OpenID_OpenID1Message extends MessageTest {
    function setUp()
    {
        $this->msg = Auth_OpenID_Message::fromPostArgs(array('openid.mode' => 'error',
                                                             'openid.error' => 'unit test'));
    }

    function test_toPostArgs()
    {
        $this->assertEquals($this->msg->toPostArgs(),
                               array('openid.mode' => 'error',
                                     'openid.error' => 'unit test'));
    }

    function test_toArgs()
    {
        $this->assertEquals($this->msg->toArgs(),
                               array('mode' => 'error',
                                     'error' => 'unit test'));
    }

    function test_toKVForm()
    {
        $this->assertEquals($this->msg->toKVForm(),
                            "error:unit test\nmode:error\n");
    }

    function test_toURLEncoded()
    {
        $this->assertEquals($this->msg->toURLEncoded(),
                               'openid.error=unit+test&openid.mode=error');
    }

    function test_toURL()
    {
        $base_url = 'http://base.url/';
        $actual = $this->msg->toURL($base_url);
        $actual_base = substr($actual, 0, strlen($base_url));
        $this->assertEquals($actual_base, $base_url);
        $this->assertEquals($actual[strlen($base_url)], '?');
        $query = substr($actual, strlen($base_url) + 1);

        $parsed = Auth_OpenID::parse_str($query);

        $this->assertEquals($parsed, array('openid.mode' => 'error',
                                           'openid.error' => 'unit test'));
    }

    function test_getOpenID()
    {
        $this->assertEquals($this->msg->getOpenIDNamespace(),
                               Auth_OpenID_OPENID1_NS);
        $this->assertTrue($this->msg->namespaces->isImplicit(Auth_OpenID_OPENID1_NS));
    }

    function test_getKeyOpenID()
    {
        $this->assertEquals($this->msg->getKey(Auth_OpenID_OPENID_NS, 'mode'),
                               'openid.mode');
    }

    function test_getKeyBARE()
    {
        $this->assertEquals($this->msg->getKey(Auth_OpenID_BARE_NS, 'mode'), 'mode');
    }

    function test_getKeyNS1()
    {
        $this->assertEquals(
                               $this->msg->getKey(Auth_OpenID_OPENID1_NS, 'mode'), 'openid.mode');
    }

    function test_getKeyNS2()
    {
        $this->assertEquals($this->msg->getKey(Auth_OpenID_OPENID2_NS, 'mode'), null);
    }

    function test_getKeyNS3()
    {
        $this->assertEquals(
                               $this->msg->getKey('urn:nothing-significant', 'mode'), null);
    }

    function test_hasKey()
    {
        $this->assertEquals($this->msg->hasKey(Auth_OpenID_OPENID_NS, 'mode'), true);
    }

    function test_hasKeyBARE()
    {
        $this->assertEquals($this->msg->hasKey(Auth_OpenID_BARE_NS, 'mode'), false);
    }

    function test_hasKeyNS1()
    {
        $this->assertEquals($this->msg->hasKey(Auth_OpenID_OPENID1_NS, 'mode'), true);
    }

    function test_hasKeyNS2()
    {
        $this->assertEquals(
                               $this->msg->hasKey(Auth_OpenID_OPENID2_NS, 'mode'), false);
    }

    function test_hasKeyNS3()
    {
        $this->assertEquals(
                               $this->msg->hasKey('urn:nothing-significant', 'mode'), false);
    }

    function test_getArgs()
    {
        $this->assertEquals($this->msg->getArgs(Auth_OpenID_OPENID_NS),
                               array('mode' => 'error',
                                     'error' => 'unit test'));
    }

    function test_getArgsBARE()
    {
        $this->assertEquals($this->msg->getArgs(Auth_OpenID_BARE_NS), array());
    }

    function test_getArgsNS1()
    {
        $this->assertEquals($this->msg->getArgs(Auth_OpenID_OPENID1_NS),
                               array('mode' => 'error',
                                     'error' => 'unit test'));
    }

    function test_getArgsNS2()
    {
        $this->assertEquals($this->msg->getArgs(Auth_OpenID_OPENID2_NS), array());
    }

    function test_getArgsNS3()
    {
        $this->assertEquals($this->msg->getArgs('urn:nothing-significant'), array());
    }

    function _test_updateArgsNS($ns, $before=null)
    {
        if ($before === null) {
            $before = array();
        }

        $update_args = array(
                             'Camper van Beethoven' => 'David Lowery',
                             'Magnolia Electric Co.' => 'Jason Molina');

        $this->assertEquals($this->msg->getArgs($ns), $before);
        $this->msg->updateArgs($ns, $update_args);
        $after = $before;
        $after = array_merge($after, $update_args);
        $this->assertEquals($this->msg->getArgs($ns), $after);
    }

    function test_updateArgs()
    {
        $this->_test_updateArgsNS(Auth_OpenID_OPENID_NS,
                                  array('mode' => 'error', 'error' => 'unit test'));
    }

    function test_updateArgsBARE()
    {
        $this->_test_updateArgsNS(Auth_OpenID_BARE_NS);
    }

    function test_updateArgsNS1()
    {
        $this->_test_updateArgsNS(Auth_OpenID_OPENID1_NS,
                                  array('mode' => 'error', 'error' => 'unit test'));
    }

    function test_updateArgsNS2()
    {
        $this->_test_updateArgsNS(Auth_OpenID_OPENID2_NS);
    }

    function test_updateArgsNS3()
    {
        $this->_test_updateArgsNS('urn:nothing-significant');
    }

    function _test_setArgNS($ns)
    {
        $key = 'Camper van Beethoven';
        $value = 'David Lowery';
        $this->assertEquals($this->msg->getArg($ns, $key), null);
        $this->msg->setArg($ns, $key, $value);
        $this->assertEquals($this->msg->getArg($ns, $key), $value);
    }

    function test_setArg()
    {
        $this->_test_setArgNS(Auth_OpenID_OPENID_NS);
    }

    function test_setArgBARE()
    {
        $this->_test_setArgNS(Auth_OpenID_BARE_NS);
    }

    function test_setArgNS1()
    {
        $this->_test_setArgNS(Auth_OpenID_OPENID1_NS);
    }

    function test_setArgNS2()
    {
        $this->_test_setArgNS(Auth_OpenID_OPENID2_NS);
    }

    function test_setArgNS3()
    {
        $this->_test_setArgNS('urn:nothing-significant');
    }

    function _test_delArgNS($ns)
    {
        $key = 'Camper van Beethoven';
        $value = 'David Lowery';

        $this->assertEquals($this->msg->delArg($ns, $key), false);
        $this->msg->setArg($ns, $key, $value);
        $this->assertEquals($this->msg->getArg($ns, $key), $value);
        $this->msg->delArg($ns, $key);
        $this->assertEquals($this->msg->getArg($ns, $key), null);
    }

    function test_delArg()
    {
        $this->_test_delArgNS(Auth_OpenID_OPENID_NS);
    }

    function test_delArgBARE()
    {
        $this->_test_delArgNS(Auth_OpenID_BARE_NS);
    }

    function test_delArgNS1()
    {
        $this->_test_delArgNS(Auth_OpenID_OPENID1_NS);
    }

    function test_delArgNS2()
    {
        $this->_test_delArgNS(Auth_OpenID_OPENID2_NS);
    }

    function test_delArgNS3()
    {
        $this->_test_delArgNS('urn:nothing-significant');
    }

    function test_isOpenID1()
    {
        $this->assertTrue($this->msg->isOpenID1());
    }

    function test_isOpenID2()
    {
        $this->assertFalse($this->msg->isOpenID2());
    }

    function test_args()
    {
        $this->_argTest(Auth_OpenID_BARE_NS, 'mode');
        $this->_argTest(Auth_OpenID_OPENID_NS, 'mode', 'error');
        $this->_argTest(Auth_OpenID_OPENID1_NS, 'mode', 'error');
        $this->_argTest(Auth_OpenID_OPENID2_NS, 'mode');
        $this->_argTest('urn:nothing-significant', 'mode');
    }
}

class Tests_Auth_OpenID_OpenID1ExplicitMessage extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->msg = Auth_OpenID_Message::fromPostArgs(array('openid.mode' => 'error',
                                                             'openid.error' => 'unit test',
                                                             'openid.ns' => Auth_OpenID_OPENID1_NS));
    }

    function test_isOpenID1()
    {
        $this->assertTrue($this->msg->isOpenID1());
        $this->assertFalse(
            $this->msg->namespaces->isImplicit(Auth_OpenID_OPENID1_NS));
    }

    function test_isOpenID2()
    {
        $this->assertFalse($this->msg->isOpenID2());
    }

    function test_toPostArgs()
    {
        $this->assertEquals($this->msg->toPostArgs(),
                               array('openid.mode' => 'error',
                                     'openid.error' => 'unit test',
                                     'openid.ns' => Auth_OpenID_OPENID1_NS));
    }

    function test_toArgs()
    {
        $this->assertEquals($this->msg->toArgs(),
                               array('mode' => 'error',
                                     'error' => 'unit test',
                                     'ns' => Auth_OpenID_OPENID1_NS));
    }

    function test_toKVForm()
    {
        $this->assertEquals($this->msg->toKVForm(),
                            "error:unit test\nmode:error\nns:".
                            Auth_OpenID_OPENID1_NS."\n");
    }

    function test_toURLEncoded()
    {
        $this->assertEquals($this->msg->toURLEncoded(),
                               'openid.error=unit+test&openid.mode=error&openid.ns=http%3A%2F%2Fopenid.net%2Fsignon%2F1.0');
    }

    function test_toURL()
    {
        $base_url = 'http://base.url/';
        $actual = $this->msg->toURL($base_url);
        $actual_base = substr($actual, 0, strlen($base_url));
        $this->assertEquals($actual_base, $base_url);
        $this->assertEquals($actual[strlen($base_url)], '?');
        $query = substr($actual, strlen($base_url) + 1);

        $parsed = Auth_OpenID::parse_str($query);

        $this->assertEquals($parsed, array('openid.mode' => 'error',
                                           'openid.error' => 'unit test',
                                           'openid.ns' => Auth_OpenID_OPENID1_NS));
    }
}

class Tests_Auth_OpenID_OpenID2Message extends MessageTest {
    function setUp()
    {
        $this->msg = Auth_OpenID_Message::fromPostArgs(array('openid.mode' => 'error',
                                                             'openid.error' => 'unit test',
                                                             'openid.ns' => Auth_OpenID_OPENID2_NS));
        $this->msg->setArg(Auth_OpenID_BARE_NS, "xey", "value");
    }

    function test_toPostArgs()
    {
        $this->assertEquals($this->msg->toPostArgs(),
                            array('openid.mode' => 'error',
                                  'openid.error' => 'unit test',
                                  'openid.ns' => Auth_OpenID_OPENID2_NS,
                                  'xey' => 'value'));
    }

    function test_toArgs()
    {
        // This method can't tolerate BARE_NS.
        $this->msg->delArg(Auth_OpenID_BARE_NS, "xey");
        $this->assertEquals($this->msg->toArgs(),
                               array('mode' => 'error',
                                     'error' => 'unit test',
                                     'ns' => Auth_OpenID_OPENID2_NS));
    }

    function test_toKVForm()
    {
        // Can't tolerate BARE_NS in kvform
        $this->msg->delArg(Auth_OpenID_BARE_NS, "xey");
        $this->assertEquals($this->msg->toKVForm(),
                               sprintf("error:unit test\nmode:error\nns:%s\n",
                                       Auth_OpenID_OPENID2_NS));
    }

    function _test_urlencoded($s)
    {
        $expected = 'openid.error=unit+test&openid.mode=error&' .
            'openid.ns=%s&xey=value';

        $expected = sprintf($expected, urlencode(Auth_OpenID_OPENID2_NS));
        $this->assertEquals($s, $expected);
    }

    function test_toURLEncoded()
    {
        $this->_test_urlencoded($this->msg->toURLEncoded());
    }

    function test_toURL()
    {
        $base_url = 'http://base.url/';
        $actual = $this->msg->toURL($base_url);
        $actual_base = substr($actual, 0, strlen($base_url));

        $this->assertEquals($actual_base, $base_url);
        $this->assertEquals($actual[strlen($base_url)], '?');
        $query = substr($actual, strlen($base_url) + 1);
        $this->_test_urlencoded($query);
    }

    function test_getOpenID()
    {
        $this->assertEquals($this->msg->getOpenIDNamespace(),
                               Auth_OpenID_OPENID2_NS);
    }

    function test_getKeyOpenID()
    {
        $this->assertEquals($this->msg->getKey(Auth_OpenID_OPENID_NS, 'mode'),
                               'openid.mode');
    }

    function test_getKeyBARE()
    {
        $this->assertEquals($this->msg->getKey(Auth_OpenID_BARE_NS, 'mode'), 'mode');
    }

    function test_getKeyNS1()
    {
        $this->assertEquals(
                               $this->msg->getKey(Auth_OpenID_OPENID1_NS, 'mode'), null);
    }

    function test_getKeyNS2()
    {
        $this->assertEquals(
                               $this->msg->getKey(Auth_OpenID_OPENID2_NS, 'mode'), 'openid.mode');
    }

    function test_getKeyNS3()
    {
        $this->assertEquals(
                               $this->msg->getKey('urn:nothing-significant', 'mode'), null);
    }

    function test_hasKeyOpenID()
    {
        $this->assertEquals($this->msg->hasKey(Auth_OpenID_OPENID_NS, 'mode'), true);
    }

    function test_hasKeyBARE()
    {
        $this->assertEquals($this->msg->hasKey(Auth_OpenID_BARE_NS, 'mode'), false);
    }

    function test_hasKeyNS1()
    {
        $this->assertEquals(
                               $this->msg->hasKey(Auth_OpenID_OPENID1_NS, 'mode'), false);
    }

    function test_hasKeyNS2()
    {
        $this->assertEquals(
                               $this->msg->hasKey(Auth_OpenID_OPENID2_NS, 'mode'), true);
    }

    function test_hasKeyNS3()
    {
        $this->assertEquals(
                               $this->msg->hasKey('urn:nothing-significant', 'mode'), false);
    }

    function test_getArgsOpenID()
    {
        $this->assertEquals($this->msg->getArgs(Auth_OpenID_OPENID_NS),
                               array('mode' => 'error',
                                     'error' => 'unit test'));
    }

    function test_getArgsBARE()
    {
        $this->assertEquals($this->msg->getArgs(Auth_OpenID_BARE_NS),
                               array('xey' =>  'value'));
    }

    function test_getArgsNS1()
    {
        $this->assertEquals($this->msg->getArgs(Auth_OpenID_OPENID1_NS), array());
    }

    function test_getArgsNS2()
    {
        $this->assertEquals($this->msg->getArgs(Auth_OpenID_OPENID2_NS),
                               array('mode' => 'error',
                                     'error' => 'unit test'));
    }

    function test_getArgsNS3()
    {
        $this->assertEquals($this->msg->getArgs('urn:nothing-significant'), array());
    }

    function _test_updateArgsNS($ns, $before=null)
    {
        if ($before === null) {
            $before = array();
        }

        $update_args = array(
            'Camper van Beethoven' => 'David Lowery',
            'Magnolia Electric Co.' => 'Jason Molina');

        $this->assertEquals($this->msg->getArgs($ns), $before);
        $this->msg->updateArgs($ns, $update_args);
        $after = $before;
        $after = array_merge($after, $update_args);
        $this->assertEquals($this->msg->getArgs($ns), $after);
    }

    function test_updateArgsOpenID()
    {
        $this->_test_updateArgsNS(Auth_OpenID_OPENID_NS,
                                  array('mode' => 'error', 'error' => 'unit test'));
    }

    function test_updateArgsBARE()
    {
        $this->_test_updateArgsNS(Auth_OpenID_BARE_NS,
                                  array('xey' => 'value'));
    }

    function test_updateArgsNS1()
    {
        $this->_test_updateArgsNS(Auth_OpenID_OPENID1_NS);
    }

    function test_updateArgsNS2()
    {
        $this->_test_updateArgsNS(Auth_OpenID_OPENID2_NS,
                                  array('mode' => 'error', 'error' => 'unit test'));
    }

    function test_updateArgsNS3()
    {
        $this->_test_updateArgsNS('urn:nothing-significant');
    }

    function _test_setArgNS($ns)
    {
        $key = 'Camper van Beethoven';
        $value = 'David Lowery';
        $this->assertEquals($this->msg->getArg($ns, $key), null);
        $this->msg->setArg($ns, $key, $value);
        $this->assertEquals($this->msg->getArg($ns, $key), $value);
    }

    function test_setArgOpenID()
    {
        $this->_test_setArgNS(Auth_OpenID_OPENID_NS);
    }

    function test_setArgBARE()
    {
        $this->_test_setArgNS(Auth_OpenID_BARE_NS);
    }

    function test_setArgNS1()
    {
        $this->_test_setArgNS(Auth_OpenID_OPENID1_NS);
    }

    function test_setArgNS2()
    {
        $this->_test_setArgNS(Auth_OpenID_OPENID2_NS);
    }

    function test_setArgNS3()
    {
        $this->_test_setArgNS('urn:nothing-significant');
    }

    function test_badAlias()
    {
        // Make sure dotted aliases and OpenID protocol fields are not
        // allowed as namespace aliases.

        global $Auth_OpenID_OPENID_PROTOCOL_FIELDS;

        $all = array_merge($Auth_OpenID_OPENID_PROTOCOL_FIELDS, array('dotted.alias'));

        foreach ($all as $f) {
            $args = array(sprintf('openid.ns.%s', $f) => 'blah',
                          sprintf('openid.%s.foo', $f) =>  'test');

            // .fromPostArgs covers .fromPostArgs, .fromOpenIDArgs,
            // ._fromOpenIDArgs, and .fromOpenIDArgs (since it calls
            // .fromPostArgs).  Python code raises AssertionError, but
            // we usually return null for bad things in PHP.
            $this->assertEquals($this->msg->fromPostArgs($args), null);
        }
    }

    function _test_delArgNS($ns)
    {
        $key = 'Camper van Beethoven';
        $value = 'David Lowery';

        $this->assertEquals($this->msg->delArg($ns, $key), false);
        $this->msg->setArg($ns, $key, $value);
        $this->assertEquals($this->msg->getArg($ns, $key), $value);
        $this->msg->delArg($ns, $key);
        $this->assertEquals($this->msg->getArg($ns, $key), null);
    }

    function test_delArgOpenID()
    {
        $this->_test_delArgNS(Auth_OpenID_OPENID_NS);
    }

    function test_delArgBARE()
    {
        $this->_test_delArgNS(Auth_OpenID_BARE_NS);
    }

    function test_delArgNS1()
    {
        $this->_test_delArgNS(Auth_OpenID_OPENID1_NS);
    }

    function test_delArgNS2()
    {
        $this->_test_delArgNS(Auth_OpenID_OPENID2_NS);
    }

    function test_delArgNS3()
    {
        $this->_test_delArgNS('urn:nothing-significant');
    }

    function test_overwriteExtensionArg()
    {
        $ns = 'urn:unittest_extension';
        $key = 'mykey';
        $value_1 = 'value_1';
        $value_2 = 'value_2';

        $this->msg->setArg($ns, $key, $value_1);
        $this->assertTrue($this->msg->getArg($ns, $key) == $value_1);
        $this->msg->setArg($ns, $key, $value_2);
        $this->assertTrue($this->msg->getArg($ns, $key) == $value_2);
    }

    function test_argList()
    {
        $this->assertEquals($this->msg->fromPostArgs(array('arg' => array(1, 2, 3))),
                            null);
    }

    function test_isOpenID1()
    {
        $this->assertFalse($this->msg->isOpenID1());
    }

    function test_isOpenID2()
    {
        $this->assertTrue($this->msg->isOpenID2());
    }

    function test_args()
    {
        $this->_argTest(Auth_OpenID_BARE_NS, 'mode');
        $this->_argTest(Auth_OpenID_OPENID_NS, 'mode', 'error');
        $this->_argTest(Auth_OpenID_OPENID1_NS, 'mode');
        $this->_argTest(Auth_OpenID_OPENID2_NS, 'mode', 'error');
        $this->_argTest('urn:nothing-significant', 'mode');
    }
}

class Tests_Auth_OpenID_GeneralMessageTest extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->postargs = array(
            'openid.ns' => Auth_OpenID_OPENID2_NS,
            'openid.mode' => 'checkid_setup',
            'openid.identity' => 'http://bogus.example.invalid:port/',
            'openid.assoc_handle' => 'FLUB',
            'openid.return_to' => 'Neverland');

        $this->action_url = 'scheme://host:port/path?query';

        $this->form_tag_attrs = array(
            'company' => 'janrain',
            'class' => 'fancyCSS');

        $this->submit_text = 'GO!';

        // Expected data regardless of input

        $this->required_form_attrs = array(
            'accept-charset' => 'UTF-8',
            'enctype' => 'application/x-www-form-urlencoded',
            'method' => 'post');
    }

    function _checkForm($html, $message_, $action_url,
                        $form_tag_attrs, $submit_text)
    {
        $parser = Auth_Yadis_getXMLParser();

        // Parse HTML source
        $this->assertTrue($parser->init($html, array()));

        // Get root element
        $form = $parser->evalXPath('/form[1]');
        $this->assertTrue(count($form) == 1);
        $form = $form[0];

        // Check required form attributes
        $form_attrs = $parser->attributes($form);
        foreach ($this->required_form_attrs as $k => $v) {
            $this->assertTrue($form_attrs[$k] == $v);
        }

        // Check extra form attributes
        foreach ($form_tag_attrs as $k => $v) {
            // Skip attributes that already passed the required
            // attribute check, since they should be ignored by the
            // form generation code.
            if (in_array($k, array_keys($this->required_form_attrs))) {
                continue;
            }

            $this->assertTrue($form_attrs[$k] == $v,
                              "Form attr $k is ".$form_attrs[$k]." (expected $v)");
        }

        // Check hidden fields against post args
        $hiddens = array();
        $input_elements = $parser->evalXPath('input', $form);
        foreach ($input_elements as $e) {
            $attrs = $parser->attributes($e);
            if (strtoupper($attrs['type']) == 'HIDDEN') {
                $hiddens[] = $e;
            }
        }

        // For each post arg, make sure there is a hidden with that
        // value.  Make sure there are no other hiddens.
        $postargs = $message_->toPostArgs();
        foreach ($postargs as $name => $value) {
            $found = false;

            foreach ($hiddens as $e) {
                $attrs = $parser->attributes($e);
                if ($attrs['name'] == $name) {
                    $this->assertTrue($attrs['value'] == $value);
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                $this->fail("Post arg $name not found in form");
            }
        }

        $keys = array_keys($postargs);
        foreach ($hiddens as $e) {
            $attrs = $parser->attributes($e);
            $this->assertTrue(in_array($attrs['name'], $keys));
        }

        // Check action URL
        $this->assertTrue($form_attrs['action'] == $action_url);

        // Check submit text
        $submits = array();
        foreach ($input_elements as $e) {
            $attrs = $parser->attributes($e);
            if (strtoupper($attrs['type']) == 'SUBMIT') {
                $submits[] = $e;
            }
        }

        $this->assertTrue(count($submits) == 1);

        $attrs = $parser->attributes($submits[0]);
        $this->assertTrue($attrs['value'] == $submit_text);
    }

    function test_toFormMarkup()
    {
        $m = Auth_OpenID_Message::fromPostArgs($this->postargs);
        $html = $m->toFormMarkup($this->action_url, $this->form_tag_attrs,
                                 $this->submit_text);
        $this->_checkForm($html, $m, $this->action_url,
                          $this->form_tag_attrs, $this->submit_text);
    }

    function test_overrideMethod()
    {
        // Be sure that caller cannot change form method to GET.
        $m = Auth_OpenID_Message::fromPostArgs($this->postargs);

        $tag_attrs = $this->form_tag_attrs;
        $tag_attrs['method'] = 'GET';

        $html = $m->toFormMarkup($this->action_url, $this->form_tag_attrs,
                                 $this->submit_text);
        $this->_checkForm($html, $m, $this->action_url,
                          $this->form_tag_attrs, $this->submit_text);
    }

    function test_overrideRequired()
    {
        // Be sure that caller CANNOT change the form charset for
        // encoding type.
        $m = Auth_OpenID_Message::fromPostArgs($this->postargs);

        $tag_attrs = $this->form_tag_attrs;
        $tag_attrs['accept-charset'] = 'UCS4';
        $tag_attrs['enctype'] = 'invalid/x-broken';

        $html = $m->toFormMarkup($this->action_url, $tag_attrs,
                                 $this->submit_text);
        $this->_checkForm($html, $m, $this->action_url,
                          $tag_attrs, $this->submit_text);
    }

    function test_setOpenIDNamespace_invalid()
    {
        $m = new Auth_OpenID_Message();
        $invalid_things = array(
            // Empty string is not okay here.
            '',
            // Good guess!  But wrong.
            'http://openid.net/signon/2.0',
            // What?
            'http://specs%\\\r2Eopenid.net/auth/2.0',
            // Too much escapings!
            'http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0',
            // This is a Type URI, not a openid.ns value.
            'http://specs.openid.net/auth/2.0/signon',
            );

        foreach ($invalid_things as $x) {
            $this->assertTrue($m->setOpenIDNamespace($x, true) === false);
        }
    }

    function test_isOpenID1()
    {
        $v1_namespaces = array(
            // Yes, there are two of them.
            'http://openid.net/signon/1.1',
            'http://openid.net/signon/1.0',
                               );

        foreach ($v1_namespaces as $ns) {
            $m = new Auth_OpenID_Message($ns);
            $this->assertTrue($m->isOpenID1(),
                              "$ns not recognized as OpenID 1");
            $this->assertEquals($ns, $m->getOpenIDNamespace());
            $this->assertTrue($m->namespaces->isImplicit($ns));
        }
    }

    function test_isOpenID2()
    {
        $ns = 'http://specs.openid.net/auth/2.0';
        $m = new Auth_OpenID_Message($ns);
        $this->assertTrue($m->isOpenID2());
        $this->assertFalse(
            $m->namespaces->isImplicit(Auth_OpenID_NULL_NAMESPACE));
        $this->assertEquals($ns, $m->getOpenIDNamespace());
    }

    function test_setOpenIDNamespace_explicit()
    {
        $m = new Auth_OpenID_Message();
        $m->setOpenIDNamespace(Auth_OpenID_THE_OTHER_OPENID1_NS, false);
        $this->assertFalse($m->namespaces->isImplicit(
            Auth_OpenID_THE_OTHER_OPENID1_NS));
    }

    function test_setOpenIDNamespace_implicit()
    {
        $m = new Auth_OpenID_Message();
        $m->setOpenIDNamespace(Auth_OpenID_THE_OTHER_OPENID1_NS, true);
        $this->assertTrue(
            $m->namespaces->isImplicit(Auth_OpenID_THE_OTHER_OPENID1_NS));
    }


    function test_explicitOpenID11NSSerialzation()
    {
        $m = new Auth_OpenID_Message();
        $m->setOpenIDNamespace(Auth_OpenID_THE_OTHER_OPENID1_NS, false);

        $post_args = $m->toPostArgs();
        $this->assertEquals($post_args,
                            array('openid.ns' =>
                                  Auth_OpenID_THE_OTHER_OPENID1_NS));
    }

    function test_fromPostArgs_ns11()
    {
        // An example of the stuff that some Drupal installations send us,
        // which includes openid.ns but is 1.1.
        $query = array(
            'openid.assoc_handle' => '',
            'openid.claimed_id' => 'http://foobar.invalid/',
            'openid.identity' => 'http://foobar.myopenid.com',
            'openid.mode' => 'checkid_setup',
            'openid.ns' => 'http://openid.net/signon/1.1',
            'openid.ns.sreg' => 'http://openid.net/extensions/sreg/1.1',
            'openid.return_to' => 'http://drupal.invalid/return_to',
            'openid.sreg.required' => 'nickname,email',
            'openid.trust_root' => 'http://drupal.invalid',
            );
        $m = Auth_OpenID_Message::fromPostArgs($query);
        $this->assertTrue($m->isOpenID1());
    }
}

class Tests_Auth_OpenID_NamespaceMap extends PHPUnit_Framework_TestCase {
    function test_onealias()
    {
        $nsm = new Auth_OpenID_NamespaceMap();
        $uri = 'http://example.com/foo';
        $alias = "foo";
        $nsm->addAlias($uri, $alias);
        $this->assertTrue($nsm->getNamespaceURI($alias) == $uri);
        $this->assertTrue($nsm->getAlias($uri) == $alias);
    }

    function test_iteration()
    {
        $nsm = new Auth_OpenID_NamespaceMap();
        $uripat = 'http://example.com/foo%d';

        $nsm->add(sprintf($uripat, 0));

        for ($n = 1; $n < 23; $n++) {
            $this->assertTrue($nsm->contains(sprintf($uripat, $n - 1)));
            $this->assertTrue($nsm->isDefined(sprintf($uripat, $n - 1)));
            $nsm->add(sprintf($uripat, $n));
        }

        foreach ($nsm->iteritems() as $pair) {
            list($uri, $alias) = $pair;
            $this->assertTrue('ext'.substr($uri, 22) == $alias);
        }

        $it = $nsm->iterAliases();
        $this->assertTrue(count($it) == 23);

        $it = $nsm->iterNamespaceURIs();
        $this->assertTrue(count($it) == 23);
    }
}

class Tests_Auth_OpenID_Message extends PHPUnit_Framework_TestCase {
}

global $Tests_Auth_OpenID_Message_other;
$Tests_Auth_OpenID_Message_other = array(
                                         new Tests_Auth_OpenID_EmptyMessage(),
                                         new Tests_Auth_OpenID_OpenID1Message(),
                                         new Tests_Auth_OpenID_OpenID2Message(),
                                         new Tests_Auth_OpenID_NamespaceMap(),
                                         new Tests_Auth_OpenID_OpenID1ExplicitMessage(),
                                         new Tests_Auth_OpenID_GeneralMessageTest()
                                         );


