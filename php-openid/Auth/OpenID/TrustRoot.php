<?php
/**
 * Functions for dealing with OpenID trust roots
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

require_once 'Auth/OpenID/Discover.php';

/**
 * A regular expression that matches a domain ending in a top-level domains.
 * Used in checking trust roots for sanity.
 *
 * @access private
 */
define('Auth_OpenID___TLDs',
       '/\.(ac|ad|ae|aero|af|ag|ai|al|am|an|ao|aq|ar|arpa|as|asia' .
       '|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|biz|bj|bm|bn|bo|br' .
       '|bs|bt|bv|bw|by|bz|ca|cat|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co' .
       '|com|coop|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg' .
       '|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl' .
       '|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie' .
       '|il|im|in|info|int|io|iq|ir|is|it|je|jm|jo|jobs|jp|ke|kg|kh' .
       '|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly' .
       '|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mo|mobi|mp|mq|mr|ms|mt' .
       '|mu|museum|mv|mw|mx|my|mz|na|name|nc|ne|net|nf|ng|ni|nl|no' .
       '|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|pro|ps|pt' .
       '|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl' .
       '|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm' .
       '|tn|to|tp|tr|travel|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve' .
       '|vg|vi|vn|vu|wf|ws|xn--0zwm56d|xn--11b5bs3a9aj6g' .
       '|xn--80akhbyknj4f|xn--9t4b11yi5a|xn--deba0ad|xn--g6w251d' .
       '|xn--hgbk6aj7f53bba|xn--hlcj6aya9esc7a|xn--jxalpdlp' .
       '|xn--kgbechtv|xn--zckzah|ye|yt|yu|za|zm|zw)\.?$/');

define('Auth_OpenID___HostSegmentRe',
       "/^(?:[-a-zA-Z0-9!$&'\\(\\)\\*+,;=._~]|%[a-zA-Z0-9]{2})*$/");

/**
 * A wrapper for trust-root related functions
 */
class Auth_OpenID_TrustRoot {
    /*
     * Return a discovery URL for this realm.
     *
     * Return null if the realm could not be parsed or was not valid.
     *
     * @param return_to The relying party return URL of the OpenID
     * authentication request
     *
     * @return The URL upon which relying party discovery should be
     * run in order to verify the return_to URL
     */
    static function buildDiscoveryURL($realm)
    {
        $parsed = Auth_OpenID_TrustRoot::_parse($realm);

        if ($parsed === false) {
            return false;
        }

        if ($parsed['wildcard']) {
            // Use "www." in place of the star
            if ($parsed['host'][0] != '.') {
                return false;
            }

            $www_domain = 'www' . $parsed['host'];

            return sprintf('%s://%s%s', $parsed['scheme'],
                           $www_domain, $parsed['path']);
        } else {
            return $parsed['unparsed'];
        }
    }

    /**
     * Parse a URL into its trust_root parts.
     *
     * @static
     *
     * @access private
     *
     * @param string $trust_root The url to parse
     *
     * @return mixed $parsed Either an associative array of trust root
     * parts or false if parsing failed.
     */
    static function _parse($trust_root)
    {
        $trust_root = Auth_OpenID_urinorm($trust_root);
        if ($trust_root === null) {
            return false;
        }

        if (preg_match("/:\/\/[^:]+(:\d+){2,}(\/|$)/", $trust_root)) {
            return false;
        }

        $parts = @parse_url($trust_root);
        if ($parts === false) {
            return false;
        }

        $required_parts = array('scheme', 'host');
        $forbidden_parts = array('user', 'pass', 'fragment');
        $keys = array_keys($parts);
        if (array_intersect($keys, $required_parts) != $required_parts) {
            return false;
        }

        if (array_intersect($keys, $forbidden_parts) != array()) {
            return false;
        }

        if (!preg_match(Auth_OpenID___HostSegmentRe, $parts['host'])) {
            return false;
        }

        $scheme = strtolower($parts['scheme']);
        $allowed_schemes = array('http', 'https');
        if (!in_array($scheme, $allowed_schemes)) {
            return false;
        }
        $parts['scheme'] = $scheme;

        $host = strtolower($parts['host']);
        $hostparts = explode('*', $host);
        switch (count($hostparts)) {
        case 1:
            $parts['wildcard'] = false;
            break;
        case 2:
            if ($hostparts[0] ||
                ($hostparts[1] && substr($hostparts[1], 0, 1) != '.')) {
                return false;
            }
            $host = $hostparts[1];
            $parts['wildcard'] = true;
            break;
        default:
            return false;
        }
        if (strpos($host, ':') !== false) {
            return false;
        }

        $parts['host'] = $host;

        if (isset($parts['path'])) {
            $path = strtolower($parts['path']);
            if (substr($path, 0, 1) != '/') {
                return false;
            }
        } else {
            $path = '/';
        }

        $parts['path'] = $path;
        if (!isset($parts['port'])) {
            $parts['port'] = false;
        }


        $parts['unparsed'] = $trust_root;

        return $parts;
    }

