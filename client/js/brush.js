/*
 * Brush 
 */

function Brush(canvas, initColor, initSize, id){

	//getting drawing context
  this.ctx = canvas.canvas.getContext('2d');

  //initializing the drawing brush
  this.ctx.fillStyle = "solid";
  this.ctx.strokeStyle = initColor;
  this.ctx.lineWidth = initSize;
  this.ctx.lineCap = "round";

  this.id = id;

  //draws lines on the canvas
  this.draw = function(x,y,type){
    if(type == "dragstart"){
      this.ctx.beginPath();
      this.ctx.moveTo(x,y);
    }else if(type == "drag"){
      this.ctx.lineTo(x,y);
      this.ctx.stroke();
    }else{ //dragend
      this.ctx.closePath();
      canvas.push_history();
    }
  }

  this.info = function(){
  	var info = {
  			'id': this.id,
	  		'fillStyle': this.ctx.fillStyle,
	  		'strokeStyle': this.ctx.strokeStyle,
	  		'lineWidth': this.ctx.lineWidth,
	  		'lineCap': this.ctx.lineCap
	  	};
  	return info;
  }
}

function Brushes(canvas){
	var brushes = {};

	this.index = function(){
		return brushes;
	}

	this.add = function(id, initColor, initSize){
		brushes[id] = new Brush(canvas, initColor, initSize, id);
	}

	this.remove = function(id){
		if(brushes[id]){
			delete brushes[id];
		}
	}

	this.get = function(id){
		if(brushes[id]){
			return brushes[id];
		}
		return null;
	}
}