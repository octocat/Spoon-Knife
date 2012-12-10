<?php

require_once "lib/session.php";
require_once "lib/render.php";

define('idpage_pat',
       '<html>
<head>
  <link rel="openid2.provider openid.server" href="%s"/>
  <meta http-equiv="X-XRDS-Location" content="%s" />
</head>
<body>
  This is the identity page for users of this server.
</body>
</html>');

function idpage_render($identity)
{
    $xrdsurl = buildURL('userXrds')."?user=".urlencode($identity);

    $headers = array(
                     'X-XRDS-Location: '.$xrdsurl);


    $body = sprintf(idpage_pat,
                    buildURL(),
                    $xrdsurl);
    return array($headers, $body);
}

?>
