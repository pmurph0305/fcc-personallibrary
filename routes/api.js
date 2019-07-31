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
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    //US 3: I can post a title to /api/books to add a book and returned will be the object with the title and a unique _id.
    .post(function (req, res){
      var title = req.body.title;
      if (!title) {
        res.json({ message: "A book title must be provided."})
      } else {
        //response will contain new book object including atleast _id and title
        db.collection('books').insertOne({
          title: title
        }, function(err, result) {
          if (err) res.json({ message: "Database Error, unable to add a new book." })
          else {
            res.json(result.ops[0]);
          }
        })
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
}