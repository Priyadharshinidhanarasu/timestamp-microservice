var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));
app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/whoami", function(req, res) {
  res.json({
    ipaddress: req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress,
    language: req.headers['accept-language'],
    software: req.headers['user-agent']
  });
});

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('listening on ' + listener.address().port);
});
