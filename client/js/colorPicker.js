function ColorPicker(initColor){
  var colors = ['#000000', '#FFFFFF', '#333333', '#02C0DC', '#04447A', '#AD1D17', '#46B74F', '#CCCCCC', '#888888', '#FF0000', '#0000FF'];
  var boxes = colors.length;
  var currentColor = initColor;

  this.container = $('#color-picker');
  for(var i=0; i<boxes; i++){
    if(colors[i].toLowerCase() == initColor){
      this.container.append(box(colors[i]).addClass('selected'));
    }else{
      this.container.append(box(colors[i]));
    } 
  }

  //sets the current color to the new color
  this.changeColor = function(newColor){
    var new_current = $('[color='+newColor+']', this.container);
    new_current.addClass('selected').siblings().removeClass('selected');
    currentColor = newColor;
    return new_current;
  }
  //returns current color
  this.currentColor = function(){
    return currentColor;
  }
  //returns list of all colors
  this.colors = function(){
    return colors;
  }
  //adds a color to the list
  this.addColor = function(hex_color){
    if( typeof(hex_color) === 'string' && hex_color.match(/#[a-fA-F\d]{6}/) ){
      colors.push(hex_color);
    }
    return colors;
  } 
  //removes a color from the list
  this.removeColor = function(hex_color){
    if( typeof(hex_color) === 'string' && hex_color.match(/#[a-fA-F\d]{6}/) ){
      var to_remove = 0;
      for( var i=0; i<colors.length; i++){
        if( colors[i] == hex_color ){
          to_remove++;
        }else{
          colors[i-to_remove] = colors[i];
        }
      }
      while(to_remove--){
        colors.pop();
      }
    }
    return colors;
  }

  function box(color){
    return $("<div color='"+color+"' style='background-color:"+color+";'>"+color+"</div>");
  }

}