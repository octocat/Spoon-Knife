<?php

/**
 * This file supplies a Memcached store backend for OpenID servers and
 * consumers.
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

/**
 * Require base class for creating a new interface.
 */
require_once 'Auth/OpenID.php';
require_once 'Auth/OpenID/Interface.php';
require_once 'Auth/OpenID/HMAC.php';
require_once 'Auth/OpenID/Nonce.php';

/**
 * This is a filesystem-based store for OpenID associations and
 * nonces.  This store should be safe for use in concurrent systems on
 * both windows and unix (excluding NFS filesystems).  There are a
 * couple race conditions in the system, but those failure cases have
 * been set up in such a way that the worst-case behavior is someone
 * having to try to log in a second time.
 *
 * Most of the methods of this class are implementation details.
 * People wishing to just use this store need only pay attention to
 * the constructor.
 *
 * @package OpenID
 */
class Auth_OpenID_FileStore extends Auth_OpenID_OpenIDStore {

    /**
     * Initializes a new {@link Auth_OpenID_FileStore}.  This
     * initializes the nonce and association directories, which are
     * subdirectories of the directory passed in.
     *
     * @param string $directory This is the directory to put the store
     * directories in.
     */
    function Auth_OpenID_FileStore($directory)
    {
        if (!Auth_OpenID::ensureDir($directory)) {
            trigger_error('Not a directory and failed to create: '
                          . $directory, E_USER_ERROR);
        }
        $directory = realpath($directory);

        $this->directory = $directory;
        $this->active = true;

        $this->nonce_dir = $directory . DIRECTORY_SEPARATOR . 'nonces';

        $this->association_dir = $directory . DIRECTORY_SEPARATOR .
            'associations';

        // Temp dir must be on the same filesystem as the assciations
        // $directory.
        $this->temp_dir = $directory . DIRECTORY_SEPARATOR . 'temp';

        $this->max_nonce_age = 6 * 60 * 60; // Six hours, in seconds

        if (!$this->_setup()) {
            trigger_error('Failed to initialize OpenID file store in ' .
                          $directory, E_USER_ERROR);
        }
    }

    function destroy()
    {
        Auth_OpenID_FileStore::_rmtree($this->directory);
        $this->active = false;
    }

    /**
     * Make sure that the directories in which we store our data
     * exist.
     *
     * @access private
     */
    function _setup()
    {
        return (Auth_OpenID::ensureDir($this->nonce_dir) &&
                Auth_OpenID::ensureDir($this->association_dir) &&
                Auth_OpenID::ensureDir($this->temp_dir));
    }

    /**
     * Create a temporary file on the same filesystem as
     * $this->association_dir.
     *
     * The temporary directory should not be cleaned if there are any
     * processes using the store. If there is no active process using
     * the store, it is safe to remove all of the files in the
     * temporary directory.
     *
     * @return array ($fd, $filename)
     * @access private
     */
    function _mktemp()
    {
        $name = Auth_OpenID_FileStore::_mkstemp($dir = $this->temp_dir);
        $file_obj = @fopen($name, 'wb');
        if ($file_obj !== false) {
            return array($file_obj, $name);
        } else {
            Auth_OpenID_FileStore::_removeIfPresent($name);
        }
    }

    function cleanupNonces()
    {
        global $Auth_OpenID_SKEW;

        $nonces = Auth_OpenID_FileStore::_listdir($this->nonce_dir);
        $now = time();

        $removed = 0;
        // Check all nonces for expiry
        foreach ($nonces as $nonce_fname) {
            $base = basename($nonce_fname);
            $parts = explode('-', $base, 2);
            $timestamp = $parts[0];
            $timestamp = intval($timestamp, 16);
            if (abs($timestamp - $now) > $Auth_OpenID_SKEW) {
                Auth_OpenID_FileStore::_removeIfPresent($nonce_fname);
                $removed += 1;
            }
        }
        return $removed;
    }

