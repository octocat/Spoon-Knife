<?php

/**
 * Utilites for test functions
 */

function Tests_Auth_Yadis_datafile($name, $reader)
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

function Tests_Auth_Yadis_readdata($name)
{
    return Tests_Auth_Yadis_datafile($name, 'file_get_contents');
}

function Tests_Auth_Yadis_readlines($name)
{
    return Tests_Auth_Yadis_datafile($name, 'file');
}


