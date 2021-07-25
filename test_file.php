 <?php
$file_name = strtotime('now');
$myfile = fopen($file_name.".txt", "w+") or die("Unable to open file!");
chmod($file_name, 0777);
$txt = "John Doe\n";
fwrite($myfile, $txt);
$txt = "Jane Doe\n";
fwrite($myfile, $txt);
fclose($myfile);
echo $file_name.".txt";
?>
