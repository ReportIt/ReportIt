var mongoose = require('mongoose');

//Admin Schema
var AdminSchema = mongoose.Schema({
	username: {   
		type: String
	},
	password: {
		type: String
	},
	department: {
		type: String
	}
});
var Admin = module.exports = mongoose.model('Admin', AdminSchema);

module.exports.validPassword = function (enteredPassword,exisetedPassword) {
	if (enteredPassword === exisetedPassword) {
	  return true; 
	} else {
	  return false;
	}
  }