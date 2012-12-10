<?php

/**
 * In-memory OpenID store implementation for testing only
 */
require_once "Auth/OpenID/Interface.php";
require_once 'Auth/OpenID/Nonce.php';

class ServerAssocs {
    function ServerAssocs()
    {
        $this->assocs = array();
    }

    function set($assoc)
    {
        $this->assocs[$assoc->handle] = $assoc;
    }

    function get($handle)
    {
        return Auth_OpenID::arrayGet($this->assocs, $handle);
    }

    function remove($handle)
    {
        if (array_key_exists($handle, $this->assocs)) {
            unset($this->assocs[$handle]);
            return true;
        } else {
            return false;
        }
    }

    /*
     * Returns association with the oldest issued date.
     *
     * or null if there are no associations.
     */
    function best()
    {
        $best = null;
        foreach ($this->assocs as $handle => $assoc) {
            if (($best === null) || ($best->issued < $assoc->issued)) {
                $best = $assoc;
            }
        }
        return $best;
    }

    /*
     * Remove expired associations.
     *
     * @return (removed associations, remaining associations)
     */
    function cleanup()
    {
        $remove = array();
        foreach ($this->assocs as $handle => $assoc) {
            if ($assoc->getExpiresIn() == 0) {
                $remove[] = $handle;
            }
        }

        foreach ($remove as $handle) {
            unset($this->assocs[$handle]);
        }

        return array(count($remove), count($this->assocs));
    }
}

/*
 * In-process memory store.
 *
 * Use for single long-running processes.  No persistence supplied.
 */
class Tests_Auth_OpenID_MemStore extends Auth_OpenID_OpenIDStore {
    function Tests_Auth_OpenID_MemStore()
    {
        $this->server_assocs = array();
        $this->nonces = array();
    }

    function &_getServerAssocs($server_url)
    {
        if (!array_key_exists($server_url, $this->server_assocs)) {
            $this->server_assocs[$server_url] = new ServerAssocs();
        }

        return $this->server_assocs[$server_url];
    }

    function storeAssociation($server_url, $assoc)
    {
        $assocs =& $this->_getServerAssocs($server_url);
        $assocs->set($assoc);
    }

    function getAssociation($server_url, $handle=null)
    {
        $assocs =& $this->_getServerAssocs($server_url);
        if ($handle === null) {
            return $assocs->best();
        } else {
            return $assocs->get($handle);
        }
    }

    function removeAssociation($server_url, $handle)
    {
        $assocs =& $this->_getServerAssocs($server_url);
        return $assocs->remove($handle);
    }

    function useNonce($server_url, $timestamp, $salt)
    {
        global $Auth_OpenID_SKEW;

        if (abs($timestamp - time()) > $Auth_OpenID_SKEW) {
            return false;
        }

        $anonce = array($server_url, intval($timestamp), $salt);

        if (in_array($anonce, $this->nonces)) {
            return false;
        } else {
            array_push($this->nonces, $anonce);
            return true;
        }
    }

    function cleanupNonces()
    {
        global $Auth_OpenID_SKEW;

        $now = time();
        $expired = array();
        foreach ($this->nonces as $anonce) {
            if (abs($anonce[1] - $now) > $Auth_OpenID_SKEW) {
                // removing items while iterating over the set could
                // be bad.
                $expired[] = $anonce;
            }
        }

        foreach ($expired as $anonce) {
            unset($this->nonces[array_search($anonce, $this->nonces)]);
        }

        return count($expired);
    }

    function cleanupAssociations()
    {
        $remove_urls = array();
        $removed_assocs = 0;
        foreach ($this->server_assocs as $server_url => $assocs) {
            list($removed, $remaining) = $assocs->cleanup();
            $removed_assocs += $removed;
            if (!$remaining) {
                $remove_urls[] = $server_url;
            }
        }

        // Remove entries from server_assocs that had none remaining.
        foreach ($remove_urls as $server_url) {
            unset($this->server_assocs[$server_url]);
        }

        return $removed_assocs;
    }
}


