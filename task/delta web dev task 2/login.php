<html>

<head>

<style>

.regitop {
background-color: #CC66FF;
color:white;
font-weight:bold;
}

.logitop {
background-color: #66FF33;
color:white;
font-weight:bold;

}

.regirows {
background-color:#FFF8DC;
color:#FF0066;
font-weight:bold;

}

.logirows {
background-color:#FFFF7E;
color:#FF0066;
font-weight:bold;

}

</style>
</head>




<?php



$a=$b=$c=$d=$e=$f=$g=$flag=0;
$regirollErr=$logirollErr=$NameErr=$deptErr=$sexErr=$passErr=$cpassErr=$passwordErr='';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

if (empty($_POST["Name"]))
{ $NameErr = "Name is required";}
else 
{if (!preg_match("/^[a-zA-Z ]*$/",k($_POST["Name"]))) 
$NameErr = "Only letters and white space allowed";
else  $b=1;}


if (empty($_POST["regirollno"])) 
{$regirollErr = "Enter rollno";}
else 
{if (!preg_match("/^[0-9]+$/",k($_POST["regirollno"])))
$regirollErr = "Only digits allowed"; 
else $c=1;}

if (empty($_POST["logirollno"])&& !empty($_POST["password"]))
 {$logirollErr = "Rollno is required";}
 if(isset($_POST["logirollno"]))
{if (!preg_match("/^[0-9]+$/",k($_POST["logirollno"]))) 
$logirollErr = "Only digits allowed";
}
 
if (empty($_POST["dept"])) {$deptErr = "State your department!";}
else {$d=1;}

if (empty($_POST["sex"])) {$sexErr = "State your sex";} 
else {$e=1;}

if (empty($_POST["pass"])) {$passErr = "Enter a password!";}
else {$f=1;}

if (empty($_POST["cpass"]))
{
if (empty($_POST["pass"]))
$cpassErr = "";
else
$cpassErr = "confirm entered password !";}
else if($_POST["cpass"]!=$_POST["pass"]) {$cpassErr = "passwords do not match!";}
else {$g=1;}


if (empty($_POST["password"])&&!empty($_POST["logirollno"]) )
 {$passwordErr = "password cannot be empty!";}


if(empty($_POST["rno"]) && empty($_POST["Name"]) &&  empty($_POST["dept"]) && empty($_POST["sex"]) && empty($_POST["pass"]) && empty($_POST["cpass"]) )
$NameErr=$deptErr=$sexErr=$passErr=$cpassErr=$regirollErr='';

if (empty($_POST["password"])&& empty($_POST["logirollno"]))
$passwordErr =$logirollErr='';


}
function scan($data) {$data = htmlspecialchars(trim($data));return $data;}

$p = isset($_POST['regirollno']) ?scan( $_POST['regirollno']) : '';
$q = isset($_POST['Name']) ? scan($_POST['Name']):'';

if (isset($_POST['dept']))
$r=$_POST['dept'];
else
$r='';

if (isset($_POST['sex']))
$s=$_POST['sex'];
else $s='';


$t = isset($_POST['pass']) ? $_POST['pass'] : '';

if($b==1 && $c==1 && $d==1 && $e==1 && $f==1 && $g==1)
{$con= mysqli_connect("localhost","root","","mydb",3306);
$result = mysqli_query($con,"INSERT INTO reg_details VALUES ('$p','$q','$r','$s','$t') ");
if($result)
$flag=1;
}

function k($data) {
   $data = trim($data);
   $data = stripslashes($data);
   $data = htmlspecialchars($data);
   return $data;
}


?>
<?php
session_start();

$l= isset($_POST['logirollno']) ? $_POST['logirollno'] : '';
$m = isset($_POST['password']) ? $_POST['password'] : '';


$con= mysqli_connect("localhost","root","","mydb",3306);
$result = mysqli_query($con,"SELECT * FROM reg_details WHERE rollno ='$l' AND password ='$m'");
$rarray  = mysqli_fetch_array($result);

$_SESSION["user_name"] =$_SESSION["user_rollno"] ='';

if(is_array($rarray))
{
$_SESSION["user_name"] = $rarray['name'];
$_SESSION["user_rollno"] = $rarray['rollno'];

}
if($_SESSION["user_name"]!='' && $_SESSION["user_rollno"]!='')
header("Location:home.php"); 

?>

<body>

<form name="myform" method="post" action="" >

<table border="1" cellpadding="10" cellspacing="0.5" width="500" align="center">



<tr class="regitop">
<td align="center" colspan="8">Enter Registration Details</td>
</tr>

<tr class="regirows">
<td align="right">Name</td>
<td><input type="text" name="Name" ><span class="error">* <?php echo $NameErr;?></span></td>
</tr>
<tr class="regirows">
<td align="right">Rollno</td>
<td><input type="text" name="regirollno" ><span class="error">* <?php echo $regirollErr;?></span></td>
</tr>

<tr class="regirows">
<td align="right">Department</td>
<td>
<input type="radio" name="dept" value="mech" >mech
<input type="radio" name="dept" value="cse" >cse
<input type="radio" name="dept" value="civil" >civil
<input type="radio" name="dept" value="prod" >prod
<input type="radio" name="dept" value="chem" >chem
<input type="radio" name="dept" value="meta" >meta
<input type="radio" name="dept" value="EEE" >EEE
<input type="radio" name="dept" value="ECE" >ECE
<span class="error">* <?php echo $deptErr;?></span>
</td></tr>


<tr class="regirows">
<td align="right">Sex</td>
<td>
<input type="radio" name="sex" value="male" >Male
<input type="radio" name="sex" value="female" >Female
<span class="error">* <?php echo $sexErr;?></span>
</td></tr>


<tr class="regirows">
<td align="right">Password</td>
<td><input type="password" name="pass">
<span class="error">* <?php echo $passErr;?></span></td>
</tr>

<tr class="regirows">
<td align="right">Confirm Password</td>
<td><input type="password" name="cpass">
<span class="error">* <?php echo $cpassErr;?></span>
</td>
</tr>

<tr class="regirows">
<td align="center"></td>
<td><input type="submit" value="submit">
</td>
</tr>

<tr class="regirows">
<td align="center"></td>
<td><?php if($flag==1)echo "successfully registered";?>
</td>
</tr>

</table>
</form>

<form name="myform" method="post" action="">

<table border="1" cellpadding="10" cellspacing="0.5" width="800" align="center">
<tr class="logitop">
<td align="center" colspan="8">Enter Login Details</td>
</tr>



<tr class="logirows">
<td align="right">Rollno</td>
<td><input type="text" name="logirollno">
<span class="error">* <?php echo $logirollErr;?></span>
</td>
</tr>

<tr class="logirows">
<td align="right">Password</td>
<td><input type="password" name="password">
<span class="error">* <?php echo $passwordErr; ?> </span>
</td>
</tr>

<tr class="logirows">
<td align="center"></td>
<td><input type="submit" value="submit">
</td>
</tr>
</table>
</form>

<body>
</html>