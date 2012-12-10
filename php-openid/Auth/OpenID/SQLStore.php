<?php

/**
 * SQL-backed OpenID stores.
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
 * @access private
 */
require_once 'Auth/OpenID/Interface.php';
require_once 'Auth/OpenID/Nonce.php';

/**
 * @access private
 */
require_once 'Auth/OpenID.php';

/**
 * @access private
 */
require_once 'Auth/OpenID/Nonce.php';

/**
 * This is the parent class for the SQL stores, which contains the
 * logic common to all of the SQL stores.
 *
 * The table names used are determined by the class variables
 * associations_table_name and nonces_table_name.  To change the name
 * of the tables used, pass new table names into the constructor.
 *
 * To create the tables with the proper schema, see the createTables
 * method.
 *
 * This class shouldn't be used directly.  Use one of its subclasses
 * instead, as those contain the code necessary to use a specific
 * database.  If you're an OpenID integrator and you'd like to create
 * an SQL-driven store that wraps an application's database
 * abstraction, be sure to create a subclass of
 * {@link Auth_OpenID_DatabaseConnection} that calls the application's
 * database abstraction calls.  Then, pass an instance of your new
 * database connection class to your SQLStore subclass constructor.
 *
 * All methods other than the constructor and createTables should be
 * considered implementation details.
 *
 * @package OpenID
 */
class Auth_OpenID_SQLStore extends Auth_OpenID_OpenIDStore {

    /**
     * This creates a new SQLStore instance.  It requires an
     * established database connection be given to it, and it allows
     * overriding the default table names.
     *
     * @param connection $connection This must be an established
     * connection to a database of the correct type for the SQLStore
     * subclass you're using.  This must either be an PEAR DB
     * connection handle or an instance of a subclass of
     * Auth_OpenID_DatabaseConnection.
     *
     * @param associations_table: This is an optional parameter to
     * specify the name of the table used for storing associations.
     * The default value is 'oid_associations'.
     *
     * @param nonces_table: This is an optional parameter to specify
     * the name of the table used for storing nonces.  The default
     * value is 'oid_nonces'.
     */
    function Auth_OpenID_SQLStore($connection,
                                  $associations_table = null,
                                  $nonces_table = null)
    {
        $this->associations_table_name = "oid_associations";
        $this->nonces_table_name = "oid_nonces";

        // Check the connection object type to be sure it's a PEAR
        // database connection.
        if (!(is_object($connection) &&
              (is_subclass_of($connection, 'db_common') ||
               is_subclass_of($connection,
                              'auth_openid_databaseconnection')))) {
            trigger_error("Auth_OpenID_SQLStore expected PEAR connection " .
                          "object (got ".get_class($connection).")",
                          E_USER_ERROR);
            return;
        }

        $this->connection = $connection;

        // Be sure to set the fetch mode so the results are keyed on
        // column name instead of column index.  This is a PEAR
        // constant, so only try to use it if PEAR is present.  Note
        // that Auth_Openid_Databaseconnection instances need not
        // implement ::setFetchMode for this reason.
        if (is_subclass_of($this->connection, 'db_common')) {
            $this->connection->setFetchMode(DB_FETCHMODE_ASSOC);
        }

        if ($associations_table) {
            $this->associations_table_name = $associations_table;
        }

        if ($nonces_table) {
            $this->nonces_table_name = $nonces_table;
        }

        $this->max_nonce_age = 6 * 60 * 60;

        // Be sure to run the database queries with auto-commit mode
        // turned OFF, because we want every function to run in a
        // transaction, implicitly.  As a rule, methods named with a
        // leading underscore will NOT control transaction behavior.
        // Callers of these methods will worry about transactions.
        $this->connection->autoCommit(false);

        // Create an empty SQL strings array.
        $this->sql = array();

        // Call this method (which should be overridden by subclasses)
        // to populate the $this->sql array with SQL strings.
        $this->setSQL();

        // Verify that all required SQL statements have been set, and
        // raise an error if any expected SQL strings were either
        // absent or empty.
        list($missing, $empty) = $this->_verifySQL();

        if ($missing) {
            trigger_error("Expected keys in SQL query list: " .
                          implode(", ", $missing),
                          E_USER_ERROR);
            return;
        }

        if ($empty) {
            trigger_error("SQL list keys have no SQL strings: " .
                          implode(", ", $empty),
                          E_USER_ERROR);
            return;
        }

        // Add table names to queries.
        $this->_fixSQL();
    }

