/*
 * Server
 */

//core
var express = require('express');
var app = express();

//port
var port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var server = app.listen(port, ip_address, function(){
	console.log("\n****************************\n*  listening on port "+port+"  *\n*  IP address: "+ip_address+"   *\n****************************\n");
});

//client
app.use(express.static(__dirname+"/../client"));

//routes
require(__dirname+"/config/routes.js")(app);

//sockets
require(__dirname+"/config/sockets.js")(server);