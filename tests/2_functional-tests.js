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

  let id;

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
          id = res.body._id;
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
          assert.hasAllKeys(res.body[0], ["_id", "title", "commentcount"], "Every object should have title, _id, and commentcount");
          done();
        })
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      // US 8: If I try to request a book that doesn't exist I will get a 'no book exists' message.
      test('Test GET /api/books/[id] with id not in db',  function(done){
        let fakeId = "507f1f77bcf86cd799439011"
        chai.request(server)
        .get('/api/books/' + fakeId)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.message, "no book exists");
          done();
        })
      });
      
      // US: 5 I can get /api/books/{_id} to retrieve a single object 
      // of a book containing title, _id, & an array of comments 
      // (empty array if no comments present).
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get("/api/books/"+id)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.hasAllKeys(res.body, ["_id", "title", "comments"], "Body should have keys '_id', 'title' and 'comments'");
          assert.isArray(res.body.comments, "Body.comments should be an array.");
          done();
        })
      });
    });

    //US 6: I can post a comment to /api/books/{_id} to add a comment to a book and returned will be the books object similar to get /api/books/{_id}.
    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      test('Test POST /api/books/[id] with comment', function(done){
        let testComment = "CommentTest"
        chai.request(server)
        .post("/api/books/"+id)
        .send({
          comment: testComment
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.hasAllKeys(res.body, ["_id", "title", "comments"], "Body should have keys '_id', 'title' and 'comments'");
          assert.isArray(res.body.comments, "Body.comments should be an array.");
          assert.isAtLeast(res.body.comments.length, 1, "Comments should a length of at least 1.");
          assert.include(res.body.comments, testComment, "Comments array should incldue " + testComment);
          done();
        })
      });
    });

    // US 7: I can delete /api/books/{_id} to delete a book from the collection. Returned will be 'delete successful' if successful.
    // self expanded to response of delete unsuccessful if delete is not successful.
    suite("DELETE /api/books/{_id} => delete a book with 'delete successful' if successful", function() {
      test("Test DELETE /api/books/[id] with valid id", function(done) {
        chai.request(server)
        .delete("/api/books/"+id)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.message, "delete successful");
          done();
        })
      })

      test("Test DELETE /api/books/[id] with id not in database", function(done) {
        let fakeId = "507f1f77bcf86cd799439011"
        chai.request(server)
        .delete("/api/books/"+fakeId)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.message, "delete unsuccessful");
        })
      })
    });
  });
});
