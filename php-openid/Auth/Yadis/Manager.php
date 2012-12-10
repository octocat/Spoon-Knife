<?php

/**
 * Yadis service manager to be used during yadis-driven authentication
 * attempts.
 *
 * @package OpenID
 */

/**
 * The base session class used by the Auth_Yadis_Manager.  This
 * class wraps the default PHP session machinery and should be
 * subclassed if your application doesn't use PHP sessioning.
 *
 * @package OpenID
 */
class Auth_Yadis_PHPSession {
    /**
     * Set a session key/value pair.
     *
     * @param string $name The name of the session key to add.
     * @param string $value The value to add to the session.
     */
    function set($name, $value)
    {
        $_SESSION[$name] = $value;
    }

    /**
     * Get a key's value from the session.
     *
     * @param string $name The name of the key to retrieve.
     * @param string $default The optional value to return if the key
     * is not found in the session.
     * @return string $result The key's value in the session or
     * $default if it isn't found.
     */
    function get($name, $default=null)
    {
        if (array_key_exists($name, $_SESSION)) {
            return $_SESSION[$name];
        } else {
            return $default;
        }
    }

    /**
     * Remove a key/value pair from the session.
     *
     * @param string $name The name of the key to remove.
     */
    function del($name)
    {
        unset($_SESSION[$name]);
    }

    /**
     * Return the contents of the session in array form.
     */
    function contents()
    {
        return $_SESSION;
    }
}

/**
 * A session helper class designed to translate between arrays and
 * objects.  Note that the class used must have a constructor that
 * takes no parameters.  This is not a general solution, but it works
 * for dumb objects that just need to have attributes set.  The idea
 * is that you'll subclass this and override $this->check($data) ->
 * bool to implement your own session data validation.
 *
 * @package OpenID
 */
class Auth_Yadis_SessionLoader {
    /**
     * Override this.
     *
     * @access private
     */
    function check($data)
    {
        return true;
    }

    /**
     * Given a session data value (an array), this creates an object
     * (returned by $this->newObject()) whose attributes and values
     * are those in $data.  Returns null if $data lacks keys found in
     * $this->requiredKeys().  Returns null if $this->check($data)
     * evaluates to false.  Returns null if $this->newObject()
     * evaluates to false.
     *
     * @access private
     */
    function fromSession($data)
    {
        if (!$data) {
            return null;
        }

        $required = $this->requiredKeys();

        foreach ($required as $k) {
            if (!array_key_exists($k, $data)) {
                return null;
            }
        }

        if (!$this->check($data)) {
            return null;
        }

        $data = array_merge($data, $this->prepareForLoad($data));
        $obj = $this->newObject($data);

        if (!$obj) {
            return null;
        }

        foreach ($required as $k) {
            $obj->$k = $data[$k];
        }

        return $obj;
    }

    /**
     * Prepares the data array by making any necessary changes.
     * Returns an array whose keys and values will be used to update
     * the original data array before calling $this->newObject($data).
     *
     * @access private
     */
    function prepareForLoad($data)
    {
        return array();
    }

    /**
     * Returns a new instance of this loader's class, using the
     * session data to construct it if necessary.  The object need
     * only be created; $this->fromSession() will take care of setting
     * the object's attributes.
     *
     * @access private
     */
    function newObject($data)
    {
        return null;
    }

    /**
     * Returns an array of keys and values built from the attributes
     * of $obj.  If $this->prepareForSave($obj) returns an array, its keys
     * and values are used to update the $data array of attributes
     * from $obj.
     *
     * @access private
     */
    function toSession($obj)
    {
        $data = array();
        foreach ($obj as $k => $v) {
            $data[$k] = $v;
        }

        $extra = $this->prepareForSave($obj);

        if ($extra && is_array($extra)) {
            foreach ($extra as $k => $v) {
                $data[$k] = $v;
            }
        }

        return $data;
    }

    /**
     * Override this.
     *
     * @access private
     */
    function prepareForSave($obj)
    {
        return array();
    }
}

/**
 * A concrete loader implementation for Auth_OpenID_ServiceEndpoints.
 *
 * @package OpenID
 */
class Auth_OpenID_ServiceEndpointLoader extends Auth_Yadis_SessionLoader {
    function newObject($data)
    {
        return new Auth_OpenID_ServiceEndpoint();
    }

    function requiredKeys()
    {
        $obj = new Auth_OpenID_ServiceEndpoint();
        $data = array();
        foreach ($obj as $k => $v) {
            $data[] = $k;
        }
        return $data;
    }

    function check($data)
    {
        return is_array($data['type_uris']);
    }
}

/**
 * A concrete loader implementation for Auth_Yadis_Managers.
 *
 * @package OpenID
 */
class Auth_Yadis_ManagerLoader extends Auth_Yadis_SessionLoader {
    function requiredKeys()
    {
        return array('starting_url',
                     'yadis_url',
                     'services',
                     'session_key',
                     '_current',
                     'stale');
    }

    function newObject($data)
    {
        return new Auth_Yadis_Manager($data['starting_url'],
                                          $data['yadis_url'],
                                          $data['services'],
                                          $data['session_key']);
    }

    function check($data)
    {
        return is_array($data['services']);
    }

    function prepareForLoad($data)
    {
        $loader = new Auth_OpenID_ServiceEndpointLoader();
        $services = array();
        foreach ($data['services'] as $s) {
            $services[] = $loader->fromSession($s);
        }
        return array('services' => $services);
    }

    function prepareForSave($obj)
    {
        $loader = new Auth_OpenID_ServiceEndpointLoader();
        $services = array();
        foreach ($obj->services as $s) {
            $services[] = $loader->toSession($s);
        }
        return array('services' => $services);
    }
}

