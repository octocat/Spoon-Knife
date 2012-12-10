<?php

/**
 * Code for using a proxy XRI resolver.
 */

require_once 'Auth/Yadis/XRDS.php';
require_once 'Auth/Yadis/XRI.php';

class Auth_Yadis_ProxyResolver {
    function Auth_Yadis_ProxyResolver($fetcher, $proxy_url = null)
    {
        $this->fetcher = $fetcher;
        $this->proxy_url = $proxy_url;
        if (!$this->proxy_url) {
            $this->proxy_url = Auth_Yadis_getDefaultProxy();
        }
    }

    function queryURL($xri, $service_type = null)
    {
        // trim off the xri:// prefix
        $qxri = substr(Auth_Yadis_toURINormal($xri), 6);
        $hxri = $this->proxy_url . $qxri;
        $args = array(
                      '_xrd_r' => 'application/xrds+xml'
                      );

        if ($service_type) {
            $args['_xrd_t'] = $service_type;
        } else {
            // Don't perform service endpoint selection.
            $args['_xrd_r'] .= ';sep=false';
        }

        $query = Auth_Yadis_XRIAppendArgs($hxri, $args);
        return $query;
    }

    function query($xri, $service_types, $filters = array())
    {
        $services = array();
        $canonicalID = null;
        foreach ($service_types as $service_type) {
            $url = $this->queryURL($xri, $service_type);
            $response = $this->fetcher->get($url);
            if ($response->status != 200 and $response->status != 206) {
                continue;
            }
            $xrds = Auth_Yadis_XRDS::parseXRDS($response->body);
            if (!$xrds) {
                continue;
            }
            $canonicalID = Auth_Yadis_getCanonicalID($xri,
                                                         $xrds);

            if ($canonicalID === false) {
                return null;
            }

            $some_services = $xrds->services($filters);
            $services = array_merge($services, $some_services);
            // TODO:
            //  * If we do get hits for multiple service_types, we're
            //    almost certainly going to have duplicated service
            //    entries and broken priority ordering.
        }
        return array($canonicalID, $services);
    }
}


