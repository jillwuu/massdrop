var request = require('request');
var ObjectID = require('mongodb').ObjectID;
var kue = require('kue');
var queue = kue.createQueue();
var db = require('../../database/db');

function runJob(job, done) {
	var url = job.url;
	request(url, function(error, response, html){
		if (!error){
			job.data = html;
			done(null, job);
		} else{
			done(error); //fix this with real error handling
		}
	});
}

function createJob(url, res, db){
	var urlObject = {url: url, data: '', status: 'not_completed'};
	//add new job to db
	db.collection('urls').insert(urlObject, (err, result) => {
	      if (err) { 
	        res.send({ 'error': 'An error has occurred' }); 
	      } else {
	        res.send(result.ops[0]);
	      }
    });
	//add new job to queue
	var createJob = queue.create('job', urlObject)
	.removeOnComplete(false)
	.on('complete', function(result){
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
	}).on('start', function(){
	}).on('enqueue', function(){
	})
	.save( function(err){ // fix error handling for htis
		if (!err) {
			console.log(urlObject._id);
		} else{
			console.log('an error has occurred');
		};

	});
}

function done(done){
	done();
}

queue.process('job', function(job, done){
	runJob(job.data, done);
})



module.exports = {
	createJob: createJob
}