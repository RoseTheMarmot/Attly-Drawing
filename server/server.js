/*
 * Server
 */

//core
var express = require('express');
var app = express();

//port
var port = process.env.PORT || 8000;
var server = app.listen(port, function(){
	console.log("\n****************************\n*  listening on port "+port+"  *\n****************************\n");
});

//client
app.use(express.static(__dirname+"/../client"));

//routes
require(__dirname+"/config/routes.js")(app);

//sockets
require(__dirname+"/config/sockets.js")(server);