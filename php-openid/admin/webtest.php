<?php

require_once 'Tests/TestDriver.php';

$suites = loadSuite();

// Create and run the user interface
$gui = new PHPUnit_GUI_HTML();
$gui->addSuites($suites);
$gui->show();

?>
