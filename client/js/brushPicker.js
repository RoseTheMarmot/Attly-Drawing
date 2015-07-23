var BrushPicker = function(container_selector, initSize, drawingApp){
  var sizes = [2, 5, 8, 11, 15];
  for(var i = 0; i < sizes.length; i++){
    if(sizes[i] == initSize){
      $(container_selector).append(box(sizes[i]).addClass('selected'));
    }else{
      $(container_selector).append(box(sizes[i]));
    } 
  }

  var currentBrush = initSize;
  
  this.changeBrush = function(current){
  	var newBrush = parseInt(current.attr('size'));
    drawingApp.ctx.lineWidth = newBrush;
    current.addClass('selected').siblings().removeClass('selected');
    currentBrush = newBrush;
    return newBrush;
  }

  this.currentBrush = function(){
    return currentBrush;
  }

  function box(size){
    return $("<div size="+size+"><div style='width:"+size+"px;height:"+size+"px;border-radius:50%;'></div></div>");
  }
}