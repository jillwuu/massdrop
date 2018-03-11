var ObjectID = require('mongodb').ObjectID;
var request = require('request');
var controller = require('../controllers/jobsController');
var request = require('request');
var urlExists = require('url-exists');

module.exports = function(app, db) {

	app.get('/fetch/:id', (req, res) => {
		const id = req.params.id
		const details = {'_id': new ObjectID(id)};
		db.collection('urls').findOne(details, (err, item) =>{
			if (err){
				res.send({'error': 'This job does not exist'});
			} else{
				if (item == null){
					res.send({'error': 'This job does not exist'});
				} else{
					if (item.status == 'completed'){
						res.send(item);
					} else{
						res.send({'status': 'job not completed'});
					}
				}
				
			}
		});
	});

  //create job from url
  const collection = 
  app.post('/url/:url', (req, res) => {
	var url = 'http://' + req.params.url; 
	//check if valid url
	urlExists(url, function(err, exists){
		if (!err && exists){
			controller.createJob(url, res, db);
		} else{
			res.send({'error': 'not a valid website'});
		}
	})
  });
};