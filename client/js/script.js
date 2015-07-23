/*
 * Main app script
 */

$(document).ready(function($){
  /*
   * Initialization
   */
  var socket = io.connect();
  var canvas = {};
  var colors = {};
  var brushes = {};
  var eraser = {};
  var save = {};
  var people;
  var curColor;
  var curBrush;
  var mousedown = false; //true false if the mouse is down while being moved

  
  $.get('/drawings', function(data){
      canvas = new Canvas('#draw-box', data);
      colors = new ColorPicker('#color-picker', data.initColor, canvas);
      brushes = new BrushPicker('#brush-picker', data.initSize, canvas);
      eraser = new Erase($('#erase-button'), '#ffffff', canvas);
      save = new Save($('#save-button'), $('#download-button .label'), $('#saved-bin'));
      curColor = data.initColor;
      curBrush = data.initSize;
      people = new People(socket); 
    },
    'json'
  );

  /*
   * Document listeners and socket emits
   */
  $('#color-picker'). //selecting a new color from the color picker
    on('click', '> div', function(){
      $('#erase-button').removeClass('selected');
      curColor = colors.changeColor($(this));
      socket.emit("color_change", {color: curColor});
      canvas.save();
    });
  $('#brush-picker'). //selecting a new brush size
    on('click', '> div', function(){
      curBrush = brushes.changeBrush($(this));
      socket.emit("brush_change", {brush: curBrush});
      canvas.save();
    });
  $('#erase-button').
    on('click', function(){
      $('#color-picker > div').removeClass('selected');
      curColor = eraser.use();
      socket.emit("brush_change", {brush: curColor});
    });
  $('#save-button').
    on('click', function(){
      save.saving();
      canvas.save(function(data){
        socket.emit('saving_canvas', {initCanvas:data.initCanvas});
      });
    });
  $('#saved-bin').
    //deleting a saved whiteboard
    on('click', 'span.glyphicon-remove', function(e){
      socket.emit("deleting_canvas", {id: $(this).closest('figure').attr('id') });
    });
  $("#draw-box"). 
    //starting a line
    on('mousedown', 'canvas', function(e){
      mousedown = true;
      canvas.draw(e.offsetX, e.offsetY, "dragstart");
      socket.emit("drawing", {x: e.offsetX, y: e.offsetY, type: "dragstart", id: socket.id});
    }). 
    //drawing a line 
    on('mousemove', 'canvas', function(e){
      if(mousedown){ 
        canvas.draw(e.offsetX, e.offsetY, "drag");
        socket.emit("drawing", {x: e.offsetX, y: e.offsetY, type: "drag", id: socket.id});
      }
    });
  $(document). 
    //ending a line
    mouseup(function(e){ 
      //listens to whole document so that path will be ended even if user is off the drawing screen
      if(mousedown){
        mousedown = false;
        canvas.draw(e.offsetX, e.offsetY, "dragend");
        socket.emit("drawing", {x: e.offsetX, y: e.offsetY, type: "dragend", id: socket.id});
        canvas.save();
      }
    });
  $("#reset_btn").
    click(function(){
      socket.emit("resetting_canvas");
    });
  $("#undo_btn").
    click(function(){
      socket.emit("undoing_move");
    });
  $("#redo_btn").
    click(function(){
      socket.emit("redoing_move");
    });


  /*
   * Socket listeners
   */
  socket.on("draw", function(data){ // multi-user drawing
    canvas.draw(data.x, data.y, data.type);
  });
  socket.on("color_changed", function(data){
    canvas.ctx.strokeStyle = data.color;
    colors.changeColor($('#color-picker div[color='+data.color+']'));
  });
  socket.on("brush_changed", function(data){ //change brush size
    canvas.ctx.lineWidth = data.brush;
    brushes.changeBrush($('#brush-picker div[size='+data.brush+']'));
  });
  socket.on("reset_canvas", function(){ //clear drawing area
    canvas.reset();
    canvas.save();
  });
  socket.on("saved_canvases", function(data){ //get saved canvases
    save.update_bin(data.canvases);
    save.done();
  });
  socket.on("undo_move", function(){
    canvas.undo();
  });
  socket.on("redo_move", function(){
    canvas.redo();
  });
  socket.on("person_drawing", function(data){
    $('#pplOnline [id='+data.id+']').css('background-color', canvas.ctx.strokeStyle);
  });
  socket.on("person_off", function(data){
    $('#pplOnline [id='+data.id+']').css('background-color', '#ffffff');
  });
});