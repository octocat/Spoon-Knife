<?php

/*
 * Unit tests for verification of return_to URLs for a realm.
 */

require_once 'Auth/OpenID/Discover.php';
require_once 'Auth/OpenID/TrustRoot.php';

require_once 'Auth/Yadis/Yadis.php';

/*
 * Tests for building the discovery URL from a realm and a return_to
 * URL
 */
class Tests_Auth_OpenID_BuildDiscoveryURL extends PHPUnit_Framework_TestCase {
    /*
     * Build a discovery URL out of the realm and a return_to and make
     * sure that it matches the expected discovery URL
     */
    function failUnlessDiscoURL($realm, $expected_discovery_url)
    {
        $actual_discovery_url = Auth_OpenID_TrustRoot::buildDiscoveryURL($realm);
        $this->assertEquals($expected_discovery_url, $actual_discovery_url);
    }

    /*
     * There is no wildcard and the realm is the same as the return_to
     * URL
     */
    function test_trivial()
    {
        $this->failUnlessDiscoURL('http://example.com/foo',
                                  'http://example.com/foo');
    }

    /*
     * There is a wildcard
     */
    function test_wildcard()
    {
        $this->failUnlessDiscoURL('http://*.example.com/foo',
                                  'http://www.example.com/foo');
    }
}

class _MockDiscover {
    function _MockDiscover($data) {
        $this->data =& $data;
    }

    function mockDiscover($uri, $fetcher, $discover_function=null)
    {
        $result = new Auth_Yadis_DiscoveryResult($uri);
        $result->response_text = $this->data;
        $result->normalized_uri = $uri;
        return $result;
    }
}

class Tests_Auth_OpenID_ExtractReturnToURLs extends PHPUnit_Framework_TestCase {
    var $disco_url = 'http://example.com/';

    function failUnlessXRDSHasReturnURLs($data, $expected_return_urls)
    {
        $discover_object = new _MockDiscover($data);
        $actual_return_urls = Auth_OpenID_getAllowedReturnURLs($this->disco_url, null, array($discover_object, 'mockDiscover'));

        $this->assertEquals($expected_return_urls, $actual_return_urls);
    }

    function failUnlessDiscoveryFailure($text)
    {
        $discover_object = new _MockDiscover($text);
        $this->assertFalse(Auth_OpenID_getAllowedReturnURLs($this->disco_url, null, array($discover_object, 'mockDiscover')));
    }

    function test_empty()
    {
        $this->failUnlessDiscoveryFailure('');
    }

    function test_badXML()
    {
        $this->failUnlessDiscoveryFailure('>');
    }

    function test_noEntries()
    {
        $this->failUnlessXRDSHasReturnURLs('<?xml version="1.0" encoding="UTF-8"?>
<xrds:XRDS xmlns:xrds="xri://$xrds"
           xmlns="xri://$xrd*($v*2.0)"
           >
  <XRD>
  </XRD>
</xrds:XRDS>
', array());
    }

    function test_noReturnToEntries()
    {
        $this->failUnlessXRDSHasReturnURLs('<?xml version="1.0" encoding="UTF-8"?>
<xrds:XRDS xmlns:xrds="xri://$xrds"
           xmlns="xri://$xrd*($v*2.0)"
           >
  <XRD>
    <Service priority="10">
      <Type>http://specs.openid.net/auth/2.0/server</Type>
      <URI>http://www.myopenid.com/server</URI>
    </Service>
  </XRD>
</xrds:XRDS>
', array());
    }

    function test_oneEntry()
    {
        $this->failUnlessXRDSHasReturnURLs('<?xml version="1.0" encoding="UTF-8"?>
<xrds:XRDS xmlns:xrds="xri://$xrds"
           xmlns="xri://$xrd*($v*2.0)"
           >
  <XRD>
    <Service>
      <Type>http://specs.openid.net/auth/2.0/return_to</Type>
      <URI>http://rp.example.com/return</URI>
    </Service>
  </XRD>
</xrds:XRDS>
', array('http://rp.example.com/return'));
    }

    function test_twoEntries()
    {
        $this->failUnlessXRDSHasReturnURLs('<?xml version="1.0" encoding="UTF-8"?>
<xrds:XRDS xmlns:xrds="xri://$xrds"
           xmlns="xri://$xrd*($v*2.0)"
           >
  <XRD>
    <Service priority="0">
      <Type>http://specs.openid.net/auth/2.0/return_to</Type>
      <URI>http://rp.example.com/return</URI>
    </Service>
    <Service priority="1">
      <Type>http://specs.openid.net/auth/2.0/return_to</Type>
      <URI>http://other.rp.example.com/return</URI>
    </Service>
  </XRD>
</xrds:XRDS>
', array('http://rp.example.com/return',
         'http://other.rp.example.com/return'));
    }

    function test_twoEntries_withOther()
    {
        $this->failUnlessXRDSHasReturnURLs('<?xml version="1.0" encoding="UTF-8"?>
<xrds:XRDS xmlns:xrds="xri://$xrds"
           xmlns="xri://$xrd*($v*2.0)"
           >
  <XRD>
    <Service priority="0">
      <Type>http://specs.openid.net/auth/2.0/return_to</Type>
      <URI>http://rp.example.com/return</URI>
    </Service>
    <Service priority="1">
      <Type>http://specs.openid.net/auth/2.0/return_to</Type>
      <URI>http://other.rp.example.com/return</URI>
    </Service>
    <Service priority="0">
      <Type>http://example.com/LOLCATS</Type>
      <URI>http://example.com/invisible+uri</URI>
    </Service>
  </XRD>
</xrds:XRDS>
', array('http://rp.example.com/return',
         'http://other.rp.example.com/return'));
    }
}

class Tests_Auth_OpenID_ReturnToMatches extends PHPUnit_Framework_TestCase {
    function test_noEntries()
    {
        $this->assertFalse(Auth_OpenID_returnToMatches(array(), 'anything'));
    }

