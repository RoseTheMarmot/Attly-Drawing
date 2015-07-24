/*
 * manages showing who is online
 */
function People(){
	
	var people = {};

	this.container = $('#pplOnline');
	this.modal = $("#name-modal");

	this.index = function(){
		return people;
	}
	
	this.update = function(object){
		this.container.html('');
		people = object;
		for( idx in people ){
  		this.container.append('<li id="'+idx+'">'+people[idx]+'</li>');
  	}
		return people;
	}
	//triggers prompt for users' name
	this.prompt = function(){
		this.modal.modal();
	}

	this.validate_name = function(name){
		if(!name){
			name = anonomous_name();
		}
		return name;
	}
	//highlights the person's name
	this.highlight_on = function(id, color){
		$('[id='+id+']', this.container).css('background-color', color);
	}
	//removes hilights from the person's name
	this.highlight_off = function(id){
		$('[id='+id+']', this.container).css('background-color', '#ffffff');
	}
	//double checkes to see if person is included in the lsit of people
	this.check = function(id){ 
		if(!people[id]){
			this.prompt();
		}
	}

	function anonomous_name(){
		var randNum = Math.floor(Math.random()*899)+100;
		return "Anonymous"+randNum;
	}
}
