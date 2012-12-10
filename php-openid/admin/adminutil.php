<?php

/**
 * Add a directory to the include path
 *
 * @param dir: The directory to add to the path
 * @param at_start: If true, place this directory at the beginning of
 * the include path. Otherwise, place it at the end.
 */
function includeAdd($dir, $at_start=false)
{
    $path = ini_get('include_path');
    if (strlen($path)) {
        $newpath = $at_start ? "$dir:$path" : "$path:$dir";
    } else {
        $newpath = $dir;
    }

    ini_set('include_path', $newpath);
}

/**
 * Return the parent directory of this module.
 */
function getParent()
{
    return dirname(dirname(realpath(__FILE__)));
}

?>