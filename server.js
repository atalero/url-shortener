var urlValidator = /[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors()); 

//connnect to the database
mongoose.connect('mongodb://atalero:shortener@ds241895.mlab.com:41895/url_shortener_microservice');
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

function addToDB(url, response){
   if(!urlValidator.test(url)){
        var data = {error: 'That is  an invalid URL'}
        return response.send(data);
      } else {

       var data = new shortUrl({
          url: url, 
          shortenedUrl: Math.floor(Math.random()*10000).toString()
       });

       response.send(data); 

       data.save(err => {

         if(err)response.send('error saving to the database')

       }); 
    }
}

app.get("/new/:url", function (request, response) {
  //ES 5 is var url = request.params.url; 
  var {url} = request.params; 
  if (url === 'favicon.ico') return; //I have no idea why I get a  get request from Glitch with this string every time I edit the code 
  
  shortUrl.findOne({"url": new RegExp('((http|https):\/\/)?' + url + '$',"i")}, (err, data) =>{
    if(data){
      response.send(data);
    } else{
      console.log("that record did not already exist");
      addToDB(url, response);
    }
  });
});

app.get('/:forwardTo', (req,res) => {
  var short = req.params.forwardTo;
  shortUrl.findOne({'shortenedUrl': short}, (err, data) =>{
    if(err) return res.send('error reading database');
    /^(http|https):\/\//.test(data.url)?res.redirect(301, data.url):res.redirect(301, 'http://' + data.url);
  });
    
});

// listen for requests :)
//process.env.PORT gets the port number associated with glitch
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
 