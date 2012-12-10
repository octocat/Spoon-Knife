<?php

require_once "lib/session.php";
require_once "lib/render.php";

define('login_form_pat',
       '<div class="form">
  <p>

    Enter your username into this form to log in to this server.  It
    can be anything; this is just for demonstration purposes.  For
    example, entering USERNAME will give you the identity URL

    <pre>%s</pre>
  </p>

  <form method="post" action="%s">
    <table>
      <tr>
        <th><label for="openid_url">Name:</label></th>
        <td><input type="text" name="openid_url"
                   value="%s" id="openid_url" /></td>
      </tr>
      <tr>
        <td colspan="2">
          <input type="submit" value="Log in" />
          <input type="submit" name="cancel" value="Cancel" />
        </td>
      </tr>
    </table>
  </form>
</div>
');

define('login_needed_pat',
       'You must be logged in as %s to approve this request.');

function login_render($errors=null, $input=null, $needed=null)
{
    $current_user = getLoggedInUser();
    if ($input === null) {
        $input = $current_user;
    }
    if ($needed) {
        $errors[] = sprintf(login_needed_pat, link_render($needed));
    }

    $esc_input = htmlspecialchars($input, ENT_QUOTES);
    $login_url = buildURL('login', true);
    $body = sprintf(login_form_pat, idURL('USERNAME'), $login_url, $esc_input);
    if ($errors) {
        $body = loginError_render($errors) . $body;
    }
    return page_render($body, $current_user, 'Log In', null, true);
}

function loginError_render($errors)
{
    $text = '';
    foreach ($errors as $error) {
        $text .= sprintf("<li>%s</li>\n", $error);
    }
    return sprintf("<ul class=\"error\">\n%s</ul>\n", $text);
}
?>