    /**
     * Create a unique filename for a given server url and
     * handle. This implementation does not assume anything about the
     * format of the handle. The filename that is returned will
     * contain the domain name from the server URL for ease of human
     * inspection of the data directory.
     *
     * @return string $filename
     */
    function getAssociationFilename($server_url, $handle)
    {
        if (!$this->active) {
            trigger_error("FileStore no longer active", E_USER_ERROR);
            return null;
        }

        if (strpos($server_url, '://') === false) {
            trigger_error(sprintf("Bad server URL: %s", $server_url),
                          E_USER_WARNING);
            return null;
        }

        list($proto, $rest) = explode('://', $server_url, 2);
        $parts = explode('/', $rest);
        $domain = Auth_OpenID_FileStore::_filenameEscape($parts[0]);
        $url_hash = Auth_OpenID_FileStore::_safe64($server_url);
        if ($handle) {
            $handle_hash = Auth_OpenID_FileStore::_safe64($handle);
        } else {
            $handle_hash = '';
        }

        $filename = sprintf('%s-%s-%s-%s', $proto, $domain, $url_hash,
                            $handle_hash);

        return $this->association_dir. DIRECTORY_SEPARATOR . $filename;
    }

    /**
     * Store an association in the association directory.
     */
    function storeAssociation($server_url, $association)
    {
        if (!$this->active) {
            trigger_error("FileStore no longer active", E_USER_ERROR);
            return false;
        }

        $association_s = $association->serialize();
        $filename = $this->getAssociationFilename($server_url,
                                                  $association->handle);
        list($tmp_file, $tmp) = $this->_mktemp();

        if (!$tmp_file) {
            trigger_error("_mktemp didn't return a valid file descriptor",
                          E_USER_WARNING);
            return false;
        }

        fwrite($tmp_file, $association_s);

        fflush($tmp_file);

        fclose($tmp_file);

        if (@rename($tmp, $filename)) {
            return true;
        } else {
            // In case we are running on Windows, try unlinking the
            // file in case it exists.
            @unlink($filename);

            // Now the target should not exist. Try renaming again,
            // giving up if it fails.
            if (@rename($tmp, $filename)) {
                return true;
            }
        }

        // If there was an error, don't leave the temporary file
        // around.
        Auth_OpenID_FileStore::_removeIfPresent($tmp);
        return false;
    }

    /**
     * Retrieve an association. If no handle is specified, return the
     * association with the most recent issue time.
     *
     * @return mixed $association
     */
    function getAssociation($server_url, $handle = null)
    {
        if (!$this->active) {
            trigger_error("FileStore no longer active", E_USER_ERROR);
            return null;
        }

        if ($handle === null) {
            $handle = '';
        }

        // The filename with the empty handle is a prefix of all other
        // associations for the given server URL.
        $filename = $this->getAssociationFilename($server_url, $handle);

        if ($handle) {
            return $this->_getAssociation($filename);
        } else {
            $association_files =
                Auth_OpenID_FileStore::_listdir($this->association_dir);
            $matching_files = array();

            // strip off the path to do the comparison
            $name = basename($filename);
            foreach ($association_files as $association_file) {
                $base = basename($association_file);
                if (strpos($base, $name) === 0) {
                    $matching_files[] = $association_file;
                }
            }

            $matching_associations = array();
            // read the matching files and sort by time issued
            foreach ($matching_files as $full_name) {
                $association = $this->_getAssociation($full_name);
                if ($association !== null) {
                    $matching_associations[] = array($association->issued,
                                                     $association);
                }
            }

            $issued = array();
            $assocs = array();
            foreach ($matching_associations as $key => $assoc) {
                $issued[$key] = $assoc[0];
                $assocs[$key] = $assoc[1];
            }

            array_multisort($issued, SORT_DESC, $assocs, SORT_DESC,
                            $matching_associations);

            // return the most recently issued one.
            if ($matching_associations) {
                list($issued, $assoc) = $matching_associations[0];
                return $assoc;
            } else {
                return null;
            }
        }
    }

