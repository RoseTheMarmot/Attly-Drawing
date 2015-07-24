var Erase = function(background_color, drawingApp){
	this.element = $('#erase-button');
	this.element.attr('color', background_color);

	this.use = function(){
		var newColor = this.element.attr('color');
		this.element.addClass('selected');
		return newColor;
	}
}