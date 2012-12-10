<?php

require_once "lib/render.php";
require_once "lib/session.php";

require_once "lib/render/login.php";
require_once "lib/render/about.php";
require_once "lib/render/trust.php";

require_once "Auth/OpenID/Server.php";
require_once "Auth/OpenID/SReg.php";

function authCancel($info)
{
    if ($info) {
        setRequestInfo();
        $url = $info->getCancelURL();
    } else {
        $url = getServerURL();
    }
    return redirect_render($url);
}

function doAuth($info, $trusted=null, $fail_cancels=false,
                $idpSelect=null)
{
    if (!$info) {
        // There is no authentication information, so bail
        return authCancel(null);
    }

    if ($info->idSelect()) {
        if ($idpSelect) {
            $req_url = idURL($idpSelect);
        } else {
            $trusted = false;
        }
    } else {
        $req_url = $info->identity;
    }

    $user = getLoggedInUser();
    setRequestInfo($info);

    if ((!$info->idSelect()) && ($req_url != idURL($user))) {
        return login_render(array(), $req_url, $req_url);
    }

    $trust_root = $info->trust_root;

    if ($trusted) {
        setRequestInfo();
        $server =& getServer();
        $response =& $info->answer(true, null, $req_url);

        // Answer with some sample Simple Registration data.
        $sreg_data = array(
                           'fullname' => 'Example User',
                           'nickname' => 'example',
                           'dob' => '1970-01-01',
                           'email' => 'invalid@example.com',
                           'gender' => 'F',
                           'postcode' => '12345',
                           'country' => 'ES',
                           'language' => 'eu',
                           'timezone' => 'America/New_York');

        // Add the simple registration response values to the OpenID
        // response message.
        $sreg_request = Auth_OpenID_SRegRequest::fromOpenIDRequest(
                                              $info);

        $sreg_response = Auth_OpenID_SRegResponse::extractResponse(
                                              $sreg_request, $sreg_data);

        $sreg_response->toMessage($response->fields);

        // Generate a response to send to the user agent.
        $webresponse =& $server->encodeResponse($response);

        $new_headers = array();

        foreach ($webresponse->headers as $k => $v) {
            $new_headers[] = $k.": ".$v;
        }

        return array($new_headers, $webresponse->body);
    } elseif ($fail_cancels) {
        return authCancel($info);
    } else {
        return trust_render($info);
    }
}

?>