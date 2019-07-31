/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app, db) {
  //US 4: I can get /api/books to retrieve an aray 
  // of all books containing title, _id, & commentcount.
  app.route('/api/books')
    .get(function (req, res){
      db.collection('books').find({}, { projection: { _id: 1, title:1, commentcount:1 }}).toArray().then(result => {
        //response will be array of book objects
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
        res.json(result);
      });
    })
    
    //US 3: I can post a title to /api/books to add a book and returned will be the object with the title and a unique _id.
    .post(function (req, res){
      var title = req.body.title;
      if (!title) {
        res.json({ message: "A book title must be provided."})
      } else {
        // add comment counts here, so every book contains a comment count.
        db.collection('books').insertOne({
          title: title,
          commentcount: 0
        }, function(err, result) {
          if (err) res.json({ message: "Database Error, unable to add a new book." })
          else {
            //response will contain new book object including at least _id and title
            //US 3 says just title, and unique id, so that is what is returned.
            res.json({ 
              _id: result.ops[0]._id,
              title: result.ops[0].title 
            });
          }
        })
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });


  
  app.route('/api/books/:id')
    //US 5: I can get /api/books/{_id} to retrieve a single object of a book containing
    // title, _id, & an array of comments (empty array if no comments present).
    .get(function (req, res){
      var bookid = req.params.id;
      if (!bookid) {
        res.json({ message: "Must submit a bookid"})
      } else {
        // make sure book id is a valid ObjectId
        if (!ObjectId.isValid(bookid)) {
          res.json({ message: "Invalid book id." });
        } else {
          db.collection("books").findOne({ _id: ObjectId(bookid) }, function(err, result) {
            if (err) res.json({ message: "Database error."})
            // non empty result.
            else if (result) {
              if (!result.hasOwnProperty("comments")) {
                result.comments = [];
              }
              //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
              res.json({ 
                _id: result._id, 
                title: result.title, 
                comments: result.comments 
              });
            }
            // book doesn't exist
            else {
               //US 8: If I try to request a book that doesn't exist I will get a 'no book exists' message.
              res.json({ message: "no book exists"})
            }
          })
        }
      }
    })
    

    //US 6: I can post a comment to /api/books/{_id} to add a 
    //comment to a book and returned will be the books object
    // similar to get /api/books/{_id}.
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      // make sure we have a valid book id.
      if(!ObjectId.isValid(bookid)) {
        res.json({ message: "Invalid book id." });
      } else {
        db.collection('books').findOneAndUpdate(
          { _id: ObjectId(bookid) },
          { $push: { comments: comment },
            $inc: { commentcount: 1 }
          },
          { new: true,
            returnOriginal: false,
            },
          function(err, result) {
            if (err) res.json({ message: "Database error."})
            else {
              if (result.value) {
                res.json({
                  _id: result.value._id,
                  title: result.value.title,
                  comments: result.value.comments,
                });
              } else {
                //US 8: If I try to request a book that doesn't exist I will get a 'no book exists' message.
                res.json({ message: "no book exists" });
              }
            }
          }
        )
      }
    })
    
    //US 7: I can delete /api/books/{_id} to delete a book from the collection.
    // Returned will be 'delete successful' if successful.
    .delete(function(req, res){
      var bookid = req.params.id;
      if (!ObjectId.isValid(bookid)) {
        res.json({ message: "Invalid book id."});
      } else {
        db.collection('books').deleteOne({_id: ObjectId(bookid)}, function(err, result) {
          if (err) res.json({ message: "Database error." });
           //if successful response will be 'delete successful'
          else if (result.deletedCount === 1) {
            res.json({ message: "delete successful" });
          } else {
            res.json({ message: "delete unsuccessful" });
          }
        })
      }
    });
}