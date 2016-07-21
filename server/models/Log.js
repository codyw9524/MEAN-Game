var mongoose = require('mongoose');

var LogSchema = mongoose.Schema({
	messages: [{message: String}]
})

var Log = mongoose.model('Log', LogSchema);