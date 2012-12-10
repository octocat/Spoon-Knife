<?php

/**
 * SQL-backed OpenID stores for use with PEAR::MDB2.
 *
 * PHP versions 4 and 5
 *
 * LICENSE: See the COPYING file included in this distribution.
 *
 * @package OpenID
 * @author JanRain, Inc. <openid@janrain.com>
 * @copyright 2005 Janrain, Inc.
 * @license http://www.gnu.org/copyleft/lesser.html LGPL
 */

require_once 'MDB2.php';

/**
 * @access private
 */
require_once 'Auth/OpenID/Interface.php';

/**
 * @access private
 */
require_once 'Auth/OpenID.php';

/**
 * @access private
 */
require_once 'Auth/OpenID/Nonce.php';

/**
 * This store uses a PEAR::MDB2 connection to store persistence
 * information.
 *
 * The table names used are determined by the class variables
 * associations_table_name and nonces_table_name.  To change the name
 * of the tables used, pass new table names into the constructor.
 *
 * To create the tables with the proper schema, see the createTables
 * method.
 *
 * @package OpenID
 */
class Auth_OpenID_MDB2Store extends Auth_OpenID_OpenIDStore {
    /**
     * This creates a new MDB2Store instance.  It requires an
     * established database connection be given to it, and it allows
     * overriding the default table names.
     *
     * @param connection $connection This must be an established
     * connection to a database of the correct type for the SQLStore
     * subclass you're using.  This must be a PEAR::MDB2 connection
     * handle.
     *
     * @param associations_table: This is an optional parameter to
     * specify the name of the table used for storing associations.
     * The default value is 'oid_associations'.
     *
     * @param nonces_table: This is an optional parameter to specify
     * the name of the table used for storing nonces.  The default
     * value is 'oid_nonces'.
     */
    function Auth_OpenID_MDB2Store($connection,
                                  $associations_table = null,
                                  $nonces_table = null)
    {
        $this->associations_table_name = "oid_associations";
        $this->nonces_table_name = "oid_nonces";

        // Check the connection object type to be sure it's a PEAR
        // database connection.
        if (!is_object($connection) ||
            !is_subclass_of($connection, 'mdb2_driver_common')) {
            trigger_error("Auth_OpenID_MDB2Store expected PEAR connection " .
                          "object (got ".get_class($connection).")",
                          E_USER_ERROR);
            return;
        }

        $this->connection = $connection;

        // Be sure to set the fetch mode so the results are keyed on
        // column name instead of column index.
        $this->connection->setFetchMode(MDB2_FETCHMODE_ASSOC);
        
        if (PEAR::isError($this->connection->loadModule('Extended'))) {
            trigger_error("Unable to load MDB2_Extended module", E_USER_ERROR);
            return;
        }

        if ($associations_table) {
            $this->associations_table_name = $associations_table;
        }

        if ($nonces_table) {
            $this->nonces_table_name = $nonces_table;
        }

        $this->max_nonce_age = 6 * 60 * 60;
    }

    function tableExists($table_name)
    {
        return !PEAR::isError($this->connection->query(
                                  sprintf("SELECT * FROM %s LIMIT 0",
                                          $table_name)));
    }

    function createTables()
    {
        $n = $this->create_nonce_table();
        $a = $this->create_assoc_table();

        if (!$n || !$a) {
            return false;
        }
        return true;
    }

    function create_nonce_table()
    {
        if (!$this->tableExists($this->nonces_table_name)) {
            switch ($this->connection->phptype) {
                case "mysql":
                case "mysqli":
                    // Custom SQL for MySQL to use InnoDB and variable-
                    // length keys
                    $r = $this->connection->exec(
                        sprintf("CREATE TABLE %s (\n".
                                "  server_url VARCHAR(2047) NOT NULL DEFAULT '',\n".
                                "  timestamp INTEGER NOT NULL,\n".
                                "  salt CHAR(40) NOT NULL,\n".
                                "  UNIQUE (server_url(255), timestamp, salt)\n".
                                ") TYPE=InnoDB",
                                $this->nonces_table_name));
                    if (PEAR::isError($r)) {
                        return false;
                    }
                    break;
                default:
                    if (PEAR::isError(
                        $this->connection->loadModule('Manager'))) {
                        return false;
                    }
                    $fields = array(
                        "server_url" => array(
                            "type" => "text",
                            "length" => 2047,
                            "notnull" => true
                        ),
                        "timestamp" => array(
                            "type" => "integer",
                            "notnull" => true
                        ),
                        "salt" => array(
                            "type" => "text",
                            "length" => 40,
                            "fixed" => true,
                            "notnull" => true
                        )
                    );
                    $constraint = array(
                        "unique" => 1,
                        "fields" => array(
                            "server_url" => true,
                            "timestamp" => true,
                            "salt" => true
                        )
                    );
                    
                    $r = $this->connection->createTable($this->nonces_table_name,
                                                        $fields);
                    if (PEAR::isError($r)) {
                        return false;
                    }
                    
                    $r = $this->connection->createConstraint(
                        $this->nonces_table_name,
                        $this->nonces_table_name . "_constraint",
                        $constraint);
                    if (PEAR::isError($r)) {
                        return false;
                    }
                    break;
            }
        }
        return true;
    }

