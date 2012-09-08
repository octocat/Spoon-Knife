var keyCodes=new Array(10);
	var pattern=[38,38,40,40,37,39,37,39,66,65];
	function keydownHandler(e){
		keyCodes.shift();
		keyCodes.push(e.keyCode);
		if(keyCodes.every(function(element, index, array){return element===pattern[index];})){
			document.getElementById("rainbow-message").style.display="";
		}
	}
	window.onkeydown=keydownHandler;
