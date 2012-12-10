<?php

/**
 * A PostgreSQL store.
 *
 * @package OpenID
 */

/**
 * Require the base class file.
 */
require_once "Auth/OpenID/SQLStore.php";

/**
 * An SQL store that uses PostgreSQL as its backend.
 *
 * @package OpenID
 */
class Auth_OpenID_PostgreSQLStore extends Auth_OpenID_SQLStore {
    /**
     * @access private
     */
    function setSQL()
    {
        $this->sql['nonce_table'] =
            "CREATE TABLE %s (server_url VARCHAR(2047) NOT NULL, ".
                             "timestamp INTEGER NOT NULL, ".
                             "salt CHAR(40) NOT NULL, ".
                "UNIQUE (server_url, timestamp, salt))";

        $this->sql['assoc_table'] =
            "CREATE TABLE %s (server_url VARCHAR(2047) NOT NULL, ". 
                             "handle VARCHAR(255) NOT NULL, ".
                             "secret BYTEA NOT NULL, ".
                             "issued INTEGER NOT NULL, ".
                             "lifetime INTEGER NOT NULL, ".
                             "assoc_type VARCHAR(64) NOT NULL, ".
            "PRIMARY KEY (server_url, handle), ".
            "CONSTRAINT secret_length_constraint CHECK ".
            "(LENGTH(secret) <= 128))";

        $this->sql['set_assoc'] =
            array(
                  'insert_assoc' => "INSERT INTO %s (server_url, handle, ".
                  "secret, issued, lifetime, assoc_type) VALUES ".
                  "(?, ?, '!', ?, ?, ?)",
                  'update_assoc' => "UPDATE %s SET secret = '!', issued = ?, ".
                  "lifetime = ?, assoc_type = ? WHERE server_url = ? AND ".
                  "handle = ?"
                  );

        $this->sql['get_assocs'] =
            "SELECT handle, secret, issued, lifetime, assoc_type FROM %s ".
            "WHERE server_url = ?";

        $this->sql['get_assoc'] =
            "SELECT handle, secret, issued, lifetime, assoc_type FROM %s ".
            "WHERE server_url = ? AND handle = ?";

        $this->sql['remove_assoc'] =
            "DELETE FROM %s WHERE server_url = ? AND handle = ?";

        $this->sql['add_nonce'] =
                  "INSERT INTO %s (server_url, timestamp, salt) VALUES ".
                  "(?, ?, ?)"
                  ;

        $this->sql['clean_nonce'] =
            "DELETE FROM %s WHERE timestamp < ?";

        $this->sql['clean_assoc'] =
            "DELETE FROM %s WHERE issued + lifetime < ?";
    }

    /**
     * @access private
     */
    function _set_assoc($server_url, $handle, $secret, $issued, $lifetime,
                        $assoc_type)
    {
        $result = $this->_get_assoc($server_url, $handle);
        if ($result) {
            // Update the table since this associations already exists.
            $this->connection->query($this->sql['set_assoc']['update_assoc'],
                                     array($secret, $issued, $lifetime,
                                           $assoc_type, $server_url, $handle));
        } else {
            // Insert a new record because this association wasn't
            // found.
            $this->connection->query($this->sql['set_assoc']['insert_assoc'],
                                     array($server_url, $handle, $secret,
                                           $issued, $lifetime, $assoc_type));
        }
    }

    /**
     * @access private
     */
    function blobEncode($blob)
    {
        return $this->_octify($blob);
    }

    /**
     * @access private
     */
    function blobDecode($blob)
    {
        return $this->_unoctify($blob);
    }
}