    function test_exactMatch()
    {
        $r = 'http://example.com/return.to';
        $this->assertTrue(Auth_OpenID_returnToMatches(array($r), $r));
    }

    function test_garbageMatch()
    {
        $r = 'http://example.com/return.to';
        $this->assertTrue(Auth_OpenID_returnToMatches(
                   array('This is not a URL at all. In fact, it has characters, ' .
                         'like "<" that are not allowed in URLs', $r), $r));
    }

    function test_descendant()
    {
        $r = 'http://example.com/return.to';
        $this->assertTrue(Auth_OpenID_returnToMatches(array($r),
            'http://example.com/return.to/user:joe'));
    }

    function test_wildcard()
    {
        $this->assertFalse(Auth_OpenID_returnToMatches(
                                array('http://*.example.com/return.to'),
                                'http://example.com/return.to'));
    }

    function test_noMatch()
    {
        $r = 'http://example.com/return.to';
        $this->assertFalse(Auth_OpenID_returnToMatches(array($r),
            'http://example.com/xss_exploit'));
    }
}

class Verifier {
    function Verifier($test_case, $return_to)
    {
        $this->tc =& $test_case;
        $this->return_to = $return_to;
    }

    function verify($disco_url)
    {
        $this->tc->assertEquals('http://www.example.com/', $disco_url);

        if ($this->return_to === false) {
            return false;
        } else {
            return array($this->return_to);
        }
    }
}

class Tests_Auth_OpenID_VerifyReturnTo extends PHPUnit_Framework_TestCase {

    function test_bogusRealm()
    {
        $this->assertFalse(Auth_OpenID_verifyReturnTo('', 'http://example.com/', null));
    }

    function test_verifyWithDiscoveryCalled()
    {
        $realm = 'http://*.example.com/';
        $return_to = 'http://www.example.com/foo';

        $v = new Verifier($this, $return_to);

        $this->assertTrue(Auth_OpenID_verifyReturnTo($realm, $return_to, null, array($v, 'verify')));
    }

    function test_verifyFailWithDiscoveryCalled()
    {
        $realm = 'http://*.example.com/';
        $return_to = 'http://www.example.com/foo';

        $v = new Verifier($this, 'http://something-else.invalid/');

        $this->assertFalse(Auth_OpenID_verifyReturnTo($realm, $return_to, null, array($v, 'verify')));
    }

    function test_verifyFailIfDiscoveryRedirects()
    {
        $realm = 'http://*.example.com/';
        $return_to = 'http://www.example.com/foo';

        $v = new Verifier($this, false);

        $this->assertFalse(Auth_OpenID_verifyReturnTo($realm, $return_to, null, array($v, 'verify')));
    }
}

class Tests_Auth_OpenID_RPVerify extends PHPUnit_Framework_TestSuite {
    function getName()
    {
        return "Tests_Auth_OpenID_RPVerify";
    }

    function Tests_Auth_OpenID_RPVerify()
    {
        $this->addTestSuite('Tests_Auth_OpenID_VerifyReturnTo');
        $this->addTestSuite('Tests_Auth_OpenID_ReturnToMatches');
        $this->addTestSuite('Tests_Auth_OpenID_ExtractReturnToURLs');
        $this->addTestSuite('Tests_Auth_OpenID_BuildDiscoveryURL');
    }
}


