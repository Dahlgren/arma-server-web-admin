var express = require('express'),
    fs = require('fs');

var config = require('./config'),
    servers = require('./servers');

var app = express();

app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

app.get('/api/missions', function (req, res){
  var path = config.path + '/mpmissions';
  fs.readdir(path, function (err, files) {
    if (err) {
      res.send(err);
    } else {
      res.send(files);
    }
  });
});

app.get('/api/mods', function (req, res){
  fs.readdir(config.path, function (err, files) {
    if (err) {
      res.send(err);
    } else {
      var mods = files.filter(function (file) {
        return file.charAt(0) == "@";
      }).map(function (mod) {
        return { name: mod }
      });
      res.send(mods);
    }
  });
});

app.get('/api/servers', function (req, res){
  res.send(servers);
});

app.get('/api/settings', function (req, res){
  res.send(config);
});

app.get('/*', function (req, res){
  res.sendfile(__dirname + '/public/index.html');
});

app.listen(3000);
