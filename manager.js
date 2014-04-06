var fs = require('fs'),
    spawn = require('child_process').spawn;

var config = require('./config');
var filePath = "servers.json";

function Server(id, title, port, mods) {
  this.id = id;
  this.title = title;
  this.port = port;
  this.mods = mods;
}

Server.prototype.armaServerPath = function() {
  return config.path + '/arma3server';
}

Server.prototype.makeModsParameter = function() {
  return '-mod=' + this.mods.join(';');
}

Server.prototype.makePortParameter = function() {
  return '-port=' + this.port;
}

Server.prototype.start = function() {
  var mods = this.makeModsParameter();
  var port = this.makePortParameter();

  var server = spawn(this.armaServerPath(), [mods, port, '-config=server.cfg', '-noSound', '-world=empty']);

  server.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  server.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  server.on('close', function (code) {
    console.log('child process exited with code ' + code);
  });
}

function Manager() {
  this.serversArr = [];
  this.serversHash = {};
  this.load();
};

Manager.prototype.addServer = (function (id, title) {
  var server = this._addServer(id, title);
  this.save();
  return server;
});

Manager.prototype._addServer = (function (id, title) {
  mods = [];
  port = 2302;
  var server = new Server(id, title, port, mods)
  this.serversArr.push(server);
  this.serversHash[id] = server;
  return server;
});

Manager.prototype.getServer = (function (id) {
  return this.serversHash[id];
});

Manager.prototype.getServers = (function () {
  return this.serversArr;
});

Manager.prototype.load = (function () {
  var self = this;

  fs.readFile(filePath, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    JSON.parse(data).forEach(function (server) {
      self._addServer(server.id, server.title);
    });
  });
});

Manager.prototype.save = (function () {
  fs.writeFile(filePath, JSON.stringify(this.serversArr), function(err) {
    if(err) throw err;
  });
});

module.exports = Manager;
