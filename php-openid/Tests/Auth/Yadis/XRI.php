<?php

/**
 * XRI resolution / handling tests.
 *
 * @package OpenID
 * @author JanRain, Inc. <openid@janrain.com>
 * @copyright 2005-2008 Janrain, Inc.
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache
 */

require_once "Auth/Yadis/XRIRes.php";
require_once "Auth/Yadis/XRI.php";
require_once "Auth/Yadis/Yadis.php";

class Tests_Auth_Yadis_XriDiscoveryTestCase extends PHPUnit_Framework_TestCase {
    function runTest()
    {
        $this->assertEquals(
               Auth_Yadis_identifierScheme('=john.smith'), 'XRI');

        $this->assertEquals(
               Auth_Yadis_identifierScheme(''), 'URI');

        $this->assertEquals(
               Auth_Yadis_identifierScheme('@smiths/john'), 'XRI');

        $this->assertEquals(
               Auth_Yadis_identifierScheme('smoker.myopenid.com'), 'URI');

        $this->assertEquals(
               Auth_Yadis_identifierScheme('xri://=john'), 'XRI');
    }
}

class Tests_Auth_Yadis_XriEscapingTestCase extends PHPUnit_Framework_TestCase {
    function test_escaping_percents()
    {
        $this->assertEquals(Auth_Yadis_escapeForIRI('@example/abc%2Fd/ef'),
                            '@example/abc%252Fd/ef');
    }

    function runTest()
    {
        // no escapes
        $this->assertEquals('@example/foo/(@bar)',
               Auth_Yadis_escapeForIRI('@example/foo/(@bar)'));

        // escape slashes
        $this->assertEquals('@example/foo/(@bar%2Fbaz)',
               Auth_Yadis_escapeForIRI('@example/foo/(@bar/baz)'));

        $this->assertEquals('@example/foo/(@bar%2Fbaz)/(+a%2Fb)',
               Auth_Yadis_escapeForIRI('@example/foo/(@bar/baz)/(+a/b)'));

        // escape query ? and fragment
        $this->assertEquals('@example/foo/(@baz%3Fp=q%23r)?i=j#k',
               Auth_Yadis_escapeForIRI('@example/foo/(@baz?p=q#r)?i=j#k'));
    }
}

class Tests_Auth_Yadis_ProxyQueryTestCase extends PHPUnit_Framework_TestCase {
    function setUp()
    {
        $this->proxy_url = 'http://xri.example.com/';
        $this->fetcher = Auth_Yadis_Yadis::getHTTPFetcher();
        $this->proxy = new Auth_Yadis_ProxyResolver($this->fetcher,
                                                        $this->proxy_url);
        $this->servicetype = 'xri://+i-service*(+forwarding)*($v*1.0)';
        $this->servicetype_enc = 'xri%3A%2F%2F%2Bi-service%2A%28%2Bforwarding%29%2A%28%24v%2A1.0%29';
    }

    function runTest()
    {
        $st = $this->servicetype;
        $ste = $this->servicetype_enc;
        $args_esc = "_xrd_r=application%2Fxrds%2Bxml&_xrd_t=" . $ste;
        $h = $this->proxy_url;
        $this->assertEquals($h . '=foo?' . $args_esc,
                            $this->proxy->queryURL('=foo', $st));
        $this->assertEquals($h . '=foo/bar?baz&' . $args_esc,
                            $this->proxy->queryURL('=foo/bar?baz', $st));
        $this->assertEquals($h . '=foo/bar?baz=quux&' . $args_esc,
                            $this->proxy->queryURL('=foo/bar?baz=quux', $st));
        $this->assertEquals($h . '=foo/bar?mi=fa&so=la&' . $args_esc,
                            $this->proxy->queryURL('=foo/bar?mi=fa&so=la', $st));

        $args_esc = "_xrd_r=application%2Fxrds%2Bxml&_xrd_t=" . $ste;
        $h = $this->proxy_url;
        $this->assertEquals($h . '=foo/bar??' . $args_esc,
                            $this->proxy->queryURL('=foo/bar?', $st));
        $this->assertEquals($h . '=foo/bar????' . $args_esc,
                            $this->proxy->queryURL('=foo/bar???', $st));
    }
}

class Tests_Auth_Yadis_TestGetRootAuthority extends PHPUnit_Framework_TestCase {
    function runTest()
    {
        $xris = array(
                      array("@foo", "@"),
                      array("@foo*bar", "@"),
                      array("@*foo*bar", "@"),
                      array("@foo/bar", "@"),
                      array("!!990!991", "!"),
                      array("!1001!02", "!"),
                      array("=foo*bar", "="),
                      array("(example.com)/foo", "(example.com)"),
                      array("(example.com)*bar/foo", "(example.com)"),
                      array("baz.example.com/foo", "baz.example.com"),
                      array("baz.example.com:8080/foo", "baz.example.com:8080")
                      // Looking at the ABNF in XRI Syntax 2.0, I don't think you can
                      // have example.com*bar.  You can do (example.com)*bar, but that
                      // would mean something else.
                      // ("example.com*bar/(=baz)", "example.com*bar"),
                      // ("baz.example.com!01/foo", "baz.example.com!01"),
                      );

        foreach ($xris as $tupl) {
            list($thexri, $expected_root) = $tupl;
            $this->assertEquals(Auth_Yadis_XRI($expected_root),
                                Auth_Yadis_rootAuthority($thexri),
                                'rootAuthority test ('.$thexri.')');
        }
    }
}

class Tests_Auth_Yadis_XRI extends PHPUnit_Framework_TestSuite {
    function getName()
    {
        return "Tests_Auth_Yadis_XRI";
    }

    function Tests_Auth_Yadis_XRI()
    {
        $this->addTest(new Tests_Auth_Yadis_ProxyQueryTestCase());
        $this->addTest(new Tests_Auth_Yadis_XriEscapingTestCase());
        $this->addTest(new Tests_Auth_Yadis_XriDiscoveryTestCase());
        $this->addTest(new Tests_Auth_Yadis_TestGetRootAuthority());
    }
}

