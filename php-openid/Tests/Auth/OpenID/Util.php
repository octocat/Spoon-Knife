<?php

/**
 * Tests for utility functions used by the OpenID library.
 *
 * PHP versions 4 and 5
 *
 * LICENSE: See the COPYING file included in this distribution.
 *
 * @package OpenID
 * @author JanRain, Inc. <openid@janrain.com>
 * @copyright 2005-2008 Janrain, Inc.
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache
 */

require_once 'Auth/OpenID.php';

class Tests_Auth_OpenID_Util extends PHPUnit_Framework_TestCase {
    function test_base64()
    {
        // This is not good for international use, but PHP doesn't
        // appear to provide access to the local alphabet.
        $letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $digits = "0123456789";
        $extra = "+/=";
        $allowed_s = $letters . $digits . $extra;
        $allowed_d = array();

        for ($i = 0; $i < strlen($allowed_s); $i++) {
            $c = $allowed_s[$i];
            $allowed_d[$c] = null;
        }

        function checkEncoded($obj, $str, $allowed_array)
            {
                for ($i = 0; $i < strlen($str); $i++) {
                    $obj->assertTrue(array_key_exists($str[$i],
                                                      $allowed_array));
                }
            }

        $cases = array(
                       "",
                       "x",
                       "\x00",
                       "\x01",
                       str_repeat("\x00", 100),
                       implode("", array_map('chr', range(0, 255)))
                       );

        foreach ($cases as $s) {
            $b64 = base64_encode($s);
            checkEncoded($this, $b64, $allowed_d);
            $s_prime = base64_decode($b64);
            $this->assertEquals($s_prime, $s);
        }

        function random_ordinal($unused)
            {
                return rand(0, 255);
            }

        // Randomized test
        foreach (range(0, 49) as $i) {
            $n = rand(0, 2048);
            $s = implode("", array_map('chr',
                                       array_map('random_ordinal',
                                                 range(0, $n))));
            $b64 = base64_encode($s);
            checkEncoded($this, $b64, $allowed_d);
            $s_prime = base64_decode($b64);
            $this->assertEquals($s_prime, $s);
        }
    }

    function test_urldefrag()
    {
        $cases = array(
                       array('http://foo.com', 'http://foo.com'),
                       array('http://foo.com/', 'http://foo.com/'),
                       array('http://foo.com/path', 'http://foo.com/path'),
                       array('http://foo.com/path?query', 'http://foo.com/path?query'),
                       array('http://foo.com/path?query=v', 'http://foo.com/path?query=v'),
                       array('http://foo.com/?query=v', 'http://foo.com/?query=v'),
                       );

        foreach ($cases as $pair) {
            list($orig, $after) = $pair;
            list($base, $frag) = Auth_OpenID::urldefrag($orig);
            $this->assertEquals($after, $base);
            $this->assertEquals($frag, '');

            list($base, $frag) = Auth_OpenID::urldefrag($orig . "#fragment");
            $this->assertEquals($after, $base);
            $this->assertEquals('fragment', $frag);
        }
    }

    function test_normalizeUrl()
    {
        $this->assertEquals("http://foo.com/",
                            Auth_OpenID::normalizeUrl("foo.com"));

        $this->assertEquals("http://foo.com/",
                            Auth_OpenID::normalizeUrl("http://foo.com"));

        $this->assertEquals("https://foo.com/",
                            Auth_OpenID::normalizeUrl("https://foo.com"));

        $this->assertEquals("http://foo.com/bar",
                            Auth_OpenID::normalizeUrl("foo.com/bar"));

        $this->assertEquals("http://foo.com/bar",
                            Auth_OpenID::normalizeUrl("http://foo.com/bar"));

        $this->assertEquals("http://foo.com/",
                            Auth_OpenID::normalizeUrl("http://foo.com/"));

        $this->assertEquals("https://foo.com/",
                            Auth_OpenID::normalizeUrl("https://foo.com/"));

        $this->assertEquals("https://foo.com/bar" ,
                            Auth_OpenID::normalizeUrl("https://foo.com/bar"));

        $this->assertEquals("http://foo.com/bar" ,
                            Auth_OpenID::normalizeUrl("HTtp://foo.com/bar"));

        $this->assertEquals("http://foo.com/bar" ,
             Auth_OpenID::normalizeUrl("HTtp://foo.com/bar#fraggle"));

        $this->assertEquals("http://foo.com/bAr/" ,
             Auth_OpenID::normalizeUrl("HTtp://fOo.com/bAr/.#fraggle"));

        if (0) {
            $this->assertEquals("http://foo.com/%E8%8D%89",
                           Auth_OpenID::normalizeUrl("foo.com/\u8349"));

            $this->assertEquals("http://foo.com/%E8%8D%89",
                           Auth_OpenID::normalizeUrl("http://foo.com/\u8349"));
        }

        $non_ascii_domain_cases = array(
                                        array("http://xn--vl1a.com/",
                                              "\u8349.com"),

                                        array("http://xn--vl1a.com/",
                                              "http://\u8349.com"),

                                        array("http://xn--vl1a.com/",
                                              "\u8349.com/"),

                                        array("http://xn--vl1a.com/",
                                              "http://\u8349.com/"),

                                        array("http://xn--vl1a.com/%E8%8D%89",
                                              "\u8349.com/\u8349"),

                                        array("http://xn--vl1a.com/%E8%8D%89",
                                              "http://\u8349.com/\u8349"),
                                        );

        // XXX
        /*
        codecs.getencoder('idna')
         except LookupError:
        # If there is no idna codec, these cases with
        # non-ascii-representable domain names should fail.
        should_raise = True
    else:
        should_raise = False

    for expected, case in non_ascii_domain_cases:
try:
actual = Auth_OpenID::normalizeUrl(case)
         except UnicodeError:
            assert should_raise
    else:
assert not should_raise and actual == expected, case
        */

        $this->assertNull(Auth_OpenID::normalizeUrl(null));
        $this->assertNull(Auth_OpenID::normalizeUrl(''));
        $this->assertNull(Auth_OpenID::normalizeUrl('http://'));
    }

