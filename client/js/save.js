/*
 * for saving whiteboards
 */

function Save(save_button, count_label, saved_bin){
	var save_button = save_button;
	var count_label = count_label;
	var saved_bin = saved_bin;

	update_label(0);

	function update_label(count){
		if( count <= 0){
      count_label.hide();
      count_label.text(count);
    }else{
    	count_label.text(count);
      count_label.show();
    }
	}
	
	this.saving = function(){
		save_button.addClass('disabled').blur().html('<img height="15" src="/../images/fancybox_loading.gif">');
	}
	this.done = function(){
		save_button.removeClass('disabled').html("Save");
	}
	this.update_bin = function(data){
		var count = 0;
		saved_bin.html('');
		for( var idx in data ){
			count++;
			saved_bin.append('<figure id="'+idx+'"><a download="image.png" href="'+data[idx]+'">whiteboard_'+idx+'</a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></figure>');
		}
		update_label(count);
	}
}