    /**
     * @access private
     */
    function _getAssociation($filename)
    {
        if (!$this->active) {
            trigger_error("FileStore no longer active", E_USER_ERROR);
            return null;
        }

        $assoc_file = @fopen($filename, 'rb');

        if ($assoc_file === false) {
            return null;
        }

        $assoc_s = fread($assoc_file, filesize($filename));
        fclose($assoc_file);

        if (!$assoc_s) {
            return null;
        }

        $association =
            Auth_OpenID_Association::deserialize('Auth_OpenID_Association',
                                                $assoc_s);

        if (!$association) {
            Auth_OpenID_FileStore::_removeIfPresent($filename);
            return null;
        }

        if ($association->getExpiresIn() == 0) {
            Auth_OpenID_FileStore::_removeIfPresent($filename);
            return null;
        } else {
            return $association;
        }
    }

    /**
     * Remove an association if it exists. Do nothing if it does not.
     *
     * @return bool $success
     */
    function removeAssociation($server_url, $handle)
    {
        if (!$this->active) {
            trigger_error("FileStore no longer active", E_USER_ERROR);
            return null;
        }

        $assoc = $this->getAssociation($server_url, $handle);
        if ($assoc === null) {
            return false;
        } else {
            $filename = $this->getAssociationFilename($server_url, $handle);
            return Auth_OpenID_FileStore::_removeIfPresent($filename);
        }
    }

    /**
     * Return whether this nonce is present. As a side effect, mark it
     * as no longer present.
     *
     * @return bool $present
     */
    function useNonce($server_url, $timestamp, $salt)
    {
        global $Auth_OpenID_SKEW;

        if (!$this->active) {
            trigger_error("FileStore no longer active", E_USER_ERROR);
            return null;
        }

        if ( abs($timestamp - time()) > $Auth_OpenID_SKEW ) {
            return false;
        }

        if ($server_url) {
            list($proto, $rest) = explode('://', $server_url, 2);
        } else {
            $proto = '';
            $rest = '';
        }

        $parts = explode('/', $rest, 2);
        $domain = $this->_filenameEscape($parts[0]);
        $url_hash = $this->_safe64($server_url);
        $salt_hash = $this->_safe64($salt);

        $filename = sprintf('%08x-%s-%s-%s-%s', $timestamp, $proto,
                            $domain, $url_hash, $salt_hash);
        $filename = $this->nonce_dir . DIRECTORY_SEPARATOR . $filename;

        $result = @fopen($filename, 'x');

        if ($result === false) {
            return false;
        } else {
            fclose($result);
            return true;
        }
    }

    /**
     * Remove expired entries from the database. This is potentially
     * expensive, so only run when it is acceptable to take time.
     *
     * @access private
     */
    function _allAssocs()
    {
        $all_associations = array();

        $association_filenames =
            Auth_OpenID_FileStore::_listdir($this->association_dir);

        foreach ($association_filenames as $association_filename) {
            $association_file = fopen($association_filename, 'rb');

            if ($association_file !== false) {
                $assoc_s = fread($association_file,
                                 filesize($association_filename));
                fclose($association_file);

                // Remove expired or corrupted associations
                $association =
                  Auth_OpenID_Association::deserialize(
                         'Auth_OpenID_Association', $assoc_s);

                if ($association === null) {
                    Auth_OpenID_FileStore::_removeIfPresent(
                                                 $association_filename);
                } else {
                    if ($association->getExpiresIn() == 0) {
                        $all_associations[] = array($association_filename,
                                                    $association);
                    }
                }
            }
        }

        return $all_associations;
    }

