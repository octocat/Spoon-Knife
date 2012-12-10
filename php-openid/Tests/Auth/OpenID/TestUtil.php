<?php

/**
 * Utilites for test functions
 */


function Tests_Auth_OpenID_datafile($name, $reader)
{
    $path = dirname(realpath(__FILE__));
    $sep = DIRECTORY_SEPARATOR;
    $filename = $path . $sep . 'data' . $sep . $name;
    $data = $reader($filename);
    if ($data === false) {
        $msg = "Failed to open data file: $name";
        trigger_error($msg, E_USER_ERROR);
    }
    return $data;
}

function Tests_Auth_OpenID_readdata($name)
{
    return Tests_Auth_OpenID_datafile($name, 'file_get_contents');
}

function Tests_Auth_OpenID_readlines($name)
{
    return Tests_Auth_OpenID_datafile($name, 'file');
}

class OpenIDTestMixin extends PHPUnit_Framework_TestCase {
    function failUnlessOpenIDValueEquals($msg, $key, $expected, $ns=null)
    {
        if ($ns === null) {
            $ns = Auth_OpenID_OPENID_NS;
        }

        $actual = $msg->getArg($ns, $key);
        $error_format = 'Wrong value for openid.%s: expected=%s, actual=%s';
        $error_message = sprintf($error_format,
                                 $key, $expected, $actual);

        $this->assertEquals($expected, $actual, $error_message);
    }

    function failIfOpenIDKeyExists($msg, $key, $ns=null)
    {
        if ($ns === null) {
            $ns = Auth_OpenID_OPENID_NS;
        }

        $actual = $msg->getArg($ns, $key);
        $error_message = sprintf('openid.%s unexpectedly present: %s',
                                 $key, $actual);

        $this->assertFalse($msg->hasKey($ns, $key),
                           $error_message);
    }
}