    /**
     * Is this trust root sane?
     *
     * A trust root is sane if it is syntactically valid and it has a
     * reasonable domain name. Specifically, the domain name must be
     * more than one level below a standard TLD or more than two
     * levels below a two-letter tld.
     *
     * For example, '*.com' is not a sane trust root, but '*.foo.com'
     * is.  '*.co.uk' is not sane, but '*.bbc.co.uk' is.
     *
     * This check is not always correct, but it attempts to err on the
     * side of marking sane trust roots insane instead of marking
     * insane trust roots sane. For example, 'kink.fm' is marked as
     * insane even though it "should" (for some meaning of should) be
     * marked sane.
     *
     * This function should be used when creating OpenID servers to
     * alert the users of the server when a consumer attempts to get
     * the user to accept a suspicious trust root.
     *
     * @static
     * @param string $trust_root The trust root to check
     * @return bool $sanity Whether the trust root looks OK
     */
    static function isSane($trust_root)
    {
        $parts = Auth_OpenID_TrustRoot::_parse($trust_root);
        if ($parts === false) {
            return false;
        }

        // Localhost is a special case
        if ($parts['host'] == 'localhost') {
            return true;
        }
        
        $host_parts = explode('.', $parts['host']);
        if ($parts['wildcard']) {
            // Remove the empty string from the beginning of the array
            array_shift($host_parts);
        }

        if ($host_parts && !$host_parts[count($host_parts) - 1]) {
            array_pop($host_parts);
        }

        if (!$host_parts) {
            return false;
        }

        // Don't allow adjacent dots
        if (in_array('', $host_parts, true)) {
            return false;
        }

        // Get the top-level domain of the host. If it is not a valid TLD,
        // it's not sane.
        preg_match(Auth_OpenID___TLDs, $parts['host'], $matches);
        if (!$matches) {
            return false;
        }
        $tld = $matches[1];

        if (count($host_parts) == 1) {
            return false;
        }

        if ($parts['wildcard']) {
            // It's a 2-letter tld with a short second to last segment
            // so there needs to be more than two segments specified
            // (e.g. *.co.uk is insane)
            $second_level = $host_parts[count($host_parts) - 2];
            if (strlen($tld) == 2 && strlen($second_level) <= 3) {
                return count($host_parts) > 2;
            }
        }

        return true;
    }

    /**
     * Does this URL match the given trust root?
     *
     * Return whether the URL falls under the given trust root. This
     * does not check whether the trust root is sane. If the URL or
     * trust root do not parse, this function will return false.
     *
     * @param string $trust_root The trust root to match against
     *
     * @param string $url The URL to check
     *
     * @return bool $matches Whether the URL matches against the
     * trust root
     */
    static function match($trust_root, $url)
    {
        $trust_root_parsed = Auth_OpenID_TrustRoot::_parse($trust_root);
        $url_parsed = Auth_OpenID_TrustRoot::_parse($url);
        if (!$trust_root_parsed || !$url_parsed) {
            return false;
        }

        // Check hosts matching
        if ($url_parsed['wildcard']) {
            return false;
        }
        if ($trust_root_parsed['wildcard']) {
            $host_tail = $trust_root_parsed['host'];
            $host = $url_parsed['host'];
            if ($host_tail &&
                substr($host, -(strlen($host_tail))) != $host_tail &&
                substr($host_tail, 1) != $host) {
                return false;
            }
        } else {
            if ($trust_root_parsed['host'] != $url_parsed['host']) {
                return false;
            }
        }

        // Check path and query matching
        $base_path = $trust_root_parsed['path'];
        $path = $url_parsed['path'];
        if (!isset($trust_root_parsed['query'])) {
            if ($base_path != $path) {
                if (substr($path, 0, strlen($base_path)) != $base_path) {
                    return false;
                }
                if (substr($base_path, strlen($base_path) - 1, 1) != '/' &&
                    substr($path, strlen($base_path), 1) != '/') {
                    return false;
                }
            }
        } else {
            $base_query = $trust_root_parsed['query'];
            $query = @$url_parsed['query'];
            $qplus = substr($query, 0, strlen($base_query) + 1);
            $bqplus = $base_query . '&';
            if ($base_path != $path ||
                ($base_query != $query && $qplus != $bqplus)) {
                return false;
            }
        }

        // The port and scheme need to match exactly
        return ($trust_root_parsed['scheme'] == $url_parsed['scheme'] &&
                $url_parsed['port'] === $trust_root_parsed['port']);
    }
}

