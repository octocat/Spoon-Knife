<?php

require_once "lib/session.php";
require_once "lib/render.php";

require_once "Auth/OpenID/Discover.php";

define('idp_xrds_pat', '<?xml version="1.0" encoding="UTF-8"?>
<xrds:XRDS
    xmlns:xrds="xri://$xrds"
    xmlns="xri://$xrd*($v*2.0)">
  <XRD>
    <Service priority="0">
      <Type>%s</Type>
      <URI>%s</URI>
    </Service>
  </XRD>
</xrds:XRDS>
');

function idpXrds_render()
{
    $headers = array('Content-type: application/xrds+xml');

    $body = sprintf(idp_xrds_pat,
                    Auth_OpenID_TYPE_2_0_IDP,
                    buildURL());

    return array($headers, $body);
}

?>