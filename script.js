 /*
Javascript Practice Mode
Author: James Agwa
Description: A sample Javascript file for practising Javascript.
Date: 09.03.2015
*/
(function(){
	"use strict";
	var frm = document.forms.Calc,
	num1 = frm.querySelector(".num1"),
	num2 = frm.querySelector(".num2"),
	dbtn = frm.querySelector(".dbtn"),
	mbtn = frm.querySelector(".mbtn"),
	result = document.querySelector(".result"),
	val;

	//Helper functions for running the calculations
	function d(a,b){
		return +(a / b);
	};
	function m(a,b){
		return +(a*b);
	};

	//Attach event listeners to the buttons
	dbtn.addEventListener("click", function(e){
	  val = d(num1.value, num2.value);
	  result.innerText = (val === 'infinity' || isNaN(val))? "Please enter a real number" : val;
	  e.preventDefault();
	});
	mbtn.addEventListener("click", function(e){
	  val = m(num1.value, num2.value);
	  result.innerText = (val === 'infinity' || isNaN(val))? "Please enter a real number" : val;
	  e.preventDefault();
	});

	//Log a warning message to hackers
	console.info(
	"Don't Dare hack this site! You'll loose if you do :)"
	);

	// Do the canvas stuff here
	var canvas = document.getElementById("mycanvas"),
	c = canvas.getContext("2d"),
	deg = Math.PI/180; // For converting degrees to radians
	// Draw a level-n Koch Snowflake fractal on the canvas context c,
	// with lower-left corner at (x,y) and side length len.
	function snowflake(c, n, x, y, len) {
	c.save(); // Save current transformation
	c.translate(x,y); // Translate origin to starting point
	c.moveTo(0,0); // Begin a new subpath at the new origin
	leg(n); // Draw the first leg of the snowflake
	c.rotate(-120*deg); // Now rotate 120 degrees counterclockwise
	leg(n); // Draw the second leg
	c.rotate(-120*deg); // Rotate again
	leg(n); // Draw the final leg
	c.closePath(); // Close the subpath
	c.restore(); // And restore original transformation
	// Draw a single leg of a level-n Koch snowflake.
	// This function leaves the current point at the end of the leg it has
	// drawn and translates the coordinate system so the current point is (0,0).
	// This means you can easily call rotate() after drawing a leg.
	function leg(n) {
	c.save(); // Save the current transformation
	if (n == 0) { // Nonrecursive case:
	c.lineTo(len, 0); // Just draw a horizontal line
	} // _ _
	else { // Recursive case: draw 4 sub-legs like: \/
	c.scale(1/3,1/3); // Sub-legs are 1/3rd the size of this leg
	leg(n-1); // Recurse for the first sub-leg
	c.rotate(60*deg); // Turn 60 degrees clockwise
	leg(n-1); // Second sub-leg
	c.rotate(-120*deg); // Rotate 120 degrees back
	leg(n-1); // Third sub-leg
	c.rotate(60*deg); // Rotate back to our original heading
	leg(n-1); // Final sub-leg
	}
	c.restore(); // Restore the transformation
	c.translate(len, 0); // But translate to make end of leg (0,0)
	}
	}
	snowflake(c,0,5,115,125); // A level-0 snowflake is an equilateral triangle
	snowflake(c,1,145,115,125); // A level-1 snowflake is a 6-sided star
	snowflake(c,2,285,115,125); // etc.
	snowflake(c,3,425,115,125);
	snowflake(c,4,565,115,125); // A level-4 snowflake looks like a snowflake!
	c.stroke(); // Stroke this very complicated path


	function rads(x) { return Math.PI*x/180; }
	c.beginPath();
	c.arc(75,100,50, // Center at (75,100), radius 50
	0,rads(360),false); // Go clockwise from 0 to 360 degrees
	// Draw a wedge. Angles are measured clockwise from the positive x axis.
	// Note that arc() adds a line from the current point to the arc start.
	c.moveTo(200, 100); // Start at the center of the circle
	c.arc(200, 100, 50, // Circle center and radius
	rads(-60), rads(0), // start at angle -60 and go to angle 0
	false); // false means clockwise
	c.closePath(); // Add radius back to the center of the circle
	// Same wedge, opposite direction
	c.moveTo(325, 100);
	c.arc(325, 100, 50, rads(-60), rads(0), true); // counterclockwise
	c.closePath();

	// Define some graphics attributes and draw the curves
	c.fillStyle = "#aaa"; // Gray fills
	c.lineWidth = 5; // 5-pixel black (by default) lines
	c.fill(); // Fill the curves
	c.stroke();

	//Color Change
	var chgbtn = document.querySelector('.chgbtn'),
	rainbow = ["green", "yellow","blue","red","indigo","orange","violet"],
	mainbg = document.querySelector('.bgchange');

	chgbtn.addEventListener('click', function(e){
		mainbg.style.background = rainbow[Math.floor(Math.random() * 7)];
		e.preventDefault;
	})



})();
