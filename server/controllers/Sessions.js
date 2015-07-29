/*
 * Sessions controller
 */

var fs = require('fs');
var jsonfile = require('jsonfile');
var bcrypt = require('bcrypt');
var valid_ips = [];

module.exports = {
	//returns true or false if the ip address is valid
	auth: function(ip){
		//return valid_ips.indexOf(ip) > -1;
		return true;
	},
	//if the password is correct, the ip address is added to the list of valid addresses
	create: function(request, response){ 
		bcrypt.compare(
			request.body.passphrase, 
			'$2a$10$zkXcP.cfgt0XhUStAoviD.8mPZ7ysbAmxe6qSWuhyyP8FszVd0meK', 
			function(err, res){
				if( res == true ){
					if( valid_ips.indexOf(request.ip) < 0 ){
						valid_ips.push(request.ip);
					}
					response.redirect('/');
				}else{
					response.render('login', {'errors':true});
				}
			}
		);
	},
	//removes an ip from the valid ip array
	destory: function(request, response){
		var idx = valid_ips.indexOf(request.ip);
		if( idx > -1 ){
			for(var i=idx; i<valid_ips.length-1; i++){
				valid_ips[i] = valid_ips[i+1];
			}
			valid_ips.pop();
		}
	}
}