    function clean()
    {
        if (!$this->active) {
            trigger_error("FileStore no longer active", E_USER_ERROR);
            return null;
        }

        $nonces = Auth_OpenID_FileStore::_listdir($this->nonce_dir);
        $now = time();

        // Check all nonces for expiry
        foreach ($nonces as $nonce) {
            if (!Auth_OpenID_checkTimestamp($nonce, $now)) {
                $filename = $this->nonce_dir . DIRECTORY_SEPARATOR . $nonce;
                Auth_OpenID_FileStore::_removeIfPresent($filename);
            }
        }

        foreach ($this->_allAssocs() as $pair) {
            list($assoc_filename, $assoc) = $pair;
            if ($assoc->getExpiresIn() == 0) {
                Auth_OpenID_FileStore::_removeIfPresent($assoc_filename);
            }
        }
    }

    /**
     * @access private
     */
    function _rmtree($dir)
    {
        if ($dir[strlen($dir) - 1] != DIRECTORY_SEPARATOR) {
            $dir .= DIRECTORY_SEPARATOR;
        }

        if ($handle = opendir($dir)) {
            while ($item = readdir($handle)) {
                if (!in_array($item, array('.', '..'))) {
                    if (is_dir($dir . $item)) {

                        if (!Auth_OpenID_FileStore::_rmtree($dir . $item)) {
                            return false;
                        }
                    } else if (is_file($dir . $item)) {
                        if (!unlink($dir . $item)) {
                            return false;
                        }
                    }
                }
            }

            closedir($handle);

            if (!@rmdir($dir)) {
                return false;
            }

            return true;
        } else {
            // Couldn't open directory.
            return false;
        }
    }

    /**
     * @access private
     */
    function _mkstemp($dir)
    {
        foreach (range(0, 4) as $i) {
            $name = tempnam($dir, "php_openid_filestore_");

            if ($name !== false) {
                return $name;
            }
        }
        return false;
    }

    /**
     * @access private
     */
    static function _mkdtemp($dir)
    {
        foreach (range(0, 4) as $i) {
            $name = $dir . strval(DIRECTORY_SEPARATOR) . strval(getmypid()) .
                "-" . strval(rand(1, time()));
            if (!mkdir($name, 0700)) {
                return false;
            } else {
                return $name;
            }
        }
        return false;
    }

    /**
     * @access private
     */
    function _listdir($dir)
    {
        $handle = opendir($dir);
        $files = array();
        while (false !== ($filename = readdir($handle))) {
            if (!in_array($filename, array('.', '..'))) {
                $files[] = $dir . DIRECTORY_SEPARATOR . $filename;
            }
        }
        return $files;
    }

    /**
     * @access private
     */
    function _isFilenameSafe($char)
    {
        $_Auth_OpenID_filename_allowed = Auth_OpenID_letters .
            Auth_OpenID_digits . ".";
        return (strpos($_Auth_OpenID_filename_allowed, $char) !== false);
    }

    /**
     * @access private
     */
    function _safe64($str)
    {
        $h64 = base64_encode(Auth_OpenID_SHA1($str));
        $h64 = str_replace('+', '_', $h64);
        $h64 = str_replace('/', '.', $h64);
        $h64 = str_replace('=', '', $h64);
        return $h64;
    }

    /**
     * @access private
     */
    function _filenameEscape($str)
    {
        $filename = "";
        $b = Auth_OpenID::toBytes($str);

        for ($i = 0; $i < count($b); $i++) {
            $c = $b[$i];
            if (Auth_OpenID_FileStore::_isFilenameSafe($c)) {
                $filename .= $c;
            } else {
                $filename .= sprintf("_%02X", ord($c));
            }
        }
        return $filename;
    }

    /**
     * Attempt to remove a file, returning whether the file existed at
     * the time of the call.
     *
     * @access private
     * @return bool $result True if the file was present, false if not.
     */
    function _removeIfPresent($filename)
    {
        return @unlink($filename);
    }

    function cleanupAssociations()
    {
        $removed = 0;
        foreach ($this->_allAssocs() as $pair) {
            list($assoc_filename, $assoc) = $pair;
            if ($assoc->getExpiresIn() == 0) {
                $this->_removeIfPresent($assoc_filename);
                $removed += 1;
            }
        }
        return $removed;
    }
}


