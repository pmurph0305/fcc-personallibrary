'use strict';
require('dotenv').config();
var express     = require('express');
var bodyParser  = require('body-parser');
var cors        = require('cors');
var MongoClient = require('mongodb').MongoClient;
var helmet = require('helmet');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//US 1: Nothing from my website will be cached in my client as a security measure.
app.use(helmet.noCache());
//US 2: I will see that the site is powered by 'PHP 4.2.0' even though it isn't as a security measure.
app.use(helmet.hidePoweredBy({ setTo: "PHP 4.2.0" }));

MongoClient.connect(process.env.DB, { useNewUrlParser: true }, (err, client) => {
  if (err) console.log("DB Error: "+ err);
  else {
    console.log("Database connected");
    let db = client.db("personallibrary");

    //Index page (static HTML)
    app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/index.html');
    });

    //For FCC testing purposes
    fccTestingRoutes(app);

    //Routing for API 
    apiRoutes(app, db);  
      
    //404 Not Found Middleware
    app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
    });

    //Start our server and tests!
    app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port " + (process.env.PORT || 3000));
    if(process.env.NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch(e) {
          var error = e;
            console.log('Tests are not valid:');
            console.log(error);
        }
      }, 1500);
    }
    });
  }
})



module.exports = app; //for unit/functional testing
