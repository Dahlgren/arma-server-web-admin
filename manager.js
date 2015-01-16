var events = require('events');
var fs = require('fs');
var gamedig = require('gamedig');
var slug = require('slug');
var spawn = require('child_process').spawn;

var ArmaServer = require('arma-server');

var config = require('./config');
var filePath = "servers.json";
var queryInterval = 5000;

var Server = function (options) {
  this.update(options);
};

Server.prototype = new events.EventEmitter();

Server.prototype.update = function (options) {
  this.admin_password = options.admin_password;
  this.battle_eye = options.battle_eye;
  this.max_players = options.max_players;
  this.mods = options.mods;
  this.password = options.password;
  this.persistent = options.persistent;
  this.title = options.title;
  this.von = options.von;

  this.id = slug(this.title).replace('.', '-');
  this.port = 2302;
};

Server.prototype.queryStatus = function() {
  var self = this;
  Gamedig.query(
    {
      type: 'arma3',
      host: '127.0.0.1',
      port: self.port,
    },
    function(state) {
      if(state.error) {
        self.state = null;
      } else {
        self.state = state;
      }

      self.emit('state');
    }
  );
};

Server.prototype.start = function() {
  var server = new ArmaServer({
    battleEye: this.battle_eye ? 1 : 0,
    config: this.id,
    disableVoN: this.von ? 0 : 1,
    hostname: this.title,
    mods: this.mods,
    password: this.password,
    passwordAdmin: this.admin_password,
    path: config.path,
    persistent: this.persistent ? 1 : 0,
    platform: config.type,
    players: this.max_players,
    port: this.port,
  });
  server.writeServerConfig();
  var instance = server.start();
  var self = this;

  instance.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  instance.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  instance.on('close', function (code) {
    console.log('child process exited with code ' + code);
    clearInterval(self.queryStatusInterval);
    self.state = null;
    self.pid = null;
    self.instance = null;

    self.emit('state');
  });

  this.pid = instance.pid;
  this.instance = instance;
  this.queryStatusInterval = setInterval(function () {
    self.queryStatus();
  }, queryInterval);

  this.emit('state');

  return this;
};

Server.prototype.stop = function(cb) {
  var handled = false;
  var self = this;

  this.instance.on('close', function (code) {
    if (!handled) {
      handled = true;

      if (cb) {
        cb();
      }
    }
  });

  this.instance.kill();

  setTimeout(function() {
    if (!handled) {
      handled = true;

      if (cb) {
        cb();
      }
    }
  }, 5000);

  return this;
};

Server.prototype.toJSON = function () {
  return {
    admin_password: this.admin_password,
    battle_eye: this.battle_eye,
    id: this.id,
    max_players: this.max_players,
    mods: this.mods,
    password: this.password,
    persistent: this.persistent,
    pid: this.pid,
    port: this.port,
    state: this.state,
    title: this.title,
    von: this.von,
  };
};

var Manager = function () {
  this.serversArr = [];
  this.serversHash = {};
};

Manager.prototype = new events.EventEmitter();

Manager.prototype.addServer = (function (options) {
  var server = this._addServer(options);
  this.save();
  return server;
});

Manager.prototype.removeServer = (function (id) {
  var server = this.serversHash[id];

  if (!server) {
    return {};
  }

  var index = this.serversArr.indexOf(server);
  if (index > -1) {
    this.serversArr.splice(index, 1);
  }
  this.save();

  if (server.pid) {
    server.stop();
  }

  return server;
});

Manager.prototype._addServer = (function (data) {
  var server = new Server(data);
  this.serversArr.push(server);
  this.serversArr.sort(function(a, b) {
    return a.title.localeCompare(b.title);
  });
  this.serversHash[server.id] = server;

  var self = this;
  var statusChanged = function () {
    self.emit('servers');
  };
  server.on('state', statusChanged);

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

    try {
      JSON.parse(data).forEach(function (server) {
        self._addServer(server);
      });
    } catch(e) {
        console.error("Manager load error: " + e);
    }
  });
});

Manager.prototype.save = (function () {
  var data = [];
  var self = this;

  this.serversHash = {};
  this.serversArr.forEach(function (server) {
    data.push({
      admin_password: server.admin_password,
      battle_eye: server.battle_eye,
      max_players: server.max_players,
      mods: server.mods,
      password: server.password,
      persistent: server.persistent,
      port: server.port,
      title: server.title,
      von: server.von,
    });

    self.serversHash[server.id] = server;
  });

  fs.writeFile(filePath, JSON.stringify(data), function(err) {
    if (err) {
      throw err;
    } else {
      self.emit('servers');
    }
  });
});

var manager = new Manager();
manager.load();

module.exports = manager;
