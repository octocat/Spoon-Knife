<?php
session_start();
?>

<html>

<head>
<style>

.welcome {
background-color:#87CEEB;
color:black;
font-weight:bold;

}

.display {
background-color: #DCDCDC;
color:black;
font-weight:bold;

}

.display1 {
background-color: #FF99CC;
color:black;
font-weight:bold;

}

.logout {
background-color:#87CEEB;
color:black;
font-weight:bold;

}

</style>
</head>

<body>
<table border="1" cellpadding="10" cellspacing="1" width="500" align="center">


<tr class="welcome">
<td align="center">
<?php if($_SESSION["user_rollno"])?> 
<?php} ?>


Welcome <?php echo $_SESSION["user_name"]; ?>

</td>
</tr>


<tr class="display">
<td align="center">Upload your photo:</td>
</tr>

<tr class="display1">
<td align="center">
<form action="upload.php" method="post"
enctype="multipart/form-data">
<label for="file">Filename:</label>
<input type="file" name="file" id="file">
<input type="submit" name="submit" value="Submit">
</form>
</td>
</tr>



<tr class="logout">
<td align="center"> <a href="logout.php" tite="Logout">Logout</a>
<?php} ?>
</td>
</tr>
</table>


</body>
</html>