<?php

/**
 * A MySQL store.
 *
 * @package OpenID
 */

/**
 * Require the base class file.
 */
require_once "Auth/OpenID/SQLStore.php";

/**
 * An SQL store that uses MySQL as its backend.
 *
 * @package OpenID
 */
class Auth_OpenID_MySQLStore extends Auth_OpenID_SQLStore {
    /**
     * @access private
     */
    function setSQL()
    {
        $this->sql['nonce_table'] =
            "CREATE TABLE %s (\n".
            "  server_url VARCHAR(2047) NOT NULL,\n".
            "  timestamp INTEGER NOT NULL,\n".
            "  salt CHAR(40) NOT NULL,\n".
            "  UNIQUE (server_url(255), timestamp, salt)\n".
            ") ENGINE=InnoDB";

        $this->sql['assoc_table'] =
            "CREATE TABLE %s (\n".
            "  server_url VARCHAR(2047) NOT NULL,\n".
            "  handle VARCHAR(255) NOT NULL,\n".
            "  secret BLOB NOT NULL,\n".
            "  issued INTEGER NOT NULL,\n".
            "  lifetime INTEGER NOT NULL,\n".
            "  assoc_type VARCHAR(64) NOT NULL,\n".
            "  PRIMARY KEY (server_url(255), handle)\n".
            ") ENGINE=InnoDB";

        $this->sql['set_assoc'] =
            "REPLACE INTO %s (server_url, handle, secret, issued,\n".
            "  lifetime, assoc_type) VALUES (?, ?, !, ?, ?, ?)";

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
    function blobEncode($blob)
    {
        return "0x" . bin2hex($blob);
    }
}

