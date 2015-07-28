/*
 * Routes
 */ 

//body parser for accessing post data in request.body
var bodyParser = require('body-parser');
//controllers
var Drawings = require(__dirname+'/../controllers/drawings.js');
var Sessions = require(__dirname+'/../controllers/sessions.js');

module.exports = function(app){
	
	//use body parser
	app.use(bodyParser.urlencoded());

	//routes
	app.get('/', function(request, response){
		if(Sessions.auth( request.ip )){
			response.render('index');
		}else{
			response.render('login');
		}
	});

	app.get('/drawings', function(request, response){
		if(Sessions.auth( request.ip )){
			Drawings.index(request, response);
		}else{
			response.redirect('/');
		}
	});

	app.post('/drawings', function(request, response){
		if(Sessions.auth( request.ip )){
			Drawings.update(request, response);
		}else{
			response.redirect('/');
		}
	});

	app.post('/authenticate', function(request, response){
		Sessions.create(request, response);
	});
}