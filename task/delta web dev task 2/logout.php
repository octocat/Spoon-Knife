<?php
session_start();
unset($_SESSION["user_name"]);
unset($_SESSION["user_rollno"]);
header("Location:login.php");
?>