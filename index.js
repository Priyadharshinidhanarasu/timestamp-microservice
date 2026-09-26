var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var crypto = require('crypto');

app.use(cors({optionsSuccessStatus: 200}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

let users = [];

app.post("/api/users", function(req, res) {
  let username = req.body.username;
  let _id = crypto.randomBytes(12).toString('hex');
  let newUser = {username: username, _id: _id, log: []};
  users.push(newUser);
  res.json({username: username, _id: _id});
});

app.get("/api/users", function(req, res) {
  let result = users.map(u => ({username: u.username, _id: u._id}));
  res.json(result);
});

app.post("/api/users/:_id/exercises", function(req, res) {
  let id = req.params._id;
  let {description, duration, date} = req.body;
  let user = users.find(u => u._id === id);
  if (!user) return res.json({error: "User not found"});
  
  let exerciseDate = date ? new Date(date) : new Date();
  if (exerciseDate.toString() === "Invalid Date") exerciseDate = new Date();
  
  let exercise = {
    description: description,
    duration: parseInt(duration),
    date: exerciseDate.toDateString()
  };
  
  user.log.push(exercise);
  
  res.json({
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
    _id: user._id
  });
});

app.get("/api/users/:_id/logs", function(req, res) {
  let id = req.params._id;
  let user = users.find(u => u._id === id);
  if (!user) return res.json({error: "User not found"});
  
  let log = [...user.log];
  
  if (req.query.from) {
    let fromDate = new Date(req.query.from);
    log = log.filter(e => new Date(e.date) >= fromDate);
  }
  if (req.query.to) {
    let toDate = new Date(req.query.to);
    log = log.filter(e => new Date(e.date) <= toDate);
  }
  if (req.query.limit) {
    log = log.slice(0, parseInt(req.query.limit));
  }
  
  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log: log
  });
});

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('listening on ' + listener.address().port);
});
