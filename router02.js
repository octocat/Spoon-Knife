
function route(pathName, handle, req, res) {
	if (typeof handle[pathName] === 'function') {
		handle[pathName](req, res);
	} else {
		console.log("No request handler found for " + pathName);
		res.writeHead(404, {"Content-Type": "text/html"});
		res.write("404 Not found");
		res.end();
	}
}

exports.route = route;