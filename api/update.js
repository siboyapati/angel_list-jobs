var http = require('http'),
	MongoClient = require('mongodb').MongoClient;
	
var exports = require('./exports.js');
var db, collection, last_id;

/*
*	Starting point of the script
*/
MongoClient.connect(exports.mongo_uri, function(err, database){
	db=database;
	collection=db.collection(exports.mongo_collection);
	
	/*
		Get the max id (in the current version of the API, the latest
		job published has the highest id)
	*/
	collection.find({}, {id: 1})
			  .sort({id: -1})
			  .limit(1)
			  .toArray(function(err, doc){
				if(doc.length === 0)
					last_id=0;
				else
					last_id=doc.pop().id;
				getNewJobs(1);
			});
});

/*
*	Get all the jobs that have higher id than last_id
*/
var getNewJobs = function(page) {
	http.get("http://api.angel.co/1/jobs?page="+page, function(res) {
		exports.read_data(res, function(body) {
			var parsed=JSON.parse(body);
			
			parsed.jobs.forEach(function(j){
				if(j.id>last_id) {
					collection.insert(j, function(err, result){});
				}
				else {
					process.exit();
				}
			});
			if(parsed.page !== parsed.last_page)
				getNewJobs(++page);
			else
				process.exit();
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}