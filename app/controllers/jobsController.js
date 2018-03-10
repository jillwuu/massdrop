var request = require('request');
var ObjectID = require('mongodb').ObjectID;
var kue = require('kue');
var queue = kue.createQueue();
var db = require('../../database/db');

// function getHTML(url, res, db){
// 	request(url, function(error, response, html){
//     	if (!error){
//     		var urlObject = {url: url, data: html}; 
//     		queueJob(urlObject, res);
//     		db.collection('urls').insert(urlObject, (err, result) => {
// 		      if (err) { 
// 		        res.send({ 'error': 'An error has occurred' }); 
// 		      } else {
// 		      	//queueJob(result.ops[0]);
// 		        res.send(result.ops[0]);
// 		      }
// 		    });
//     	}
//     })
// };


//queue:
//create initial job, place in queue
//process run in queue: extract html


function runJob(job, done) {
	var url = job.url;
	//console.log(url);
	request(url, function(error, response, html){
		if (!error){
			job.data = html;
			console.log('done');
		}
	});
	console.log(job);
	//done();
	//after job is run, update urlObject
}

function createJob(url, res, db){
	//console.log(res);
	var urlObject = {url: url, data: ''};
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
		console.log('Job Completed');

		//update & save to database
	}).on('start', function(progress, data){
		console.log('Job ' + urlObject._id + ' starting');
	}).on('enqueue', function(){
		console.log("pending");
	})
	.save( function(err){
		if (!err) {
			console.log(urlObject._id);
			console.log('saved');
		} else{
			console.log('an error has occurred');
		};

	});

	// queue.completeCount( function( err, total ) { // others are activeCount, completeCount, failedCount, delayedCount
	// 	console.log(total + 'complete');
	// });
}

function done(done){
	done();
}

queue.process('job', function(job, done){
	job.data = runJob(job.data)
	done();
	//console.log(job.data);
	
	// var urlObject = job.data;
	// runJob(urlObject, done);
	// console.log('runJob done');
})



module.exports = {
	// getHTML: getHTML,
	createJob: createJob
}



//queue


//todo
//create queue
//get jobs to run in queue
//validation