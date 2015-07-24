/*
 * Main app script
 */

$(document).ready(function($){
  /*
   * Initialization
   */
  var socket = io.connect();
  var canvas; //the canvas
  var brushes; //all brushes, including my brush
  var colors; //selection of colors
  var brush_options; //selection of all brushes
  var eraser;
  var save;
  var people; //list of onine useres
  var curColor;
  var curBrush;
  var mousedown = false; //true false if the mouse is down while being moved

  $.get('/drawings', function(data){
      canvas = new Canvas('#draw-box', data);
      colors = new ColorPicker( data.initColor );
      brushes = new Brushes(canvas);
      brush_options = new BrushPicker( data.initSize );
      eraser = new Erase('#ffffff', canvas);
      save = new Save($('#save-button'), $('#download-button .label'), $('#saved-bin'));
      people = new People();
      curColor = data.initColor;
      curBrush = data.initSize;
      app();
    },
    'json'
  );

  function app(){
    people.prompt();
    
    /*
     * Document listeners and socket emits
     */
    people.modal.
      on('click', '#name-btn', function(e){
        var name = $("input[name='name']", people.modal).val();
        brushes.add(socket.id, colors.curColor, brush_options.curBrush);
        socket.emit('new_name', {name: people.validate_name(name) });
        socket.emit('new_brush', {brush: brushes.get(socket.id).info() });
      }).
      on('click', '#no-name', function(e){
        socket.emit('new_name', {name: people.validate_name() });
      });
    colors.container. //selecting a new color from the color picker
      on('click', '> div', function(e){
        $('#erase-button').removeClass('selected');
        var new_current = colors.changeColor($(this).attr('color'));
        new_current.closest('.popout').find('.popout-button').css('background-color', $(this).attr('color'));
        socket.emit("color_change", {color: $(this).attr('color'), id: socket.id });
        canvas.save();
      });
    brush_options.container. //selecting a new brush size
      on('click', '> div', function(e){
        brush_options.changeBrush($(this).attr('size'));
        socket.emit("brush_change", {brush: $(this).attr('size'), id: socket.id });
        canvas.save();
      });
    $('#erase-button').
      on('click', function(){
        $('> div', colors.container).removeClass('selected');
        curColor = eraser.use();
        canvas.ctx.strokeStyle = curColor;
        socket.emit("brush_change", {brush: curColor, id: socket.id });
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
        brushes.get(socket.id).draw(e.offsetX, e.offsetY, "dragstart");
        socket.emit("drawing", {x: e.offsetX, y: e.offsetY, type: "dragstart", id: socket.id});
      }). 
      //drawing a line 
      on('mousemove', 'canvas', function(e){
        if(mousedown){ 
          brushes.get(socket.id).draw(e.offsetX, e.offsetY, "drag");
          socket.emit("drawing", {x: e.offsetX, y: e.offsetY, type: "drag", id: socket.id});
        }
      });
    $(document). 
      //ending a line
      mouseup(function(e){ 
        //listens to whole document so that path will be ended even if user is off the drawing screen
        if(mousedown){
          mousedown = false;
          brushes.get(socket.id).draw(e.offsetX, e.offsetY, "dragend");
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
    $('.picker').
      on('mouseup', 'button', function(e){
        e.currentTarget.blur();
      });


    /*
     * Socket listeners
     */
    socket.on('updated_people', function(data){
        people.update(data.people);
      });
    socket.on('added_brush', function(data){
        brushes.add(data.brush.id, data.brush.strokeStyle, data.brush.lineWidth);
      });
    socket.on('removed_brush', function(data){
        brushes.remove(data.id);
      });
    socket.on('updated_brushes', function(data){
        for( var idx in data.brushes ){
          if( brushes.get(idx) == null ){
            var brush = data.brushes[idx];
            brushes.add(brush.id, brush.strokeStyle, brush.lineWidth);
            console.log(brushes.index());
          }
        }
      });
    socket.on("draw", function(data){ // multi-user drawing
        var active_brush = brushes.get(data.id);
        if(active_brush){
          active_brush.draw(data.x, data.y, data.type);
        }
      });
    socket.on("color_changed", function(data){
        brushes.get(data.id).ctx.strokeStyle = data.color;
      });
    socket.on("brush_changed", function(data){ //change brush size
        brushes.get(data.id).ctx.lineWidth = data.brush;
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
        people.check(data.id);
        people.highlight_on(data.id, canvas.ctx.strokeStyle);
      });
    socket.on("person_off", function(data){
        people.highlight_off(data.id);
      });
    socket.on("sever_restarted", function(){
      people.prompt();
    });
  }
});