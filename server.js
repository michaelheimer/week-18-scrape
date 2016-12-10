/* Scraping into DB (18.2.5)
 * ========================== */

// Initialize Express app
var express = require('express');
var app = express();
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');

app.use('/public',express.static(__dirname + '/public'));
app.use(methodOverride('_method'));


var methodOverride = require('method-override');
var request = require('request');
var cheerio = require('cheerio');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Database configuration

var mongojs = require('mongojs');
var databaseUrl = "localhost";
var collections = ["data"];
console.log("start");
// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});


// Main route (simple Hello World Message)
app.get('/', function(req, res) {
  //res.send("Hello world");
  res.render('index');
});

// Retrieve data from the db
app.get('/all', function(req, res) {
  // find all results from the scraoedData collection in the db
  db.data.find({}, function(err, found) {
    // throw any errors to the console
    if (err) {
      console.log(err);
    } 
    // if there are no errors, send the data to the browser as a json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get('/scrape', function(req, res) {
  console.log("inside scrape");
  // make a request for the news section of ycombinator
  request('http://www.nytimes.com/', function(error, response, html) {
    // load the html body from request into cheerio
    var $ = cheerio.load(html);
    // for each element with a "title" class
    $('.title').each(function(i, element) {
      // save the text of each link enclosed in the current element
      var title = $(this).children('a').text();
      // save the href value of each link enclosed in the current element
      var link = $(this).children('a').attr('href');

      // if this title element had both a title and a link
      if (title && link) {
        // save the data in the scrapedData db
        db.data.save({
          title: title,
          link: link
        }, 
        function(err, saved) {
          // if there's an error during this query
          if (err) {
            // log the error
            console.log(err);
          } 
          // otherwise, 
          else {
            // log the saved data
            console.log(saved);
          }
        });
      }
    });
  });

  // this will send a "search complete" message to the browser
  res.send("Scrape Complete");
});


// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});
