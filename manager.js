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

  var process = spawn(this.armaServerPath(), [mods, port, '-config=server.cfg', '-noSound', '-world=empty']);
  var self = this;

  process.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  process.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  process.on('close', function (code) {
    console.log('child process exited with code ' + code);
    self.pid = null;
    self.process = null;
  });

  this.pid = process.pid;
  this.process = process;

  return this;
}

Server.prototype.stop = function(cb) {
  var handled = false;

  this.process.on('close', function (code) {
    if (!handled) {
      handled = true;
      cb();
    }
  });

  this.process.kill();

  setTimeout(function() {
    if (!handled) {
      handled = true;
      cb();
    }
  }, 5000);

  return this;
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
  var data = [];

  this.serversArr.forEach(function (server) {
    data.push({
      id: server.id,
      title: server.title,
      port: server.port,
      mods: server.mods,
    })
  });

  fs.writeFile(filePath, JSON.stringify(data), function(err) {
    if(err) throw err;
  });
});

module.exports = Manager;