/*
 * If the endpoint is a relying party OpenID return_to endpoint,
 * return the endpoint URL. Otherwise, return None.
 *
 * This function is intended to be used as a filter for the Yadis
 * filtering interface.
 *
 * @see: C{L{openid.yadis.services}}
 * @see: C{L{openid.yadis.filters}}
 *
 * @param endpoint: An XRDS BasicServiceEndpoint, as returned by
 * performing Yadis dicovery.
 *
 * @returns: The endpoint URL or None if the endpoint is not a
 * relying party endpoint.
 */
function filter_extractReturnURL($endpoint)
{
    if ($endpoint->matchTypes(array(Auth_OpenID_RP_RETURN_TO_URL_TYPE))) {
        return $endpoint;
    } else {
        return null;
    }
}

function &Auth_OpenID_extractReturnURL(&$endpoint_list)
{
    $result = array();

    foreach ($endpoint_list as $endpoint) {
        if (filter_extractReturnURL($endpoint)) {
            $result[] = $endpoint;
        }
    }

    return $result;
}

/*
 * Is the return_to URL under one of the supplied allowed return_to
 * URLs?
 */
function Auth_OpenID_returnToMatches($allowed_return_to_urls, $return_to)
{
    foreach ($allowed_return_to_urls as $allowed_return_to) {
        // A return_to pattern works the same as a realm, except that
        // it's not allowed to use a wildcard. We'll model this by
        // parsing it as a realm, and not trying to match it if it has
        // a wildcard.

        $return_realm = Auth_OpenID_TrustRoot::_parse($allowed_return_to);
        if (// Parses as a trust root
            ($return_realm !== false) &&
            // Does not have a wildcard
            (!$return_realm['wildcard']) &&
            // Matches the return_to that we passed in with it
            (Auth_OpenID_TrustRoot::match($allowed_return_to, $return_to))) {
            return true;
        }
    }

    // No URL in the list matched
    return false;
}

/*
 * Given a relying party discovery URL return a list of return_to
 * URLs.
 */
function Auth_OpenID_getAllowedReturnURLs($relying_party_url, $fetcher,
              $discover_function=null)
{
    if ($discover_function === null) {
        $discover_function = array('Auth_Yadis_Yadis', 'discover');
    }

    $xrds_parse_cb = array('Auth_OpenID_ServiceEndpoint', 'consumerFromXRDS');

    list($rp_url_after_redirects, $endpoints) =
        Auth_Yadis_getServiceEndpoints($relying_party_url, $xrds_parse_cb,
                                       $discover_function, $fetcher);

    if ($rp_url_after_redirects != $relying_party_url) {
        // Verification caused a redirect
        return false;
    }

    call_user_func_array($discover_function,
                         array($relying_party_url, &$fetcher));

    $return_to_urls = array();
    $matching_endpoints = Auth_OpenID_extractReturnURL($endpoints);

    foreach ($matching_endpoints as $e) {
        $return_to_urls[] = $e->server_url;
    }

    return $return_to_urls;
}

/*
 * Verify that a return_to URL is valid for the given realm.
 *
 * This function builds a discovery URL, performs Yadis discovery on
 * it, makes sure that the URL does not redirect, parses out the
 * return_to URLs, and finally checks to see if the current return_to
 * URL matches the return_to.
 *
 * @return true if the return_to URL is valid for the realm
 */
function Auth_OpenID_verifyReturnTo($realm_str, $return_to, $fetcher,
              $_vrfy='Auth_OpenID_getAllowedReturnURLs')
{
    $disco_url = Auth_OpenID_TrustRoot::buildDiscoveryURL($realm_str);

    if ($disco_url === false) {
        return false;
    }

    $allowable_urls = call_user_func_array($_vrfy,
                           array($disco_url, $fetcher));

    // The realm_str could not be parsed.
    if ($allowable_urls === false) {
        return false;
    }

    if (Auth_OpenID_returnToMatches($allowable_urls, $return_to)) {
        return true;
    } else {
        return false;
    }
}