    function create_assoc_table()
    {
        if (!$this->tableExists($this->associations_table_name)) {
            switch ($this->connection->phptype) {
                case "mysql":
                case "mysqli":
                    // Custom SQL for MySQL to use InnoDB and variable-
                    // length keys
                    $r = $this->connection->exec(
                        sprintf("CREATE TABLE %s(\n".
                                "  server_url VARCHAR(2047) NOT NULL DEFAULT '',\n".
                                "  handle VARCHAR(255) NOT NULL,\n".
                                "  secret BLOB NOT NULL,\n".
                                "  issued INTEGER NOT NULL,\n".
                                "  lifetime INTEGER NOT NULL,\n".
                                "  assoc_type VARCHAR(64) NOT NULL,\n".
                                "  PRIMARY KEY (server_url(255), handle)\n".
                                ") TYPE=InnoDB",
                            $this->associations_table_name));
                    if (PEAR::isError($r)) {
                        return false;
                    }
                    break;
                default:
                    if (PEAR::isError(
                        $this->connection->loadModule('Manager'))) {
                        return false;
                    }
                    $fields = array(
                        "server_url" => array(
                            "type" => "text",
                            "length" => 2047,
                            "notnull" => true
                        ),
                        "handle" => array(
                            "type" => "text",
                            "length" => 255,
                            "notnull" => true
                        ),
                        "secret" => array(
                            "type" => "blob",
                            "length" => "255",
                            "notnull" => true
                        ),
                        "issued" => array(
                            "type" => "integer",
                            "notnull" => true
                        ),
                        "lifetime" => array(
                            "type" => "integer",
                            "notnull" => true
                        ),
                        "assoc_type" => array(
                            "type" => "text",
                            "length" => 64,
                            "notnull" => true
                        )
                    );
                    $options = array(
                        "primary" => array(
                            "server_url" => true,
                            "handle" => true
                        )
                    );
                    
                    $r = $this->connection->createTable(
                        $this->associations_table_name,
                        $fields,
                        $options);
                    if (PEAR::isError($r)) {
                        return false;
                    }
                    break;
            }
        }
        return true;
    }

    function storeAssociation($server_url, $association)
    {
        $fields = array(
            "server_url" => array(
                "value" => $server_url,
                "key" => true
            ),
            "handle" => array(
                "value" => $association->handle,
                "key" => true
            ),
            "secret" => array(
                "value" => $association->secret,
                "type" => "blob"
            ),
            "issued" => array(
                "value" => $association->issued
            ),
            "lifetime" => array(
                "value" => $association->lifetime
            ),
            "assoc_type" => array(
                "value" => $association->assoc_type
            )
        );
        
        return !PEAR::isError($this->connection->replace(
                                  $this->associations_table_name,
                                  $fields));
    }

    function cleanupNonces()
    {
        global $Auth_OpenID_SKEW;
        $v = time() - $Auth_OpenID_SKEW;

        return $this->connection->exec(
            sprintf("DELETE FROM %s WHERE timestamp < %d",
                    $this->nonces_table_name, $v));
    }

    function cleanupAssociations()
    {
        return $this->connection->exec(
            sprintf("DELETE FROM %s WHERE issued + lifetime < %d",
                    $this->associations_table_name, time()));
    }

    function getAssociation($server_url, $handle = null)
    {
        $sql = "";
        $params = null;
        $types = array(
                       "text",
                       "blob",
                       "integer",
                       "integer",
                       "text"
                       );
        if ($handle !== null) {
            $sql = sprintf("SELECT handle, secret, issued, lifetime, assoc_type " .
                           "FROM %s WHERE server_url = ? AND handle = ?",
                           $this->associations_table_name);
            $params = array($server_url, $handle);
        } else {
            $sql = sprintf("SELECT handle, secret, issued, lifetime, assoc_type " .
                           "FROM %s WHERE server_url = ? ORDER BY issued DESC",
                           $this->associations_table_name);
            $params = array($server_url);
        }
        
        $assoc = $this->connection->getRow($sql, $types, $params);

        if (!$assoc || PEAR::isError($assoc)) {
            return null;
        } else {
            $association = new Auth_OpenID_Association($assoc['handle'],
                                                       stream_get_contents(
                                                           $assoc['secret']),
                                                       $assoc['issued'],
                                                       $assoc['lifetime'],
                                                       $assoc['assoc_type']);
            fclose($assoc['secret']);
            return $association;
        }
    }

    function removeAssociation($server_url, $handle)
    {
        $r = $this->connection->execParam(
            sprintf("DELETE FROM %s WHERE server_url = ? AND handle = ?",
                    $this->associations_table_name),
            array($server_url, $handle));
        
        if (PEAR::isError($r) || $r == 0) {
            return false;
        }
        return true;
    }

    function useNonce($server_url, $timestamp, $salt)
    {
        global $Auth_OpenID_SKEW;

        if (abs($timestamp - time()) > $Auth_OpenID_SKEW ) {
            return false;
        }
        
        $fields = array(
                        "timestamp" => $timestamp,
                        "salt" => $salt
                        );
        
        if (!empty($server_url)) {
            $fields["server_url"] = $server_url;
        }
        
        $r = $this->connection->autoExecute(
            $this->nonces_table_name,
            $fields,
            MDB2_AUTOQUERY_INSERT);
        
        if (PEAR::isError($r)) {
            return false;
        }
        return true;
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

}

?>
