<?php

/**
 * Tests for the Consumer parsing functions.
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

require_once 'Tests/Auth/OpenID/TestUtil.php';
require_once 'Auth/OpenID/Parse.php';

class Tests_Auth_OpenID_Link extends PHPUnit_Framework_TestCase {
    function Tests_Auth_OpenID_Link($case)
    {
        list($desc, $markup, $links, $case_text) = $case;
        $this->desc = $desc;
        $this->markup = $markup;
        $this->expected_links = $links;
        $this->case_text = $case_text;
        $this->parser = new Auth_OpenID_Parse();
    }

    function getName()
    {
        return $this->desc;
    }

    function runTest()
    {
        $parsed = $this->parser->parseLinkAttrs($this->markup);
        $i = 0;

        foreach ($this->expected_links as $expected) {
            list($is_optional_link, $expected_link) = $expected;
            if ($is_optional_link &&
                ($i >= count($parsed))) {
                continue;
            }

            if (count($parsed) <= $i) {
                $i++;
                continue;
            }

            $act_link = $parsed[$i];

            $increment = true;
            foreach ($expected_link as $attr => $data) {
                list($is_optional_attr, $value) = $data;

                if ($is_optional_attr) {
                    $actual_value = null;
                    if (array_key_exists($attr, $act_link)) {
                        $actual_value = $act_link[$attr];
                    } else {
                        continue;
                    }
                } else {
                    $actual_value = $act_link[$attr];
                }

                if ($is_optional_link &&
                    ($value != $actual_value)) {
                    $increment = false;
                    break;
                }

                $this->assertEquals($value, $actual_value);
            }

            if ($increment) {
                $i++;
            }
        }

        $this->assertEquals($i, count($parsed));
    }
}

class NumTestCases extends PHPUnit_Framework_TestCase {
    function NumTestCases($test_cases, $num_tests)
    {
        $this->test_cases = $test_cases;
        $this->num_tests = $num_tests;
    }

    function runTest()
    {
        $this->assertEquals(count($this->test_cases),
                            $this->num_tests);
    }
}

class Tests_Auth_OpenID_Parse extends PHPUnit_Framework_TestSuite {

    function getName()
    {
        return "Tests_Auth_OpenID_Parse";
    }

    function _parseCheck($cond, $where)
    {
        if (!$cond) {
            trigger_error('Parse error in ' . $where, E_USER_ERROR);
        }
    }

    function parseLink($line)
    {
        $parts = explode(" ", $line);
        $optional = intval($parts[0] == 'Link*:');
        $this->_parseCheck($optional || ($parts[0] == 'Link:'), __FUNCTION__);

        $attrs = array();
        foreach (array_slice($parts, 1) as $attr) {
            list($k, $v) = explode("=", $attr, 2);
            if ($k[strlen($k) - 1] == '*') {
                $attr_optional = 1;
                $k = substr($k, 0, strlen($k) - 1);
            } else {
                $attr_optional = 0;
            }

            $attrs[$k] = array($attr_optional, $v);
        }

        return array($optional, $attrs);
    }

    function parseCase($s)
    {
        list($header, $markup) = explode("\n\n", $s, 2);
        $lines = explode("\n", $header);
        $name = array_shift($lines);
        $this->_parseCheck(strpos($name, 'Name: ') == 0, __FUNCTION__);
        $desc = substr($name, 6);
        $parsed = array();
        foreach ($lines as $line) {
            $parsed[] = $this->parseLink($line);
        }

        return array($desc, $markup, $parsed);
    }

    function parseTests($s)
    {
        $tests = array();

        $cases = explode("\n\n\n", $s);
        $header = array_shift($cases);
        list($tests_line, $unused) = explode("\n", $header, 2);
        list($k, $v) = explode(": ", $tests_line);
        $this->_parseCheck(('Num Tests' == $k), __FUNCTION__);
        $num_tests = intval($v);

        foreach (array_slice($cases, 0, count($cases) - 1) as $case) {
            list($desc, $markup, $links) = $this->parseCase($case);
            $tests[] = array($desc, $markup, $links, $case);
        }

        return array($num_tests, $tests);
    }

    function Tests_Auth_OpenID_Parse()
    {
        $test_data = Tests_Auth_OpenID_readdata('linkparse.txt');

        list($num_tests, $test_cases) = $this->parseTests($test_data);

        $this->addTest(new NumTestCases($test_cases, $num_tests));

        foreach ($test_cases as $case) {
            $this->addTest(new Tests_Auth_OpenID_Link($case));
        }
    }
}


