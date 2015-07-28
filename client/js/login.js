$(document).ready(function(){
	
	var error_messages = ['failed-you-have.jpg', 'darth-vader-nooooo.jpg', '55709317.jpg', 'you_shall_not_pass1.jpg']
	
	$('form').submit(function(){
		$.ajax({
		  type: "POST",
		  url: $(this).attr('action'),
		  data: $(this).serialize(),
		  success: function(data){},
		  dataType: 'json'
		});
		//return false;
	});

	$('.errors.true').append('<img src="/images/'+error_messages[Math.floor(Math.random()*error_messages.length)]+'" alt="incorrect password">');

});