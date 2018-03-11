var ObjectID = require('mongodb').ObjectID;
var request = require('request');
var queue = require('../queue/jobQueue');
var request = require('request');
var urlExists = require('url-exists');
const bodyParser = require('body-parser');

module.exports = function(app, db) {



	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		  extended: true
	}));


	app.get('/', function(req, res){
		res.send('Massdrop Job Queue');
	});
	//get status from id
	app.get('/fetch/:id', (req, res) => {
		const id = req.params.id
		const details = {'_id': new ObjectID(id)};
		db.collection('urls').findOne(details, (err, item) =>{
			if (!err && item != null){
				//return status of job
				if (item.status == 'completed'){
						res.send(item);
				} else{
					res.send({'status': 'job not completed'});
				}
			} else{
				res.send({'error': 'This job does not exist'});
			}
		});
	});

  //create job from url
  const collection = 
  app.post('/url/', (req, res) => {
	var url = 'http://' + req.body.url; 
	//check if valid url
	urlExists(url, function(err, exists){
		if (!err && exists){
			queue.createJob(url, res, db);
		} else{
			res.send({'error': 'not a valid website'});
		}
	})
  });
};