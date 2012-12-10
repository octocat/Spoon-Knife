<?php

/**
 * A driver for the PHP OpenID unit tests.
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

require_once 'PHPUnit/Framework.php';
//require_once 'PHPUnit/GUI/HTML.php';

error_reporting(E_ALL | E_STRICT);

global $__test_errors;
$__test_errors = array();

function __handler($code, $message)
{
    global $__test_errors;

    if ($code == E_USER_WARNING) {
        $__test_errors[] = $message;
    }
}

function __raiseError($message)
{
    set_error_handler('__handler');
    trigger_error($message, E_USER_WARNING);
    restore_error_handler();
}

function __getError()
{
    global $__test_errors;
    if ($__test_errors) {
        return array_pop($__test_errors);
    }
    return null;
}

/**
 * Load the tests that are defined in the named modules.
 *
 * If you have Tests/Foo.php which defines a test class called
 * Tests_Foo, the call would look like:
 *
 * loadTests('Tests/', array('Foo'))
 *
 * @param string $test_dir The root of the test hierarchy. Must end
 * with a /
 *
 * @param array $test_names The names of the modules in which the
 * tests are defined. This should not include the root of the test
 * hierarchy.
 */
function loadTests($test_dir, $test_names)
{
    global $_tests;
    $suites = array();

    foreach ($test_names as $filename) {
        $filename = $test_dir . $filename . '.php';

        if (!global_require_once($filename)) {
            continue;
        }

        $class_name = str_replace('/', '_', $filename);
        $class_name = basename($class_name, '.php');

        $suites[] = makeSuite($class_name);
    }

    return $suites;
}

function makeSuite($class_name) {
    $test = new $class_name($class_name);

    if (is_a($test, 'PHPUnit_Framework_TestCase')) {
        $s = new PHPUnit_Framework_TestSuite();
        $s->setName($class_name);
        $s->addTestSuite($class_name);
        $test = $s;
    }

    $tc_array_name = $class_name . '_other';
    if (array_key_exists($tc_array_name, $GLOBALS) &&
        is_array($GLOBALS[$tc_array_name])) {

        foreach ($GLOBALS[$tc_array_name] as $tc) {
            $test->addTestSuite(get_class($tc));
        }
    }

    return $test;
}


function global_require_once($name)
{
    $f = include_once $name;
    if (!$f) {
        print("global require once skipping $name\n");
        return false;
    }
    foreach (get_defined_vars() as $k => $v) {
        if (!in_array($k, array('name', 'GLOBALS'))) {
            $GLOBALS[$k] = $v;
        }
    }
    return true;
}

$_tests = array(
                array(
                      'dir' => 'Tests/Auth/OpenID/',
                      'files' => array(
                                       'Association',
                                       'AssociationResponse',
                                       'AuthRequest',
                                       'AX',
                                       'BigMath',
                                       'Consumer',
                                       'CryptUtil',
                                       'DiffieHellman',
                                       'Discover_OpenID',
                                       'Extension',
                                       'HMAC',
                                       'KVForm',
                                       'Message',
                                       'Negotiation',
                                       'Nonce',
                                       'OpenID_Yadis',
                                       'PAPE',
                                       'Parse',
                                       'RPVerify',
                                       'Server',
                                       'SReg',
                                       'StoreTest',
                                       'TrustRoot',
                                       'URINorm',
                                       'Util',
                                       'VerifyDisco'),
                      ),
                array(
                      'dir' => 'Tests/Auth/Yadis/',
                      'files' => array(
                                       'ParseHTML',
                                       'XRDS',
                                       'Yadis',
                                       'Discover_Yadis',
                                       'XRI'
                                       )
                      )
                );

function selectTests($package, $names)
{
    global $_tests;
    $lnames = array_map('strtolower', $names);
    $include = array();
    $exclude = array();
    foreach ($package['files'] as $t) {
        $l = strtolower($t);
        if (in_array($l, $lnames)) {
            $include[] = $t;
        }

        if (in_array("/$l", $lnames)) {
            $exclude[] = $t;
        }
    }

    return array_diff($include, $exclude);
}

// Load OpenID library tests
function loadSuite($names=null)
{
    global $_tests;
    $result = array();
    foreach ($_tests as $package) {
        if (!$names) {
            $selected = $package['files'];
        } else {
            $selected = selectTests($package, $names);
        }
        $result = array_merge($result, loadTests($package['dir'], $selected));
    }

    return $result;
}

