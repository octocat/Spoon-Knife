<?php

/**
 * Tests for the TrustRoot module
 */

require_once "Auth/OpenID/TrustRoot.php";
require_once "Tests/Auth/OpenID/TestUtil.php";

class Tests_Auth_OpenID_TRParseCase extends PHPUnit_Framework_TestCase {
    function Tests_Auth_OpenID_TRParseCase($desc, $case, $expected)
    {
        $this->setName($desc);
        $this->case = $case;
        $this->expected = $expected;
    }

    function runTest()
    {
        $is_sane = Auth_OpenID_TrustRoot::isSane($this->case);
        $parsed = (bool)Auth_OpenID_TrustRoot::_parse($this->case);
        switch ($this->expected) {
        case 'sane':
            $this->assertTrue($parsed, "Did not parse");
            $this->assertTrue($is_sane, "Is not sane");
            break;
        case 'insane':
            $this->assertTrue($parsed, "Did not parse");
            $this->assertFalse($is_sane, "Is sane");
            break;
        default:
            $this->assertFalse($parsed, "Did parse");
            $this->assertFalse($is_sane, "Is sane");
        }
    }
}

class Tests_Auth_OpenID_TRMatchCase extends PHPUnit_Framework_TestCase {
    function Tests_Auth_OpenID_TRMatchCase($desc, $tr, $rt, $matches)
    {
        $this->setName($desc);
        $this->tr = $tr;
        $this->rt = $rt;
        $this->matches = $matches;
    }

    function runTest()
    {
        $matches = Auth_OpenID_TrustRoot::match($this->tr, $this->rt);
        $this->assertEquals((bool)$this->matches, (bool)$matches);
    }
}

function Tests_Auth_OpenID_parseHeadings($data, $c)
{
    $heading_pat = '/(^|\n)' . $c . '{40}\n([^\n]+)\n' . $c . '{40}\n()/';
    $offset = 0;
    $headings = array();
    while (true) {
        preg_match($heading_pat, substr($data, $offset), $matches,
                   PREG_OFFSET_CAPTURE);
        if (!$matches) {
            break;
        }
        $start = $matches[0][1];
        $heading = $matches[2][0];
        $end = $matches[3][1];
        $headings[] = array('heading' => $heading,
                            'start' => $offset + $start,
                            'end' => $offset + $end,
                            );
        $offset += $end;
    }
    return $headings;
}

function Tests_Auth_OpenID_getSections($data)
{
    $headings = Tests_Auth_OpenID_parseHeadings($data, '-');
    $sections = array();
    $n = count($headings);
    for ($i = 0; $i < $n; ) {
        $secdata = $headings[$i];
        list($numtests, $desc) = explode(': ', $secdata['heading']);
        $start = $secdata['end'];
        $i += 1;
        if ($i < $n) {
            $blob = substr($data, $start, $headings[$i]['start'] - $start);
        } else {
            $blob = substr($data, $start);
        }
        $lines = explode("\n", trim($blob));
        if (count($lines) != $numtests) {
            trigger_error('Parse failure: ' . var_export($secdata, true),
                          E_USER_ERROR);
        }
        $sections[] = array('desc' => $desc, 'lines' => $lines,);
    }
    return $sections;
}

function Tests_Auth_OpenID_trParseTests($head, $tests)
{
    $tests = array('fail' => $tests[0],
                   'insane' => $tests[1],
                   'sane' => $tests[2]);
    $testobjs = array();
    foreach ($tests as $expected => $testdata) {
        $lines = $testdata['lines'];
        foreach ($lines as $line) {
            $desc = sprintf("%s - %s: %s", $head,
                            $testdata['desc'], var_export($line, true));
            $testobjs[] = new Tests_Auth_OpenID_TRParseCase(
                $desc, $line, $expected);
        }
    }
    return $testobjs;
}

function Tests_Auth_OpenID_trMatchTests($head, $tests)
{
    $tests = array(true => $tests[0], false => $tests[1]);
    $testobjs = array();
    foreach ($tests as $expected => $testdata) {
        $lines = $testdata['lines'];
        foreach ($lines as $line) {
            $pat = '/^([^ ]+) +([^ ]+)$/';
            preg_match($pat, $line, $matches);
            list($_, $tr, $rt) = $matches;
            $desc = sprintf("%s - %s: %s %s", $head, $testdata['desc'],
                            var_export($tr, true), var_export($rt, true));
            $testobjs[] = new Tests_Auth_OpenID_TRMatchCase(
                $desc, $tr, $rt, $expected);
        }
    }
    return $testobjs;
}

function Tests_Auth_OpenID_trustRootTests()
{
    $data = Tests_Auth_OpenID_readdata('trustroot.txt');
    list($parsehead, $matchhead) = Tests_Auth_OpenID_parseHeadings($data, '=');
    $pe = $parsehead['end'];
    $parsedata = substr($data, $pe, $matchhead['start'] - $pe);
    $parsetests = Tests_Auth_OpenID_getSections($parsedata);
    $parsecases = Tests_Auth_OpenID_trParseTests($parsehead['heading'],
                                                 $parsetests);

    $matchdata = substr($data, $matchhead['end']);
    $matchtests = Tests_Auth_OpenID_getSections($matchdata);
    $matchcases = Tests_Auth_OpenID_trMatchTests($matchhead['heading'],
                                                 $matchtests);

    return array_merge($parsecases, $matchcases);
}

class Tests_Auth_OpenID_TrustRoot extends PHPUnit_Framework_TestSuite {
    function Tests_Auth_OpenID_TrustRoot($name)
    {
        $this->setName($name);

        foreach (Tests_Auth_OpenID_trustRootTests() as $test) {
            $this->_addTestByValue($test);
        }
    }

    function _addTestByValue($test) {
        $this->addTest($test);
    }
}


