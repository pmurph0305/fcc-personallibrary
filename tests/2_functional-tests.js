/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      //US 3: I can post a title to /api/books to add a book and returned will be the object with the title and a unique _id.
      test('Test POST /api/books with title', function(done) {
        let title = "testbook";
        chai.request(server)
        .post("/api/books")
        .send({
          title: title
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, title, res.body.title + " does not equal " + title);
          assert.property(res.body, "_id", "_id was not returned with the response");
          done();
        })
      });
      
      // User stories does not say how to handle no title given
      // currently it returns a message saying a title is required.
      test('Test POST /api/books with no title given', function(done) {
        let title = "";
        chai.request(server)
        .post("/api/books")
        .send({
          title: title
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.message, "A book title must be provided.");
          assert.notProperty(res.body, "_id", "With no title given, response should not have an '_id' property");
          assert.notProperty(res.body, "title", "With no title given, response should not have a 'title' property.");
          done();
        })
      });

    });


    suite('GET /api/books => array of books', function(){
      //US 4: I can get /api/books to retrieve an aray of all books containing title, _id, & commentcount.
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.typeOf(res.body, "Array", "Response should be an Array");
          assert.hasAllKeys(res.body[0], ['_id', 'title', 'commentcount'], "Every object should have title, _id, and commentcount");
          done();
        })
      });      
    });


    // suite('GET /api/books/[id] => book object with [id]', function(){
      
    //   test('Test GET /api/books/[id] with id not in db',  function(done){
    //     //done();
    //   });
      
    //   test('Test GET /api/books/[id] with valid id in db',  function(done){
    //     //done();
    //   });
      
    // });


    // suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
    //   test('Test POST /api/books/[id] with comment', function(done){
    //     //done();
    //   });
      
    // });

  });

});