    function tableExists($table_name)
    {
        return !$this->isError(
                      $this->connection->query(
                          sprintf("SELECT * FROM %s LIMIT 0",
                                  $table_name)));
    }

    /**
     * Returns true if $value constitutes a database error; returns
     * false otherwise.
     */
    function isError($value)
    {
        return PEAR::isError($value);
    }

    /**
     * Converts a query result to a boolean.  If the result is a
     * database error according to $this->isError(), this returns
     * false; otherwise, this returns true.
     */
    function resultToBool($obj)
    {
        if ($this->isError($obj)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * This method should be overridden by subclasses.  This method is
     * called by the constructor to set values in $this->sql, which is
     * an array keyed on sql name.
     */
    function setSQL()
    {
    }

    /**
     * Resets the store by removing all records from the store's
     * tables.
     */
    function reset()
    {
        $this->connection->query(sprintf("DELETE FROM %s",
                                         $this->associations_table_name));

        $this->connection->query(sprintf("DELETE FROM %s",
                                         $this->nonces_table_name));
    }

    /**
     * @access private
     */
    function _verifySQL()
    {
        $missing = array();
        $empty = array();

        $required_sql_keys = array(
                                   'nonce_table',
                                   'assoc_table',
                                   'set_assoc',
                                   'get_assoc',
                                   'get_assocs',
                                   'remove_assoc'
                                   );

        foreach ($required_sql_keys as $key) {
            if (!array_key_exists($key, $this->sql)) {
                $missing[] = $key;
            } else if (!$this->sql[$key]) {
                $empty[] = $key;
            }
        }

        return array($missing, $empty);
    }

    /**
     * @access private
     */
    function _fixSQL()
    {
        $replacements = array(
                              array(
                                    'value' => $this->nonces_table_name,
                                    'keys' => array('nonce_table',
                                                    'add_nonce',
                                                    'clean_nonce')
                                    ),
                              array(
                                    'value' => $this->associations_table_name,
                                    'keys' => array('assoc_table',
                                                    'set_assoc',
                                                    'get_assoc',
                                                    'get_assocs',
                                                    'remove_assoc',
                                                    'clean_assoc')
                                    )
                              );

        foreach ($replacements as $item) {
            $value = $item['value'];
            $keys = $item['keys'];

            foreach ($keys as $k) {
                if (is_array($this->sql[$k])) {
                    foreach ($this->sql[$k] as $part_key => $part_value) {
                        $this->sql[$k][$part_key] = sprintf($part_value,
                                                            $value);
                    }
                } else {
                    $this->sql[$k] = sprintf($this->sql[$k], $value);
                }
            }
        }
    }

    function blobDecode($blob)
    {
        return $blob;
    }

    function blobEncode($str)
    {
        return $str;
    }

    function createTables()
    {
        $this->connection->autoCommit(true);
        $n = $this->create_nonce_table();
        $a = $this->create_assoc_table();
        $this->connection->autoCommit(false);

        if ($n && $a) {
            return true;
        } else {
            return false;
        }
    }

    function create_nonce_table()
    {
        if (!$this->tableExists($this->nonces_table_name)) {
            $r = $this->connection->query($this->sql['nonce_table']);
            return $this->resultToBool($r);
        }
        return true;
    }

    function create_assoc_table()
    {
        if (!$this->tableExists($this->associations_table_name)) {
            $r = $this->connection->query($this->sql['assoc_table']);
            return $this->resultToBool($r);
        }
        return true;
    }

    /**
     * @access private
     */
    function _set_assoc($server_url, $handle, $secret, $issued,
                        $lifetime, $assoc_type)
    {
        return $this->connection->query($this->sql['set_assoc'],
                                        array(
                                              $server_url,
                                              $handle,
                                              $secret,
                                              $issued,
                                              $lifetime,
                                              $assoc_type));
    }

    function storeAssociation($server_url, $association)
    {
        if ($this->resultToBool($this->_set_assoc(
                                            $server_url,
                                            $association->handle,
                                            $this->blobEncode(
                                                  $association->secret),
                                            $association->issued,
                                            $association->lifetime,
                                            $association->assoc_type
                                            ))) {
            $this->connection->commit();
        } else {
            $this->connection->rollback();
        }
    }

    /**
     * @access private
     */
    function _get_assoc($server_url, $handle)
    {
        $result = $this->connection->getRow($this->sql['get_assoc'],
                                            array($server_url, $handle));
        if ($this->isError($result)) {
            return null;
        } else {
            return $result;
        }
    }

    /**
     * @access private
     */
    function _get_assocs($server_url)
    {
        $result = $this->connection->getAll($this->sql['get_assocs'],
                                            array($server_url));

        if ($this->isError($result)) {
            return array();
        } else {
            return $result;
        }
    }

    function removeAssociation($server_url, $handle)
    {
        if ($this->_get_assoc($server_url, $handle) == null) {
            return false;
        }

        if ($this->resultToBool($this->connection->query(
                              $this->sql['remove_assoc'],
                              array($server_url, $handle)))) {
            $this->connection->commit();
        } else {
            $this->connection->rollback();
        }

        return true;
    }

    function getAssociation($server_url, $handle = null)
    {
        if ($handle !== null) {
            $assoc = $this->_get_assoc($server_url, $handle);

            $assocs = array();
            if ($assoc) {
                $assocs[] = $assoc;
            }
        } else {
            $assocs = $this->_get_assocs($server_url);
        }

        if (!$assocs || (count($assocs) == 0)) {
            return null;
        } else {
            $associations = array();

            foreach ($assocs as $assoc_row) {
                $assoc = new Auth_OpenID_Association($assoc_row['handle'],
                                                     $assoc_row['secret'],
                                                     $assoc_row['issued'],
                                                     $assoc_row['lifetime'],
                                                     $assoc_row['assoc_type']);

                $assoc->secret = $this->blobDecode($assoc->secret);

                if ($assoc->getExpiresIn() == 0) {
                    $this->removeAssociation($server_url, $assoc->handle);
                } else {
                    $associations[] = array($assoc->issued, $assoc);
                }
            }

            if ($associations) {
                $issued = array();
                $assocs = array();
                foreach ($associations as $key => $assoc) {
                    $issued[$key] = $assoc[0];
                    $assocs[$key] = $assoc[1];
                }

                array_multisort($issued, SORT_DESC, $assocs, SORT_DESC,
                                $associations);

                // return the most recently issued one.
                list($issued, $assoc) = $associations[0];
                return $assoc;
            } else {
                return null;
            }
        }
    }

    /**
     * @access private
     */
    function _add_nonce($server_url, $timestamp, $salt)
    {
        $sql = $this->sql['add_nonce'];
        $result = $this->connection->query($sql, array($server_url,
                                                       $timestamp,
                                                       $salt));
        if ($this->isError($result)) {
            $this->connection->rollback();
        } else {
            $this->connection->commit();
        }
        return $this->resultToBool($result);
    }

    function useNonce($server_url, $timestamp, $salt)
    {
        global $Auth_OpenID_SKEW;

        if ( abs($timestamp - time()) > $Auth_OpenID_SKEW ) {
            return false;
        }

        return $this->_add_nonce($server_url, $timestamp, $salt);
    }

    /**
     * "Octifies" a binary string by returning a string with escaped
     * octal bytes.  This is used for preparing binary data for
     * PostgreSQL BYTEA fields.
     *
     * @access private
     */
    function _octify($str)
    {
        $result = "";
        for ($i = 0; $i < Auth_OpenID::bytes($str); $i++) {
            $ch = substr($str, $i, 1);
            if ($ch == "\\") {
                $result .= "\\\\\\\\";
            } else if (ord($ch) == 0) {
                $result .= "\\\\000";
            } else {
                $result .= "\\" . strval(decoct(ord($ch)));
            }
        }
        return $result;
    }

    /**
     * "Unoctifies" octal-escaped data from PostgreSQL and returns the
     * resulting ASCII (possibly binary) string.
     *
     * @access private
     */
    function _unoctify($str)
    {
        $result = "";
        $i = 0;
        while ($i < strlen($str)) {
            $char = $str[$i];
            if ($char == "\\") {
                // Look to see if the next char is a backslash and
                // append it.
                if ($str[$i + 1] != "\\") {
                    $octal_digits = substr($str, $i + 1, 3);
                    $dec = octdec($octal_digits);
                    $char = chr($dec);
                    $i += 4;
                } else {
                    $char = "\\";
                    $i += 2;
                }
            } else {
                $i += 1;
            }

            $result .= $char;
        }

        return $result;
    }

    function cleanupNonces()
    {
        global $Auth_OpenID_SKEW;
        $v = time() - $Auth_OpenID_SKEW;

        $this->connection->query($this->sql['clean_nonce'], array($v));
        $num = $this->connection->affectedRows();
        $this->connection->commit();
        return $num;
    }

    function cleanupAssociations()
    {
        $this->connection->query($this->sql['clean_assoc'],
                                 array(time()));
        $num = $this->connection->affectedRows();
        $this->connection->commit();
        return $num;
    }
}


