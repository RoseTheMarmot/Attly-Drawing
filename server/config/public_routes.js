/*
 * Routes
 */ 

//body parser for accessing post data in request.body
var bodyParser = require('body-parser');
//controllers
var Sessions = require(__dirname+'/../controllers/sessions.js');

module.exports = function(app){
	
	//use body parser
	app.use(bodyParser.urlencoded());

	//routes
	app.post('/authenticate', function(request, response){
		Sessions.create(request, response);
	});

}