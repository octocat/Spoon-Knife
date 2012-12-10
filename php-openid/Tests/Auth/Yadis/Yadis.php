<?php

/**
 * Tests for the core of the PHP Yadis library.
 */

require_once 'Auth/Yadis/Yadis.php';
require_once 'Tests/Auth/Yadis/TestUtil.php';

class Tests_Auth_Yadis_DiscoveryTest extends PHPUnit_Framework_TestCase {

    function Tests_Auth_Yadis_DiscoveryTest($input_url, $redir_uri,
                                                $xrds_uri, $num)
    {
        $this->input_url = $input_url;
        $this->redir_uri = $redir_uri;
        $this->xrds_uri = $xrds_uri;
        $this->num = $num;
    }

    function getName()
    {
        return "Yadis discovery test ".$this->num;
    }

    function runTest()
    {
        $fetcher = Auth_Yadis_Yadis::getHTTPFetcher();
        $y = Auth_Yadis_Yadis::discover(
             $this->input_url, $fetcher);
        $this->assertTrue($y !== null);

        // Compare parts of returned Yadis object to expected URLs.
        $this->assertEquals($this->redir_uri, $y->normalized_uri, "tried $this->input_url");

        if ($this->xrds_uri) {
            $this->assertEquals($this->xrds_uri, $y->xrds_uri);
            // Compare contents of actual HTTP GET with that of Yadis
            // response.
            $f = Auth_Yadis_Yadis::getHTTPFetcher();
            $http_response = $f->get($this->xrds_uri);

            $this->assertEquals($http_response->body, $y->response_text);
        } else {
            $this->assertTrue($y->xrds_uri === null);
        }
    }
}

class Tests_Auth_Yadis_Yadis extends PHPUnit_Framework_TestSuite {

    function getName()
    {
        return "Tests_Auth_Yadis_Yadis";
    }

    function parseTests($data)
    {
        $cases = explode("\n", $data);
        $tests = array();

        foreach ($cases as $line) {
            if ($line && ($line[0] != "#")) {
                $tests[] = explode("\t", $line, 3);
            }
        }

        return $tests;
    }

    function Tests_Auth_Yadis_Yadis()
    {
        $test_data = file_get_contents('http://www.openidenabled.com/resources/yadis-test/discover/manifest.txt');

        $test_cases = $this->parseTests($test_data);

        $i = 0;
        foreach ($test_cases as $case) {
            $i++;
            list($input, $redir, $xrds) = $case;
            $this->addTest(new Tests_Auth_Yadis_DiscoveryTest($input,
                                                                  $redir,
                                                                  $xrds, $i));
        }
    }

}

