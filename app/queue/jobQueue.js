var request = require('request');
var ObjectID = require('mongodb').ObjectID;
var kue = require('kue');
var queue = kue.createQueue();
var db = require('../../database/db');

function runJob(job, done) {
	var url = job.url;
	//get HTML from url
	request(url, function(error, response, html){
		if (!error){
			job.data = html;
			//return updated job
			done(null, job); 
		} else{
			throw new Error("an error has occurred"); 
			//complete job so queue keeps running
			done(error);
		}
	});
}

function createJob(url, res, db){
	//create job object
	var urlObject = {url: url, 
		status: 'not_completed', 
		data: ''};
	//add new job to db
	db.collection('urls').insert(urlObject, (err, result) => {
	      if (err) { 
	        res.send({ 'error': 'an error has occurred' }); 
	      } else {
	        res.send(result.ops[0]);
	      }
    });
	//add new job to queue
	var createJob = queue.create('job', urlObject)
	.removeOnComplete(false)
	.on('complete', function(result){
		//save updated job to db
		var updatedJob = result;
		var details = {'_id': new ObjectID(updatedJob._id)};
		db.collection('urls').findOneAndUpdate(
			details, 
			{
				$set: {
					data: updatedJob.data,
					status: 'completed'
				}
			}
		);
	})
	.save(function(err){ 
		if (err) {
			throw new Error("an error has occurred");
		};

	});
}
//process queue
queue.process('job', function(job, done){
	runJob(job.data, done);
})

module.exports = {
	createJob: createJob
}