/**
 * The Yadis service manager which stores state in a session and
 * iterates over <Service> elements in a Yadis XRDS document and lets
 * a caller attempt to use each one.  This is used by the Yadis
 * library internally.
 *
 * @package OpenID
 */
class Auth_Yadis_Manager {

    /**
     * Intialize a new yadis service manager.
     *
     * @access private
     */
    function Auth_Yadis_Manager($starting_url, $yadis_url,
                                    $services, $session_key)
    {
        // The URL that was used to initiate the Yadis protocol
        $this->starting_url = $starting_url;

        // The URL after following redirects (the identifier)
        $this->yadis_url = $yadis_url;

        // List of service elements
        $this->services = $services;

        $this->session_key = $session_key;

        // Reference to the current service object
        $this->_current = null;

        // Stale flag for cleanup if PHP lib has trouble.
        $this->stale = false;
    }

    /**
     * @access private
     */
    function length()
    {
        // How many untried services remain?
        return count($this->services);
    }

    /**
     * Return the next service
     *
     * $this->current() will continue to return that service until the
     * next call to this method.
     */
    function nextService()
    {

        if ($this->services) {
            $this->_current = array_shift($this->services);
        } else {
            $this->_current = null;
        }

        return $this->_current;
    }

    /**
     * @access private
     */
    function current()
    {
        // Return the current service.
        // Returns None if there are no services left.
        return $this->_current;
    }

    /**
     * @access private
     */
    function forURL($url)
    {
        return in_array($url, array($this->starting_url, $this->yadis_url));
    }

    /**
     * @access private
     */
    function started()
    {
        // Has the first service been returned?
        return $this->_current !== null;
    }
}

/**
 * State management for discovery.
 *
 * High-level usage pattern is to call .getNextService(discover) in
 * order to find the next available service for this user for this
 * session. Once a request completes, call .cleanup() to clean up the
 * session state.
 *
 * @package OpenID
 */
class Auth_Yadis_Discovery {

    /**
     * @access private
     */
    var $DEFAULT_SUFFIX = 'auth';

    /**
     * @access private
     */
    var $PREFIX = '_yadis_services_';

    /**
     * Initialize a discovery object.
     *
     * @param Auth_Yadis_PHPSession $session An object which
     * implements the Auth_Yadis_PHPSession API.
     * @param string $url The URL on which to attempt discovery.
     * @param string $session_key_suffix The optional session key
     * suffix override.
     */
    function Auth_Yadis_Discovery($session, $url,
                                      $session_key_suffix = null)
    {
        /// Initialize a discovery object
        $this->session = $session;
        $this->url = $url;
        if ($session_key_suffix === null) {
            $session_key_suffix = $this->DEFAULT_SUFFIX;
        }

        $this->session_key_suffix = $session_key_suffix;
        $this->session_key = $this->PREFIX . $this->session_key_suffix;
    }

    /**
     * Return the next authentication service for the pair of
     * user_input and session. This function handles fallback.
     */
    function getNextService($discover_cb, $fetcher)
    {
        $manager = $this->getManager();
        if (!$manager || (!$manager->services)) {
            $this->destroyManager();

            list($yadis_url, $services) = call_user_func_array($discover_cb,
                                                               array(
                                                                $this->url,
                                                                &$fetcher,
                                                               ));

            $manager = $this->createManager($services, $yadis_url);
        }

        if ($manager) {
            $loader = new Auth_Yadis_ManagerLoader();
            $service = $manager->nextService();
            $this->session->set($this->session_key,
                                serialize($loader->toSession($manager)));
        } else {
            $service = null;
        }

        return $service;
    }

    /**
     * Clean up Yadis-related services in the session and return the
     * most-recently-attempted service from the manager, if one
     * exists.
     *
     * @param $force True if the manager should be deleted regardless
     * of whether it's a manager for $this->url.
     */
    function cleanup($force=false)
    {
        $manager = $this->getManager($force);
        if ($manager) {
            $service = $manager->current();
            $this->destroyManager($force);
        } else {
            $service = null;
        }

        return $service;
    }

    /**
     * @access private
     */
    function getSessionKey()
    {
        // Get the session key for this starting URL and suffix
        return $this->PREFIX . $this->session_key_suffix;
    }

    /**
     * @access private
     *
     * @param $force True if the manager should be returned regardless
     * of whether it's a manager for $this->url.
     */
    function getManager($force=false)
    {
        // Extract the YadisServiceManager for this object's URL and
        // suffix from the session.

        $manager_str = $this->session->get($this->getSessionKey());
        $manager = null;

        if ($manager_str !== null) {
            $loader = new Auth_Yadis_ManagerLoader();
            $manager = $loader->fromSession(unserialize($manager_str));
        }

        if ($manager && ($manager->forURL($this->url) || $force)) {
            return $manager;
        }
    }

    /**
     * @access private
     */
    function createManager($services, $yadis_url = null)
    {
        $key = $this->getSessionKey();
        if ($this->getManager()) {
            return $this->getManager();
        }

        if ($services) {
            $loader = new Auth_Yadis_ManagerLoader();
            $manager = new Auth_Yadis_Manager($this->url, $yadis_url,
                                              $services, $key);
            $this->session->set($this->session_key,
                                serialize($loader->toSession($manager)));
            return $manager;
        }
    }

    /**
     * @access private
     *
     * @param $force True if the manager should be deleted regardless
     * of whether it's a manager for $this->url.
     */
    function destroyManager($force=false)
    {
        if ($this->getManager($force) !== null) {
            $key = $this->getSessionKey();
            $this->session->del($key);
        }
    }
}

