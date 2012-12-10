<?php

/**
 * XRDS-parsing tests for the Yadis library.
 */

require_once 'Auth/Yadis/XRDS.php';
require_once 'Auth/Yadis/XRIRes.php';
require_once 'Auth/Yadis/XRI.php';
require_once 'Tests/Auth/Yadis/TestUtil.php';

class Tests_Auth_Yadis_XRDS extends PHPUnit_Framework_TestCase {

    function test_good()
    {
        $files = array(
                       'brian.xrds' => 1,
                       'pip.xrds' => 2
                       );

        foreach ($files as $filename => $service_count) {
            $xml = Tests_Auth_Yadis_readdata($filename);
            $xrds = Auth_Yadis_XRDS::parseXRDS($xml);

            $this->assertTrue($xrds !== null);

            if ($xrds) {
                $this->assertEquals(count($xrds->services()), $service_count);
            } else {
                $this->fail("Could not test XRDS service list because the ".
                            "XRDS object is null");
            }
        }
    }

    function test_good_multi()
    {
        $xml = Tests_Auth_Yadis_readdata("brian.multi.xrds");
        $xrds = Auth_Yadis_XRDS::parseXRDS($xml);
        $this->assertTrue($xrds !== null);
        $this->assertEquals(count($xrds->services()), 1);
        $s = $xrds->services();
        $s = $s[0];

        $types = $s->getTypes();

        $this->assertTrue(count($types) == 1);
        $this->assertEquals('http://openid.net/signon/1.0',
                            $types[0]);
    }

    function test_good_uri_multi()
    {
        $xml = Tests_Auth_Yadis_readdata("brian.multi_uri.xrds");
        $xrds = Auth_Yadis_XRDS::parseXRDS($xml);
        $this->assertTrue($xrds !== null);
        $this->assertEquals(1, count($xrds->services()));
    }

    function test_uri_sorting()
    {
        $xml = Tests_Auth_Yadis_readdata("uri_priority.xrds");
        $xrds = Auth_Yadis_XRDS::parseXRDS($xml);
        $services = $xrds->services();
        $uris = $services[0]->getURIs();

        $expected_uris = array(
                               "http://zero.priority/",
                               "http://one.priority/",
                               "http://no.priority/"
                               );

        $this->assertEquals($uris, $expected_uris);
    }

    function test_bad()
    {
        $this->assertTrue(Auth_Yadis_XRDS::parseXRDS(null) === null);
        $this->assertTrue(Auth_Yadis_XRDS::parseXRDS(5) === null);
        $this->assertTrue(Auth_Yadis_XRDS::parseXRDS('') === null);
        $this->assertTrue(Auth_Yadis_XRDS::parseXRDS('<html></html>') ===
                          null);
        $this->assertTrue(Auth_Yadis_XRDS::parseXRDS("\x00") === null);
    }

    function test_getCanonicalID()
    {
        $canonicalIDtests = array(
               array("@ootao*test1", "delegated-20060809.xrds",
                     "@!5BAD.2AA.3C72.AF46!0000.0000.3B9A.CA01"),
               array("@ootao*test1", "delegated-20060809-r1.xrds",
                     "@!5BAD.2AA.3C72.AF46!0000.0000.3B9A.CA01"),
               array("@ootao*test1", "delegated-20060809-r2.xrds",
                     "@!5BAD.2AA.3C72.AF46!0000.0000.3B9A.CA01"),
               array("@ootao*test1", "sometimesprefix.xrds",
                     "@!5BAD.2AA.3C72.AF46!0000.0000.3B9A.CA01"),
               array("@ootao*test1", "prefixsometimes.xrds",
                     "@!5BAD.2AA.3C72.AF46!0000.0000.3B9A.CA01"),
               array("=keturn*isDrummond", "spoof1.xrds", null),
               array("=keturn*isDrummond", "spoof2.xrds", null),
               array("@keturn*is*drummond", "spoof3.xrds", null),
               // Don't let IRI authorities be canonical for the GCS.
               array("phreak.example.com", "delegated-20060809-r2.xrds", null)
               // TODO: Refs
               // ("@ootao*test.ref", "ref.xrds", "@!BAE.A650.823B.2475")
               );

        foreach ($canonicalIDtests as $tupl) {
            list($iname, $filename, $expectedID) = $tupl;

            $xml = Tests_Auth_Yadis_readdata($filename);
            $xrds = Auth_Yadis_XRDS::parseXRDS($xml);
            $this->_getCanonicalID($iname, $xrds, $expectedID);
        }
    }

