


function InitButton()
{
	let button1 = document.getElementById('button1');
	button1.addEventListener("click", Button1);
}

InitButton();

function Button1()
{
	let p = document.getElementById("p1");
    p.innerText = p.innerText.repeat(10);
}

