var ColorPicker = function(container_selector, initColor, drawingApp){
  var colors = ['#000000', '#FFFFFF', '#333333', '#02C0DC', '#04447A', '#AD1D17', '#46B74F', '#CCCCCC', '#888888', '#FF0000', '#0000FF'];
  var boxes = colors.length;
  
  for(var i = 0; i < boxes; i++){
    if(colors[i].toLowerCase() == initColor){
      $(container_selector).append(box(colors[i]).addClass('selected'));
    }else{
      $(container_selector).append(box(colors[i]));
    } 
  }

  var currentColor = initColor;

  this.changeColor = function(current){
  	var newColor = current.attr("color");
    drawingApp.ctx.strokeStyle = newColor;
    current.addClass('selected').siblings().removeClass('selected');
    current.closest('.popout').find('.popout-button').css('background-color', newColor);
    currentColor = newColor;
    return newColor;
  }

  this.currentColor = function(){
    return currentColor;
  }

  function box(color){
    return $("<div color='"+color+"' style='background-color:"+color+";'>"+color+"</div>");
  }
}