var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var qs = require('querystring');

var exports = require('./exports.js');

/*
*	HTTP Server
*/
http.createServer(function(request, response) {
	var query_vars = qs.parse(request.url.split('?')[1]);
	var page = parseInt(query_vars.page || 1, 10);
	
	MongoClient.connect(exports.mongo_uri, function(err, db){
	
		readJobs(db, function(err, jobs) {
			
			getJobCount(db, function(err, count){
				db.close();
				// Set content type and enable CORS
				response.writeHead(200, {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Request-Method': '*',
					'Access-Control-Allow-Methods': 'GET',
					'Access-Control-Allow-Headers': '*',
					"Content-type": "application/json"
				});
				response.write(JSON.stringify({jobs: jobs, count: count}));
				response.end();
			});
		}, page);
	});
}).listen(8888);

/*
*	Get 10 job items
*/
var readJobs = function(db, callback, page) {
	var collection=db.collection(exports.mongo_collection);
	
	collection.find({})
			  .sort({id: -1})
			  .skip((page-1)*10)
			  .limit(10)
			  .toArray(callback);
}

/*
*	Get the job item count
*/
var getJobCount = function(db, callback) {
	var collection=db.collection(exports.mongo_collection);
	
	return collection.find({}).count(callback);
}