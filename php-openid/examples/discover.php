<?php

require_once "consumer/common.php";

require_once "Auth/OpenID/Discover.php";
require_once "Auth/Yadis/Yadis.php";

function getOpenIDIdentifier()
{
    return $_GET['openid_identifier'];
}

function escape($x)
{
    return htmlentities($x);
}


$identifier = getOpenIDIdentifier();
?>
<html>
<head>
<title>OpenID discovery</title>
</head>
<body>
  <h2>OpenID discovery tool</h2>
  <p>
    Enter an OpenID URL to begin discovery:
  </p>
  <form>
  <input type="text" name="openid_identifier" size="40" />
  <input type="submit" value="Begin" />
  </form>
<?php
if ($identifier) {

    $fetcher = Auth_Yadis_Yadis::getHTTPFetcher();
    list($normalized_identifier, $endpoints) = Auth_OpenID_discover(
        $identifier, $fetcher);

?>
  <h3>Discovery Results for <?php echo escape($identifier) ?></h3>

  <table cellpadding="7" cellspacing="0">
    <tbody>
      <tr>
        <th>Claimed Identifier</th>
        <td><?php echo escape($normalized_identifier) ?></td>
      </tr>
<?php
if (!$endpoints) {
?>
    <tr>
      <td colspan="2">No OpenID services discovered.</td>
    </tr>
<?php
} else {
?>
    <tr>
      <td colspan="2">Discovered OpenID services:</td>
    </tr>
<?php
foreach ($endpoints as $endpoint) {
?>
    <tr>
      <td colspan="2"><hr/></td>
    </tr>
    <tr>
      <th>Server URL</th>
      <td><tt><?php echo escape($endpoint->server_url) ?></tt></td>
    </tr>
    <tr>
      <th>Local ID</th>
      <td><tt><?php echo escape($endpoint->local_id) ?></tt></td>
    </tr>
    <tr>
      <td colspan="2">
        <h3>Service types:</h3>
        <ul>
<?php
foreach ($endpoint->type_uris as $type_uri) {
?>
          <li><tt><?php echo escape($type_uri) ?></tt></li>
<?php
}
?>
        </ul>
      </td>
    </tr>
<?php
}
}
?>
  </tbody>
</table>
<?php
}
?>
</body>
</html>
