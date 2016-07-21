var mongoose = require('mongoose');
var Log = mongoose.model('Log');

module.exports = {
	index: function(req, res){
		Log.find({}).exec(function(err, doc){
			if(err){
				console.log(err);
			} else {
				res.json(doc);
			}
		})
	},
	create: function(req, res){
		console.log(req.body);
	}
}