<?php
/* Coded by: Borivoje Manasijevic
   manasijevic.bora@gmail.com
   File name: funkcije.php
   Description: Fajl sa custom funkcijama koje ce se koristiti kroz veci deo projekta
*/

// Konekcija na bazu
DEFINE("HOST", "");
DEFINE("USER", "");
DEFINE("PASS", "");
DEFINE("DB", "");

function doDB() {
	global $dbcon;
	$dbcon = mysqli_connect(HOST, USER, PASS, DB);
	if (mysqli_connect_errno()) {
		echo "<p>We could not connect to DB!</p>
		 	  <p>Error msg: ".mysqli_connect_error()."</p>";
	exit();
	}
	mysqli_set_charset($dbcon, "utf-8");
}

// Custom clean funkcija : za preciscavanje inputa iz html forme
function clean($dbcon, $param) {
	$cleaned = mysqli_real_escape_string($dbcon, strip_tags(trim($param)));
	return $cleaned;
}



?>
