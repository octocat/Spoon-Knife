<?php

require_once "lib/session.php";
require_once "lib/render.php";

define('trust_form_pat',
       '<div class="form">
  <form method="post" action="%s">
  %s
    <input type="submit" name="trust" value="Confirm" />
    <input type="submit" value="Do not confirm" />
  </form>
</div>
');

define('normal_pat',
       '<p>Do you wish to confirm your identity ' .
       '(<code>%s</code>) with <code>%s</code>?</p>');

define('id_select_pat',
       '<p>You entered the server URL at the RP.
Please choose the name you wish to use.  If you enter nothing, the request will be cancelled.<br/>
<input type="text" name="idSelect" /></p>
');

define('no_id_pat',
'
You did not send an identifier with the request,
and it was not an identifier selection request.
Please return to the relying party and try again.
');

function trust_render($info)
{
    $current_user = getLoggedInUser();
    $lnk = link_render(idURL($current_user));
    $trust_root = htmlspecialchars($info->trust_root);
    $trust_url = buildURL('trust', true);

    if ($info->idSelect()) {
        $prompt = id_select_pat;
    } else {
        $prompt = sprintf(normal_pat, $lnk, $trust_root);
    }

    $form = sprintf(trust_form_pat, $trust_url, $prompt);

    return page_render($form, $current_user, 'Trust This Site');
}

function noIdentifier_render()
{
    return page_render(no_id_pat, null, 'No Identifier Sent');
}

?>