const assert = require('assert');
const db = require('../database-mongo/index.js');
var request = require('supertest');
var mocha = require('mocha');

describe('save',function(){
  var event;
  
  //save to database to see it is saving or not
	it('save to database',function(){
    	event = new db.Event({
			email:'sdsada' ,
			creatorName:'sdfsfr',
			eventName: 'dffrrg',
			cost:12,
			des: 'sdfsf',
			url: 'sdfsdf',
			date:'fdfsfdg',
			availableSeats: 342243,
			eventLocation: [31, 35],
			attending:[2],
			imgName: 'sgrg'
    	});

    	event.save().then(function(){
      	assert(event.isNew === false);
    	});

	});

//delete one from the database to check if you can remove specific one
	it('Delete specific one from the database', function(){
    	db.Event.findOneAndRemove({email:'sdsada'}).then(function(){
			db.Event.findOne({email:'sdsada'}).then(function(result){
        		assert(result === null);
      		});
    	});
  	});

  //update one 

  it('Updates the saved data', function(){
      db.Event.findOneAndUpdate({email:'sdsada'}, {email: 'None'}).then(function(){
		db.Event.findOne({_id: event._id}).then(function(result){
              assert(result.email === 'None');
          });
      });
  });



});

describe('Server Test', function () {

    describe('Connection Test', function () {
        it('Should have a response from the server ', function (done) {
            request('http://127.0.0.1:3000').get('/').expect(200, done)
        })
        it('should resived error from the server with wrong path ', function (done) {
            request('http://127.0.0.1:3000').get('/wrong').expect(404, done)
        });
    });
});

describe('POST', function () {

    it('should register users ', function (done) {
        request('http://127.0.0.1:3000').post('/signup').expect(200).send({
            name: 'dana',
            major: 'hhhhh',
             email: 'dana@gfgf.com',
            username: 'dd',
            password: '3333',
            description:'wow',
            phoneNumber: '072852',
        }).end(function (err, res) {
            done()

        })
    })
})
describe('POST', function () {

    it('users login', function (done) {
        request("http://127.0.0.1:3000")
          .post("/login")
          .expect(200)
          .send({
            username: "dana",
            password: "1232"
          })
          .end(function(err, res) {
            done();
          });
    });
});

