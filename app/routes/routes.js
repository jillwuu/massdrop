var ObjectID = require('mongodb').ObjectID;
var request = require('request');
var controller = require('../controllers/jobsController');

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
					res.send(item);
				}
				//console.log(item);
				
			}
		});
	});

  //create job from url
  const collection = 
  app.post('/url/:url', (req, res) => {
	var url = 'http://' + req.params.url; 
	//check if valid url
    
	controller.createJob(url, res, db);
  });
};