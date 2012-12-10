<?php

/**
 * An interface for OpenID extensions.
 *
 * @package OpenID
 */

/**
 * Require the Message implementation.
 */
require_once 'Auth/OpenID/Message.php';

/**
 * A base class for accessing extension request and response data for
 * the OpenID 2 protocol.
 *
 * @package OpenID
 */
class Auth_OpenID_Extension {
    /**
     * ns_uri: The namespace to which to add the arguments for this
     * extension
     */
    var $ns_uri = null;
    var $ns_alias = null;

    /**
     * Get the string arguments that should be added to an OpenID
     * message for this extension.
     */
    function getExtensionArgs()
    {
        return null;
    }

    /**
     * Add the arguments from this extension to the provided message.
     *
     * Returns the message with the extension arguments added.
     */
    function toMessage($message)
    {
        $implicit = $message->isOpenID1();
        $added = $message->namespaces->addAlias($this->ns_uri,
                                                $this->ns_alias,
                                                $implicit);

        if ($added === null) {
            if ($message->namespaces->getAlias($this->ns_uri) !=
                $this->ns_alias) {
                return null;
            }
        }

        $message->updateArgs($this->ns_uri,
                             $this->getExtensionArgs());
        return $message;
    }
}

