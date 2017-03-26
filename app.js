var express = require('express');
var basicAuth = require('express-basic-auth')
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var serveStatic = require('serve-static')

var config = require('./config');
var Manager = require('./lib/manager');
var Missions = require('./lib/missions');
var Mods = require('./lib/mods');
var SteamMods = require('./lib/steam_mods');
var Logs = require('./lib/logs');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

if (config.auth && config.auth.username && config.auth.password) {
  var basicAuthUsers = {}
  basicAuthUsers[config.auth.username] = config.auth.password;
  app.use(basicAuth({
    challenge: true,
    users: basicAuthUsers
  }));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(serveStatic(path.join(__dirname, 'public')));

var logs = new Logs(config);

var missions = new Missions(config);
var mods = new SteamMods(config);
mods.updateMods();

var manager = new Manager(config, logs, mods);
manager.load();

app.use('/api/logs', require('./routes/logs')(logs));
app.use('/api/missions', require('./routes/missions')(missions));
app.use('/api/mods', require('./routes/mods')(mods));
app.use('/api/servers', require('./routes/servers')(manager, mods));
app.use('/api/settings', require('./routes/settings')(config));

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

server.listen(config.port,config.host);
