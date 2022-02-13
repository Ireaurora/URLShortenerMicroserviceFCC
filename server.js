require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
//It works with this package but FCC doesn't accept this solution and wants a regex solution instead
var validUrl = require('valid-url');

const app = express();

const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true});

const urlSchema = new Schema({
  original_url: String,
  short_url: Number
});

let URL = mongoose.model('URL', urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({
  extended: true
})); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })) 


// - You should provide your own project, not the example URL.
// - You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
// - When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
// - If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res)=> {

let httpAndhttpsRegex = /^(http|https)(:\/\/)/;
//while this solution works and makes use of a package following the "don't reinvent the wheel" programming paradigm it is not accepted as a solution hence the use of regex below 

// if (validUrl.isWebUri(req.body.url) == undefined && !validUrl.isUri(req.body.url)){
//     return  res.json({ error: 'invalid url' });

if(!httpAndhttpsRegex.test(req.body.url)){
  return res.json({ error: 'invalid url' });
}else {
    let url = new URL({
        _id: new mongoose.Types.ObjectId(),
        original_url: req.body.url,
        short_url: Math.floor(1000 + Math.random() * 9000)
      });

      url.save((err, data) => {
        if(err) console.log('this is err ', err);
      res.json({ original_url : data.original_url, short_url : data.short_url})
      }); 
}
}); 

app.get('/api/shorturl/:short?', (req, res)=>{
  let short =  req.params.short;
    URL.findOne({short_url: short}, (err, data) => {
      if(err) console.log(err);
      res.redirect(data.original_url);
    }); 
});



// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:short_url?', (req, res) => {

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
