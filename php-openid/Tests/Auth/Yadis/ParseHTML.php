<?php

/**
 * Tests for the Yadis HTML parsing functionality.
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

require_once 'Tests/Auth/Yadis/TestUtil.php';
require_once 'Auth/Yadis/ParseHTML.php';

class Tests_Auth_Yadis_ParseTest extends PHPUnit_Framework_TestCase {
    function Tests_Auth_Yadis_ParseTest($case)
    {
        list($result, $comment, $html) = $case;

        $this->result = $result;
        $this->comment = $comment;
        $this->html_string = $html;
        $this->parser = new Auth_Yadis_ParseHTML();
    }

    function getName()
    {
        return $this->comment;
    }

    function runTest()
    {
        $value = $this->parser->getHTTPEquiv($this->html_string);

        if ($this->result == "EOF") {
            $this->assertTrue($value === null);
        } else if ($this->result == "None") {
            $this->assertTrue($value === null);
        } else {
            $this->assertEquals($this->result, $value);
        }
    }
}

class Tests_Auth_Yadis_ParseHTML extends PHPUnit_Framework_TestSuite {

    function getName()
    {
        return "Tests_Auth_Yadis_Parse";
    }

    function parseTests($s)
    {
        $tests = array();

        $cases = preg_split("/\f\n/", $s);

        foreach ($cases as $case) {
            // Split the case text on newline, and keep the first two
            // lines and re-join the rest (those are the HTML).
            $parts = explode("\n", $case);
            $result = $parts[0];
            $html_comment = $parts[1];
            $html_string = implode("\n", array_slice($parts, 2));
            $tests[] = array($result, $html_comment, $html_string);
        }

        return $tests;
    }

    function Tests_Auth_Yadis_ParseHTML()
    {
        $test_data = Tests_Auth_Yadis_readdata('test1-parsehtml.txt');

        $test_cases = $this->parseTests($test_data);

        foreach ($test_cases as $case) {
            $this->addTest(new Tests_Auth_Yadis_ParseTest($case));
        }
    }
}

