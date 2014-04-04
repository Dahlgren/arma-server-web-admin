var express = require('express'),
    Resource = require('express-resource');

var config = require('./config');

var app = express();

app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

app.resource('api/missions', require('./routes/missions'));
app.resource('api/mods', require('./routes/mods'));
app.resource('api/servers', require('./routes/servers'));
app.resource('api/settings', require('./routes/settings'));

app.get('/api/servers/:id/start', function (req, res){
  manager.runServer();
  res.send({status:"ok"});
});

app.get('/', function (req, res){
  res.sendfile(__dirname + '/public/index.html');
});

app.listen(3000);
