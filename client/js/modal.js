/*
 * modal related scripts and listeners
 */

$(document).ready(function(){
	
	//submits name in name modal when enter key is pressed
	$('#name-modal input[name="name"]').on("keypress", function(e){
		if(e.charCode == 13){
			$('#name-modal button#name-btn').trigger('click');
		}
	});

	/*** popouts ***/
	
	//initially hide popout content
	$('.popout .popout-content').hide(); 
	
	//main popout functionality
	$('.popout').
		on('click', '.popout-button', function(){ 
			var this_popout = $(this).closest('.popout');
			//toggle popout
			$('.popout-content', this_popout).toggle();
			//hide a click-to-hide popout
			this_popout.on('click', '.popout-content.click-to-hide', function(){
				$(this).hide();
			});	
		});
	
	//remove focus from button after click
	$('.popout-button').on('mouseout', function(){
		$(this).blur();
	});
	
	//enable and dsiable popout as content is addied and removed
	$(".popout").on("DOMSubtreeModified", function() {
    var this_popout = $(this);
    if($(".popout-content", this_popout).children().length == 0){
    	$(".popout-button", this_popout).addClass('disabled');
    	$(".popout-content", this_popout).hide();
    }else{
    	$(".popout-button", this_popout).removeClass('disabled');
    }
	});

});