<html>
<body>

<?php
session_start();

$x=$_SESSION["user_rollno"];

if ($_FILES["file"]["type"] != "image/png")
{echo"invalid file format!should be in .png!";
}

else if (($_FILES["file"]["size"]/1024) > 2048) 
{echo "file size larger than 2mb!!";}

else if (file_exists("C:/xampp/htdocs/www/".$x.".png"))
{
echo "image of".$x." already exists!";
echo "<img style='width:200px;height:200px;'  src='/www/".$x.".png'>";
}
else
{move_uploaded_file($_FILES["file"]["tmp_name"],"C:/xampp/htdocs/www/".$x.".png");
echo "Image successfully uploaded as".$x.".png";
echo '<br>';
echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
echo "<img style='width:200px;height:200px;'  src='/www/".$x.".png'>";
}
 




?>
<br>
<a href="logout.php" >logout</a>
</br>

</body>

</html>


