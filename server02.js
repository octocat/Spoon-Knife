var http = require("http");
var url = require("url");

function start(route, handle) {
	function onRequest(req, res) {
		var pathName = url.parse(req.url).pathname;
		route(pathName, handle, req, res);
	}
	
	http.createServer(onRequest).listen(8888);
	console.log(" ---- NodeJs Server Started ---- ");
}

exports.start = start;