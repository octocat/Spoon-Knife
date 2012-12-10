<?php

/**
 * An SQLite store.
 *
 * @package OpenID
 */

/**
 * Require the base class file.
 */
require_once "Auth/OpenID/SQLStore.php";

/**
 * An SQL store that uses SQLite as its backend.
 *
 * @package OpenID
 */
class Auth_OpenID_SQLiteStore extends Auth_OpenID_SQLStore {
    function setSQL()
    {
        $this->sql['nonce_table'] =
            "CREATE TABLE %s (server_url VARCHAR(2047), timestamp INTEGER, ".
            "salt CHAR(40), UNIQUE (server_url, timestamp, salt))";

        $this->sql['assoc_table'] =
            "CREATE TABLE %s (server_url VARCHAR(2047), handle VARCHAR(255), ".
            "secret BLOB(128), issued INTEGER, lifetime INTEGER, ".
            "assoc_type VARCHAR(64), PRIMARY KEY (server_url, handle))";

        $this->sql['set_assoc'] =
            "INSERT OR REPLACE INTO %s VALUES (?, ?, ?, ?, ?, ?)";

        $this->sql['get_assocs'] =
            "SELECT handle, secret, issued, lifetime, assoc_type FROM %s ".
            "WHERE server_url = ?";

        $this->sql['get_assoc'] =
            "SELECT handle, secret, issued, lifetime, assoc_type FROM %s ".
            "WHERE server_url = ? AND handle = ?";

        $this->sql['remove_assoc'] =
            "DELETE FROM %s WHERE server_url = ? AND handle = ?";

        $this->sql['add_nonce'] =
            "INSERT INTO %s (server_url, timestamp, salt) VALUES (?, ?, ?)";

        $this->sql['clean_nonce'] =
            "DELETE FROM %s WHERE timestamp < ?";

        $this->sql['clean_assoc'] =
            "DELETE FROM %s WHERE issued + lifetime < ?";
    }

    /**
     * @access private
     */
    function _add_nonce($server_url, $timestamp, $salt)
    {
        // PECL SQLite extensions 1.0.3 and older (1.0.3 is the
        // current release at the time of this writing) have a broken
        // sqlite_escape_string function that breaks when passed the
        // empty string. Prefixing all strings with one character
        // keeps them unique and avoids this bug. The nonce table is
        // write-only, so we don't have to worry about updating other
        // functions with this same bad hack.
        return parent::_add_nonce('x' . $server_url, $timestamp, $salt);
    }
}