    function test_appendArgs()
    {

        $simple = 'http://www.example.com/';

        $cases = array(
                       array('empty list',
                             array($simple, array()),
                             $simple),

                       array('empty dict',
                             array($simple, array()),
                             $simple),

                       array('one list',
                             array($simple, array(array('a', 'b'))),
                             $simple . '?a=b'),

                       array('one dict',
                             array($simple, array('a' => 'b')),
                             $simple . '?a=b'),

                       array('two list (same)',
                             array($simple, array(array('a', 'b'),
                                                  array('a', 'c'))),
                             $simple . '?a=b&a=c'),

                       array('two list',
                             array($simple, array(array('a', 'b'),
                                                  array('b', 'c'))),
                             $simple . '?a=b&b=c'),

                       array('two list (order)',
                             array($simple, array(array('b', 'c'),
                                                  array('a', 'b'))),
                             $simple . '?b=c&a=b'),

                       array('two dict (order)',
                             array($simple, array('b' => 'c',
                                                  'a' => 'b')),
                             $simple . '?a=b&b=c'),

                       array('escape',
                             array($simple, array(array('=', '='))),
                             $simple . '?%3D=%3D'),

                       array('escape (URL)',
                             array($simple, array(array('this_url',
                                                        $simple))),
                             $simple .
                             '?this_url=http%3A%2F%2Fwww.example.com%2F'),

                       array('use dots',
                             array($simple, array(array('openid.stuff',
                                                        'bother'))),
                             $simple . '?openid.stuff=bother'),

                       array('args exist (empty)',
                             array($simple . '?stuff=bother', array()),
                             $simple . '?stuff=bother'),

                       array('args exist',
                             array($simple . '?stuff=bother',
                                   array(array('ack', 'ack'))),
                             $simple . '?stuff=bother&ack=ack'),

                       array('args exist',
                             array($simple . '?stuff=bother',
                                   array(array('ack', 'ack'))),
                             $simple . '?stuff=bother&ack=ack'),

                       array('args exist (dict)',
                             array($simple . '?stuff=bother',
                                   array('ack' => 'ack')),
                             $simple . '?stuff=bother&ack=ack'),

                       array('args exist (dict 2)',
                             array($simple . '?stuff=bother',
                                   array('ack' => 'ack', 'zebra' => 'lion')),
                             $simple . '?stuff=bother&ack=ack&zebra=lion'),

                       array('three args (dict)',
                             array($simple, array('stuff' => 'bother',
                                                  'ack' => 'ack',
                                                  'zebra' => 'lion')),
                             $simple . '?ack=ack&stuff=bother&zebra=lion'),

                       array('three args (list)',
                             array($simple, array(
                                                  array('stuff', 'bother'),
                                                  array('ack', 'ack'),
                                                  array('zebra', 'lion'))),
                             $simple . '?stuff=bother&ack=ack&zebra=lion'),
                       );

        // Tests.
        foreach ($cases as $case) {
            list($desc, $data, $expected) = $case;
            list($url, $query) = $data;
            $this->assertEquals($expected,
                    Auth_OpenID::appendArgs($url, $query));
        }
    }

    function test_getQuery()
    {
        $queries = array(
                         '' => array(),
                         'single' => array(),
                         'no&pairs' => array(),
                         'x%3Dy' => array(),
                         'single&real=value' => array('real' => 'value'),
                         'x=y&m=x%3Dn' => array('x' => 'y', 'm' => 'x=n'),
                         '&m=x%20y' => array('m' => 'x y'),
                         'single&&m=x%20y&bogus' => array('m' => 'x y'),
                         // Even with invalid encoding.  But don't do that.
                         'too=many=equals&' => array('too' => 'many=equals')
                         );

        foreach ($queries as $s => $data) {
            $query = Auth_OpenID::getQuery($s);

            foreach ($data as $key => $value) {
                $this->assertTrue($query[$key] === $value);
            }

            foreach ($query as $key => $value) {
                $this->assertTrue($data[$key] === $value);
            }
        }
    }
}


