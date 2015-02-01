var express = require('express');
var Resource = require('express-resource');

var config = require('./config');
var Manager = require('./lib/manager');
var Mods = require('./lib/mods');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

var manager = new Manager(config);
manager.load();
var mods = new Mods(config);

var serversRoutes = require('./routes/servers')(manager, mods);
var modsRoutes = require('./routes/mods')(mods);

app.resource('api/logs', require('./routes/logs'));
app.resource('api/missions', require('./routes/missions'));
app.resource('api/mods', modsRoutes);
var serversResource = app.resource('api/servers', serversRoutes);
app.resource('api/settings', require('./routes/settings'));

app.post('/api/mods/search', modsRoutes.search);
app.get('/api/servers/:server/start', serversRoutes.start);
app.get('/api/servers/:server/stop', serversRoutes.stop);

app.get('/', function (req, res){
  res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
  socket.emit('mods', mods.mods);
  socket.emit('servers', manager.getServers());
});

mods.on('mods', function(mods) {
  io.emit('mods', mods);
});

manager.on('servers', function() {
  io.emit('servers', manager.getServers());
});

server.listen(config.port);
