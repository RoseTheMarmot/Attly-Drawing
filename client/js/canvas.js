var Canvas = function(container_selector, init){
  var thisCanvas = this;

  //initializing the canvas
  this.canvas = document.createElement('canvas');
  this.canvas.id = "canvas_id"
  this.canvas.height = parseInt($('#draw-box').css('height'));;
  this.canvas.width = parseInt($('#draw-box').css('width'));
  this.canvas.background_color = '#FFFFFF';

  //getting drawing context
  this.ctx = this.canvas.getContext('2d');

  //initializing the drawing brush
  this.ctx.fillStyle = "solid";
  this.ctx.strokeStyle = init.initColor;
  this.ctx.lineWidth = init.initSize;
  this.ctx.lineCap = "round";

  //setting canvas background to white
  fill(this, this.canvas.background_color);
  
  //set up previous drawings
  setDrawing(this);

  //initialize history
  var history = [];
  var history_step = 0;
  
  //adding the drawing area to the page
  $(container_selector).append(this.canvas);

  //draws lines on the canvas
  this.draw = function(x,y,type){
    console.log(type);
    if(type == "dragstart"){
      this.ctx.beginPath();
      this.ctx.moveTo(x,y);
    }else if(type == "drag"){
      this.ctx.lineTo(x,y);
      this.ctx.stroke();
    }else{ //dragend
      this.ctx.closePath();
      push_history();
    }
  }

  //saves drawing settings
  this.save = function(callback){
    $.post(
      '/drawings', 
      {initColor: this.ctx.strokeStyle, initSize: this.ctx.lineWidth, initCanvas: this.canvas.toDataURL()},
      function(data){
        if(callback){
          callback(data);
        }
      },
      'json');
  }

  this.undo = function(){
    if(history_step > 0){
      setDrawing(thisCanvas, history[--history_step]);
    }
  }

  this.redo = function(){
    if(history_step+1 < history.length){
      setDrawing(thisCanvas, history[++history_step]);
    }
  }

  this.reset = function(){
    fill(thisCanvas, thisCanvas.canvas.background_color);
    history[0] = thisCanvas.canvas.toDataURL();
    history.length = 1;
    history_step = 0;
  }

  // saves drawing moves for undo/redo
  function push_history(){
    history[++history_step] = thisCanvas.canvas.toDataURL();
    history.length = history_step + 1;
  }

  //loads previous drawings into the canvas
  function setDrawing(canvas, image){
    var img = new Image;
    img.onload = function(){
      canvas.ctx.drawImage(img,0,0);
    };
    if(!image){
      img.src = init.initCanvas;
    }else{
      img.src = image;
    } 
  }

  function fill(canvas, color){
    canvas.ctx.fillStyle = color;
    canvas.ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);
  }
}