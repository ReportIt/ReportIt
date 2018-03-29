var mongoose = require('mongoose');

//Ticket Schema
var TicketSchema = mongoose.Schema({
	username: {   
		type: String,
		index: true
	},
	sacId: {
		type: Number
	},
    issue: {   
		type: String
	},
	dept: {   
		type: String
	},
	status: {   
		type: String
	}

});
var Ticket = module.exports = mongoose.model('Ticket', TicketSchema);