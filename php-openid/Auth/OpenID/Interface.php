<?php

/**
 * This file specifies the interface for PHP OpenID store implementations.
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
 * This is the interface for the store objects the OpenID library
 * uses. It is a single class that provides all of the persistence
 * mechanisms that the OpenID library needs, for both servers and
 * consumers.  If you want to create an SQL-driven store, please see
 * then {@link Auth_OpenID_SQLStore} class.
 *
 * Change: Version 2.0 removed the storeNonce, getAuthKey, and isDumb
 * methods, and changed the behavior of the useNonce method to support
 * one-way nonces.
 *
 * @package OpenID
 * @author JanRain, Inc. <openid@janrain.com>
 */
class Auth_OpenID_OpenIDStore {
    /**
     * This method puts an Association object into storage,
     * retrievable by server URL and handle.
     *
     * @param string $server_url The URL of the identity server that
     * this association is with. Because of the way the server portion
     * of the library uses this interface, don't assume there are any
     * limitations on the character set of the input string. In
     * particular, expect to see unescaped non-url-safe characters in
     * the server_url field.
     *
     * @param Association $association The Association to store.
     */
    function storeAssociation($server_url, $association)
    {
        trigger_error("Auth_OpenID_OpenIDStore::storeAssociation ".
                      "not implemented", E_USER_ERROR);
    }

    /*
     * Remove expired nonces from the store.
     *
     * Discards any nonce from storage that is old enough that its
     * timestamp would not pass useNonce().
     *
     * This method is not called in the normal operation of the
     * library.  It provides a way for store admins to keep their
     * storage from filling up with expired data.
     *
     * @return the number of nonces expired
     */
    function cleanupNonces()
    {
        trigger_error("Auth_OpenID_OpenIDStore::cleanupNonces ".
                      "not implemented", E_USER_ERROR);
    }

    /*
     * Remove expired associations from the store.
     *
     * This method is not called in the normal operation of the
     * library.  It provides a way for store admins to keep their
     * storage from filling up with expired data.
     *
     * @return the number of associations expired.
     */
    function cleanupAssociations()
    {
        trigger_error("Auth_OpenID_OpenIDStore::cleanupAssociations ".
                      "not implemented", E_USER_ERROR);
    }

    /*
     * Shortcut for cleanupNonces(), cleanupAssociations().
     *
     * This method is not called in the normal operation of the
     * library.  It provides a way for store admins to keep their
     * storage from filling up with expired data.
     */
    function cleanup()
    {
        return array($this->cleanupNonces(),
                     $this->cleanupAssociations());
    }

    /**
     * Report whether this storage supports cleanup
     */
    function supportsCleanup()
    {
        return true;
    }

    /**
     * This method returns an Association object from storage that
     * matches the server URL and, if specified, handle. It returns
     * null if no such association is found or if the matching
     * association is expired.
     *
     * If no handle is specified, the store may return any association
     * which matches the server URL. If multiple associations are
     * valid, the recommended return value for this method is the one
     * most recently issued.
     *
     * This method is allowed (and encouraged) to garbage collect
     * expired associations when found. This method must not return
     * expired associations.
     *
     * @param string $server_url The URL of the identity server to get
     * the association for. Because of the way the server portion of
     * the library uses this interface, don't assume there are any
     * limitations on the character set of the input string.  In
     * particular, expect to see unescaped non-url-safe characters in
     * the server_url field.
     *
     * @param mixed $handle This optional parameter is the handle of
     * the specific association to get. If no specific handle is
     * provided, any valid association matching the server URL is
     * returned.
     *
     * @return Association The Association for the given identity
     * server.
     */
    function getAssociation($server_url, $handle = null)
    {
        trigger_error("Auth_OpenID_OpenIDStore::getAssociation ".
                      "not implemented", E_USER_ERROR);
    }

    /**
     * This method removes the matching association if it's found, and
     * returns whether the association was removed or not.
     *
     * @param string $server_url The URL of the identity server the
     * association to remove belongs to. Because of the way the server
     * portion of the library uses this interface, don't assume there
     * are any limitations on the character set of the input
     * string. In particular, expect to see unescaped non-url-safe
     * characters in the server_url field.
     *
     * @param string $handle This is the handle of the association to
     * remove. If there isn't an association found that matches both
     * the given URL and handle, then there was no matching handle
     * found.
     *
     * @return mixed Returns whether or not the given association existed.
     */
    function removeAssociation($server_url, $handle)
    {
        trigger_error("Auth_OpenID_OpenIDStore::removeAssociation ".
                      "not implemented", E_USER_ERROR);
    }

    /**
     * Called when using a nonce.
     *
     * This method should return C{True} if the nonce has not been
     * used before, and store it for a while to make sure nobody
     * tries to use the same value again.  If the nonce has already
     * been used, return C{False}.
     *
     * Change: In earlier versions, round-trip nonces were used and a
     * nonce was only valid if it had been previously stored with
     * storeNonce.  Version 2.0 uses one-way nonces, requiring a
     * different implementation here that does not depend on a
     * storeNonce call.  (storeNonce is no longer part of the
     * interface.
     *
     * @param string $nonce The nonce to use.
     *
     * @return bool Whether or not the nonce was valid.
     */
    function useNonce($server_url, $timestamp, $salt)
    {
        trigger_error("Auth_OpenID_OpenIDStore::useNonce ".
                      "not implemented", E_USER_ERROR);
    }

    /**
     * Removes all entries from the store; implementation is optional.
     */
    function reset()
    {
    }

}
