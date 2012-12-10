<?php

require_once "Auth/Yadis/Yadis.php";
require_once "Tests/Auth/Yadis/TestUtil.php";

global $testlist;
$testlist = array(
                  // success,  input_name,          id_name,            result_name
                  array(true,  "equiv",             "equiv",            "xrds"),
                  array(true,  "header",            "header",           "xrds"),
                  array(true,  "lowercase_header",  "lowercase_header", "xrds"),
                  array(true,  "xrds",              "xrds",             "xrds"),
                  array(true,  "xrds_ctparam",      "xrds_ctparam",     "xrds_ctparam"),
                  array(true,  "xrds_ctcase",       "xrds_ctcase",      "xrds_ctcase"),
                  array(false, "xrds_html",         "xrds_html",        "xrds_html"),
                  array(true,  "redir_equiv",       "equiv",            "xrds"),
                  array(true,  "redir_header",      "header",           "xrds"),
                  array(true,  "redir_xrds",        "xrds",             "xrds"),
                  array(false, "redir_xrds_html",   "xrds_html",        "xrds_html"),
                  array(true,  "redir_redir_equiv", "equiv",            "xrds"),
                  array(false, "404_server_response", null,             null),
                  array(false, "404_with_header",     null,             null),
                  array(false, "404_with_meta",       null,             null),
                  array(false, "201_server_response", null,             null),
                  array(false, "500_server_response", null,             null)
                  );

function getExampleXRDS()
{
    return Tests_Auth_Yadis_readdata('example-xrds.xml');
}

global $example_xrds;
$example_xrds = getExampleXRDS();

global $default_test_file;
$default_test_file = 'test1-discover.txt';

global $discover_tests;
$discover_tests = array();

function readTests($filename)
{
    $data = Tests_Auth_Yadis_readdata($filename);

    if ($data === null) {
        return null;
    }

    $tests = array();
    foreach (preg_split("/\f\n/", $data) as $case) {
        list($name, $content) = explode("\n", $case, 2);
        $tests[$name] = $content;
    }
    return $tests;
}

function getData($filename, $name)
{
    global $discover_tests;
    if (!array_key_exists($filename, $discover_tests)) {
        $data = readTests($filename);
        if ($data === null) {
            return null;
        }
        $discover_tests[$filename] = $data;
    }

    $file_tests = $discover_tests[$filename];

    if (array_key_exists($name, $file_tests)) {
        return $file_tests[$name];
    } else {
        return null;
    }
}

function fillTemplate($test_name, $template, $base_url, $example_xrds)
{
    $mapping = array(
                     array('URL_BASE/', $base_url),
                     array('<XRDS Content>', $example_xrds),
                     array('YADIS_HEADER', 'X-XRDS-Location'),
                     array('NAME', $test_name));

    foreach ($mapping as $pair) {
        list($k, $v) = $pair;
        $template = str_replace($k, $v, $template);
    }

    return $template;
}

function generateSample($test_name, $base_url,
                        $_example_xrds = null, $filename = null)
{
    global $example_xrds, $default_test_file;

    if ($_example_xrds === null) {
        $_example_xrds = $example_xrds;
    }

    if ($filename === null) {
        $filename = $default_test_file;
    }

    $template = getData($filename, $test_name);

    if ($template === null) {
        return null;
    }

    return fillTemplate($test_name, $template, $base_url, $_example_xrds);
}

function generateResult($base_url, $input_name, $id_name, $result_name, $success)
{
    $input_url = $base_url . $input_name; // urlparse.urljoin(base_url, input_name)

    // If the name is null then we expect the protocol to fail, which
    // we represent by null
    if ($id_name === null) {
        // assert result_name is null
        return array($input_url, null); // DiscoveryFailure
    }

    $result = generateSample($result_name, $base_url);
    list($headers, $content) = explode("\n\n", $result, 2);
    $header_lines = explode("\n", $headers);
    $ctype = null;
    foreach ($header_lines as $header_line) {
        if (strpos($header_line, 'Content-Type:') === 0) {
            list($temp, $ctype) = explode(":", $header_line, 2);
            $ctype = trim($ctype);
            break;
        }
    }

    $id_url = $base_url . $id_name;

    $result = new Auth_Yadis_Yadis();
    $result->uri = $id_url;
    if ($success) {
        $result->xrds_uri = $base_url . $result_name;
    } else {
        $result->xrds_uri = null;
    }
    $result->content_type = $ctype;
    $result->body = $content;
    return array($input_url, $result);
}

