
var express = require('express');
var app = express();
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');

app.use('/public',express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

var methodOverride = require('method-override');
var request = require('request');
var cheerio = require('cheerio');


pageURL = 'http://staging.laughfactory.com/jokes/joke-of-the-day';
pageURL2 ='https://www.buzzfeed.com/expresident/best-cat-pictures?utm_term=.tu4QeMnY1Z#.rleeY2Vy5n';
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
  res.render('index');
});


 app.get('/jokes', function(req,res){
  
     var jokeArray2 = [];

    request(pageURL, function(error, response, html){        
         
        
          var jokeObject = {
            jokeArray : []
          };
        
          var $ = cheerio.load(html);

           $(".jokes").each(function(i, element) 
           {
            jokeArray2[0] = "Joke of the Day";
            var joke2 = $(element).find("p").first();
            jokeObject.jokeArray.push(joke2.text().trim());
            jokeArray2.push(joke2.text());
           });
           db.data.save({
              jokeArray2 : jokeArray2
           });
          res.render('jokes',jokeObject);
    }); 
});

 app.get('/cats', function(req,res){  // TODO

  console.log('inside cats');
  function strartScrape2()
  {
    request(pageURL2, function(error, response, html){

      var $ = cheerio.load(html);
      var $catPic = ('.thumbs');
      var link = $($catPic).children().attr("href");
      console.log(link + "links");
      res.send("hello");

    });
  }
      strartScrape2();

 })

app.listen(3000, function() {
  console.log('App running on port 3000!');
});
