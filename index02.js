var server = require("./server02");
var router = require("./router02");
var requestHandlers = require("./requestHandlers02");

var formidable = require("formidable");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show

server.start(router.route, handle);