var express = require('express');
var app = express();
var cors = require('cors');
var dns = require('dns');
var bodyParser = require('body-parser');

app.use(cors({optionsSuccessStatus: 200}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

let urls = [];
let id = 1;

app.post("/api/shorturl", function(req, res) {
  let original_url = req.body.url;
  try {
    let urlObj = new URL(original_url);
    dns.lookup(urlObj.hostname, function(err) {
      if (err) {
        res.json({error: 'invalid url'});
      } else {
        let existing = urls.find(u => u.original_url === original_url);
        if (existing) {
          res.json({original_url: existing.original_url, short_url: existing.short_url});
        } else {
          let newUrl = {original_url: original_url, short_url: id++};
          urls.push(newUrl);
          res.json(newUrl);
        }
      }
    });
  } catch(e) {
    res.json({error: 'invalid url'});
  }
});

app.get("/api/shorturl/:short", function(req, res) {
  let short = parseInt(req.params.short);
  let found = urls.find(u => u.short_url === short);
  if (found) {
    res.redirect(found.original_url);
  } else {
    res.json({error: 'No short URL found for the given input'});
  }
});

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('listening on ' + listener.address().port);
});
