var mongoose = require('mongoose');

//FAQ Schema
var FaqSchema = mongoose.Schema({
	question: {
		type: String
	},
    answer: {   
		type: String
	}

});
var Faq = module.exports = mongoose.model('Faq', FaqSchema);