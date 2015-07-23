/*
 * Routes
 */ 

//body parser for accessing post data in request.body
var bodyParser = require('body-parser');
//controllers
var Drawings = require(__dirname+'/../controllers/drawings.js');

module.exports = function(app){
	
	//use body parser
	app.use(bodyParser.urlencoded());

	//routes
	app.get('/drawings', function(request, response){
		Drawings.index(request, response);
	});

	app.post('/drawings', function(request, response){
		Drawings.update(request, response);
	});
}