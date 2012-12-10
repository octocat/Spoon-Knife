<?php

/**
 * This file supplies a memcached store backend for OpenID servers and
 * consumers.
 *
 * PHP versions 4 and 5
 *
 * LICENSE: See the COPYING file included in this distribution.
 *
 * @package OpenID
 * @author Artemy Tregubenko <me@arty.name>
 * @copyright 2008 JanRain, Inc.
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache
 * Contributed by Open Web Technologies <http://openwebtech.ru/>
 */

/**
 * Import the interface for creating a new store class.
 */
require_once 'Auth/OpenID/Interface.php';

/**
 * This is a memcached-based store for OpenID associations and
 * nonces. 
 * 
 * As memcache has limit of 250 chars for key length, 
 * server_url, handle and salt are hashed with sha1(). 
 *
 * Most of the methods of this class are implementation details.
 * People wishing to just use this store need only pay attention to
 * the constructor.
 *
 * @package OpenID
 */
class Auth_OpenID_MemcachedStore extends Auth_OpenID_OpenIDStore {

    /**
     * Initializes a new {@link Auth_OpenID_MemcachedStore} instance.
     * Just saves memcached object as property.
     *
     * @param resource connection Memcache connection resourse
     */
    function Auth_OpenID_MemcachedStore($connection, $compress = false)
    {
        $this->connection = $connection;
        $this->compress = $compress ? MEMCACHE_COMPRESSED : 0;
    }

    /**
     * Store association until its expiration time in memcached. 
     * Overwrites any existing association with same server_url and 
     * handle. Handles list of associations for every server. 
     */
    function storeAssociation($server_url, $association)
    {
        // create memcached keys for association itself 
        // and list of associations for this server
        $associationKey = $this->associationKey($server_url, 
            $association->handle);
        $serverKey = $this->associationServerKey($server_url);
        
        // get list of associations 
        $serverAssociations = $this->connection->get($serverKey);
        
        // if no such list, initialize it with empty array
        if (!$serverAssociations) {
            $serverAssociations = array();
        }
        // and store given association key in it
        $serverAssociations[$association->issued] = $associationKey;
        
        // save associations' keys list 
        $this->connection->set(
            $serverKey,
            $serverAssociations,
            $this->compress
        );
        // save association itself
        $this->connection->set(
            $associationKey,
            $association, 
            $this->compress, 
            $association->issued + $association->lifetime);
    }

    /**
     * Read association from memcached. If no handle given 
     * and multiple associations found, returns latest issued
     */
    function getAssociation($server_url, $handle = null)
    {
        // simple case: handle given
        if ($handle !== null) {
            // get association, return null if failed
            $association = $this->connection->get(
                $this->associationKey($server_url, $handle));
            return $association ? $association : null;
        }
        
        // no handle given, working with list
        // create key for list of associations
        $serverKey = $this->associationServerKey($server_url);
        
        // get list of associations
        $serverAssociations = $this->connection->get($serverKey);
        // return null if failed or got empty list
        if (!$serverAssociations) {
            return null;
        }
        
        // get key of most recently issued association
        $keys = array_keys($serverAssociations);
        sort($keys);
        $lastKey = $serverAssociations[array_pop($keys)];
        
        // get association, return null if failed
        $association = $this->connection->get($lastKey);
        return $association ? $association : null;
    }

    /**
     * Immediately delete association from memcache.
     */
    function removeAssociation($server_url, $handle)
    {
        // create memcached keys for association itself 
        // and list of associations for this server
        $serverKey = $this->associationServerKey($server_url);
        $associationKey = $this->associationKey($server_url, 
            $handle);
        
        // get list of associations
        $serverAssociations = $this->connection->get($serverKey);
        // return null if failed or got empty list
        if (!$serverAssociations) {
            return false;
        }
        
        // ensure that given association key exists in list
        $serverAssociations = array_flip($serverAssociations);
        if (!array_key_exists($associationKey, $serverAssociations)) {
            return false;
        }
        
        // remove given association key from list
        unset($serverAssociations[$associationKey]);
        $serverAssociations = array_flip($serverAssociations);
        
        // save updated list
        $this->connection->set(
            $serverKey,
            $serverAssociations,
            $this->compress
        );

        // delete association 
        return $this->connection->delete($associationKey);
    }

    /**
     * Create nonce for server and salt, expiring after 
     * $Auth_OpenID_SKEW seconds.
     */
    function useNonce($server_url, $timestamp, $salt)
    {
        global $Auth_OpenID_SKEW;
        
        // save one request to memcache when nonce obviously expired 
        if (abs($timestamp - time()) > $Auth_OpenID_SKEW) {
            return false;
        }
        
        // returns false when nonce already exists
        // otherwise adds nonce
        return $this->connection->add(
            'openid_nonce_' . sha1($server_url) . '_' . sha1($salt), 
            1, // any value here 
            $this->compress, 
            $Auth_OpenID_SKEW);
    }
    
    /**
     * Memcache key is prefixed with 'openid_association_' string. 
     */
    function associationKey($server_url, $handle = null) 
    {
        return 'openid_association_' . sha1($server_url) . '_' . sha1($handle);
    }
    
    /**
     * Memcache key is prefixed with 'openid_association_' string. 
     */
    function associationServerKey($server_url) 
    {
        return 'openid_association_server_' . sha1($server_url);
    }
    
    /**
     * Report that this storage doesn't support cleanup
     */
    function supportsCleanup()
    {
        return false;
    }
}

