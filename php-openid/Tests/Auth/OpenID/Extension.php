<?php

require_once 'Auth/OpenID/Message.php';
require_once 'Auth/OpenID/Extension.php';

class _ExtensionTest_DummyExtension extends Auth_OpenID_Extension {
    var $ns_uri = 'http://an.extension/';
    var $ns_alias = 'dummy';

    function getExtensionArgs()
    {
        return array();
    }
}

class Tests_Auth_OpenID_Extension extends PHPUnit_Framework_TestCase {
    function test_OpenID1()
    {
        $oid1_msg = new Auth_OpenID_Message(Auth_OpenID_OPENID1_NS);
        $ext = new _ExtensionTest_DummyExtension();
        $ext->toMessage($oid1_msg);
        $namespaces = $oid1_msg->namespaces;

        $this->assertTrue($namespaces->isImplicit($ext->ns_uri));
        $this->assertEquals($ext->ns_uri,
                            $namespaces->getNamespaceURI($ext->ns_alias));
        $this->assertEquals($ext->ns_alias,
                            $namespaces->getAlias($ext->ns_uri));
    }

    function test_OpenID2()
    {
        $oid2_msg = new Auth_OpenID_Message(Auth_OpenID_OPENID2_NS);
        $ext = new _ExtensionTest_DummyExtension();
        $ext->toMessage($oid2_msg);
        $namespaces = $oid2_msg->namespaces;
        $this->assertFalse($namespaces->isImplicit($ext->ns_uri));
        $this->assertEquals($ext->ns_uri,
                            $namespaces->getNamespaceURI($ext->ns_alias));
        $this->assertEquals($ext->ns_alias,
                            $namespaces->getAlias($ext->ns_uri));
    }
}

