/*
 * Server side Sockets
 */

module.exports = function(server){
	
	var io = require("socket.io").listen(server);

	//people
	var people = {};
	//brushes
	var brushes = {};
	//saved canvases
	var saved_canvases = {};

	io.sockets.on("connection", function(socket){

		/******* people *******/
		io.emit('updated_people', {people: people});
		
		socket.on("new_name", function(data){
			people[socket.id] = data.name;
			io.emit('updated_people', {people: people});
		});
		
		socket.on("disconnect", function(){
			if( people[socket.id] ){
				delete people[socket.id];
				io.emit('updated_people', {people: people});
			}
		});

		/******* brushes *******/
		console.log(brushes);
		io.emit('updated_brushes', {brushes: brushes});

		socket.on("new_brush", function(data){
			brushes[socket.id] = data.brush;
			console.log(data.brush);
			socket.broadcast.emit('added_brush', {brush: data.brush });
		});

		socket.on("disconnect", function(){
			if( brushes[socket.id] ){
				delete brushes[socket.id];
			}
			io.emit('removed_brush', {id: socket.id});
		});

		/****** whiteboards *******/
		io.emit("saved_canvases", {canvases: saved_canvases});
		
		socket.on("saving_canvas", function(data){
			var id = new Date().getTime();
			saved_canvases[id] = data.initCanvas;
			io.emit("saved_canvases", {canvases: saved_canvases});
		});

		socket.on("deleting_canvas", function(data){
			if( saved_canvases[data.id] ){
				delete saved_canvases[data.id];
				io.emit("saved_canvases", {canvases: saved_canvases});
			}
		});

		/****** drawing *******/
		socket.on("drawing", function(data){
			socket.broadcast.emit("draw", {x:data.x, y:data.y, type:data.type, id:data.id});
			if(data.type == "dragstart"){
				io.emit("person_drawing", {id:data.id});
			}else if(data.type == "dragend"){
				io.emit("person_off", {id:data.id});
			}
		});

		socket.on("color_change", function(data){
			io.emit("color_changed", {color: data.color, id: data.id });
		});

		socket.on("brush_change", function(data){
			io.emit("brush_changed", {brush: data.brush, id: data.id });
		});

		/****** undo/redo/clear *******/
		socket.on("resetting_canvas", function(){
			io.emit("reset_canvas");
		});

		socket.on("undoing_move", function(){
			io.emit("undo_move");
		});

		socket.on("redoing_move", function(){
			io.emit("redo_move");
		});
		
	});
}