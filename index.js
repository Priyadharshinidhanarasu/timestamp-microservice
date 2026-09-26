var express = require('express');
var cors = require('cors');
var multer = require('multer');
var app = express();
var upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});
app.post('/api/fileanalyse', upload.single('upfile'), function(req, res) {
  res.json({ name: req.file.originalname, type: req.file.mimetype, size: req.file.size });
});
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('listening on ' + listener.address().port);
});
