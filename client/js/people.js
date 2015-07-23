/*
 * manages showing who is online
 */

$(document).ready(function(){
	
	var socket = io.connect();
	var pplOnline = $('#pplOnline');
	var nameModal = $("#name-modal");

	/*
	 * event listeners
	 */
	nameModal.modal();
	nameModal.
		on('click', '#name-btn', function(e){
			var name = $("input[name='name']", nameModal).val();
			setName(name);
		}).
		on('click', '#no-name', function(e){
			setName();
		});

	/*
   * Socket listeners
   */
  socket.on('updated_people', function(data){
  	pplOnline.html('');
  	for( idx in data.people ){
  		pplOnline.append('<li id="'+idx+'">'+data.people[idx]+'</li>');
  	}
  });

	/*
	 * Socket emits
	 */
	function setName(name){
		if(!name){
			name = anonomousName();
		}
		socket.emit('new_name', {name: name});
	}

	/*
	 * Utility functions
	 */
	function anonomousName(){
		var randNum = Math.floor(Math.random()*899)+100;
		return "Anonymous"+randNum;
	}

});