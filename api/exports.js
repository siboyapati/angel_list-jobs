module.exports = {
	mongo_uri: 'mongodb://<username>:<password>@<subdomain>.mongolab.com:<port>/<db>',
	mongo_collection: 'job_collection',
	read_data: function(res, callback) {
		var body='';
		res.on('data', function(d){
			body+=d;
		});
		
		res.on('end', function(){
			callback(body);
		});
	}
};