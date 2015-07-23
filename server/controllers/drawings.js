/*
 * Drawing controller
 */

var fs = require('fs');
var jsonfile = require('jsonfile');
var fname = __dirname+"/../models/json/drawing.json";

module.exports = {
	index: function(request, response){ //gets the drawing data
		jsonfile.readFile(fname, function(err, data){
			if(err){
				console.log(err);
				response.send({});
			}else{
				response.send(data);
			}
		});
	},
	update: function(request, response){ //saves the drawing data
		var data = {
			initColor: request.body.initColor, 
			initSize: request.body.initSize, 
			initCanvas: request.body.initCanvas
		};
		jsonfile.writeFile(fname, data, function(err){
			if(err){
				console.log(err);
			}
		});
		response.send(data);
	}
}