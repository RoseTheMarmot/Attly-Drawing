function BrushPicker(initSize){
  var sizes = [2, 5, 8, 11, 15];
  var currentBrush = initSize;

  this.container = $('#brush-picker');
  for(var i = 0; i < sizes.length; i++){
    if(sizes[i] == initSize){
      this.container.append(box(sizes[i]).addClass('selected'));
    }else{
      this.container.append(box(sizes[i]));
    } 
  }
  
  //sets the current brush to a new brush
  this.changeBrush = function(newBrush){
    var new_current = $('[size='+newBrush+']', this.container);
    new_current.addClass('selected').siblings().removeClass('selected');
    currentBrush = newBrush;
    return new_current;
  }
  //returns current brush
  this.currentBrush = function(){
    return currentBrush;
  }

  function box(size){
    return $("<div size="+size+"><div style='width:"+size+"px;height:"+size+"px;border-radius:50%;'></div></div>");
  }
}