    function _getCanonicalID($iname, $xrds, $expectedID)
    {
        if ($expectedID === null) {
            $result = Auth_Yadis_getCanonicalID($iname, $xrds);
            if ($result !== false) {
                $this->fail($iname.' (got '.$result.')');
            }
        } else {
            $cid = Auth_Yadis_getCanonicalID($iname, $xrds);
            $this->assertEquals(Auth_Yadis_XRI($expectedID), $cid);
        }
    }

    function test_services_filters()
    {
        // First, just be sure that service objects do the right
        // thing.
        $xml = Tests_Auth_Yadis_readdata("brian_priority.xrds");
        $xrds = Auth_Yadis_XRDS::parseXRDS($xml,
                                               array('openid' =>
                                                     'http://openid.net/xmlns/1.0'));
        $this->assertTrue($xrds !== null);

        // Get list of service objects.
        $services = $xrds->services();
        $this->assertEquals(count($services), 2, "first service count");

        // Query the two service objecs.
        $s1 = $services[0];
        $this->assertEquals($s1->getPriority(), 1, "first priority check");
        $types = $s1->getTypes();
        $this->assertEquals(count($types), 1, "first type check");

        $s2 = $services[1];
        $this->assertEquals($s2->getPriority(), 2, "second priority check");
        $types = $s2->getTypes();
        $this->assertEquals(count($types), 1, "second type check");

        function _DelegateFilter($service)
            {
                if ($service->getElements('openid:Delegate')) {
                    return true;
                }
                return false;
            }

        // Make sure that a filter which matches both DOES match both.
        $this->assertEquals(count(
                              $xrds->services(array("_DelegateFilter"))), 2,
                            "_DelegateFilter check");

        // This filter should match all services in the document.
        function _HasTypeAndURI($service)
            {
                if ($service->getTypes() &&
                    $service->getURIs()) {
                    return true;
                }
                return false;
            }

        // This filter should only match one.
        function _URIMatchesSchtuff($service)
            {
                $uris = $service->getURIs();

                foreach ($uris as $uri) {
                    if (preg_match("|schtuff|", $uri)) {
                        return true;
                    }
                }
                return false;
            }

        // This filter should only match one.
        function _URIMatchesMyOpenID($service)
            {
                $uris = $service->getURIs();

                foreach ($uris as $uri) {
                    if (preg_match("|myopenid|", $uri)) {
                        return true;
                    }
                }
                return false;
            }

        // Make sure a pair of filters in ALL mode only match one service.
        $this->assertEquals(count(
                              $xrds->services(array("_HasTypeAndURI",
                                                    "_URIMatchesSchtuff"),
                                              SERVICES_YADIS_MATCH_ALL)), 1,
                            "_HasTypeAndURI / _URIMatchesSchtuff check");

        // Make sure a pair of filters in ALL mode only match one service.
        $this->assertEquals(count(
                              $xrds->services(array("_HasTypeAndURI",
                                                    "_URIMatchesMyOpenID"),
                                              SERVICES_YADIS_MATCH_ALL)), 1,
                            "_HasTypeAndURI / _URIMatchesMyOpenID check");

        // Make sure a pair of filters in ANY mode matches both services.
        $this->assertEquals(count(
                              $xrds->services(array("_URIMatchesMyOpenID",
                                                    "_URIMatchesSchtuff"))), 2,
                            "_URIMatchesMyOpenID / _URIMatchesSchtuff check");

        // Make sure the order of the services returned (when using
        // filters) is correct.
        $s = $xrds->services(array("_URIMatchesMyOpenID",
                                   "_URIMatchesSchtuff"));

        $this->assertTrue($s[0]->getPriority() === 1, "s[0] priority check");
        $this->assertTrue($s[1]->getPriority() === 2, "s[1] priority check");

        // Make sure a bad filter mode gets us a null service list.
        $this->assertTrue($xrds->services(array("_URIMatchesMyOpenID",
                                                "_URIMatchesSchtuff"),
                                          "bogus") === null,
                          "bogus filter check");
    }

    function test_multisegment_xri()
    {
        $xml = Tests_Auth_Yadis_readdata('subsegments.xrds');
        $xmldoc = Auth_Yadis_XRDS::parseXRDS($xml);
        $result = Auth_Yadis_getCanonicalId('xri://=nishitani*masaki', $xmldoc);
        $this->assertEquals($result, "xri://=!E117.EF2F.454B.C707!0000.0000.3B9A.CA01");
    }
}

