var events = require('events');
var fs = require('fs');
var gamedig = require('gamedig');
var spawn = require('child_process').spawn;

var config = require('./config');
var filePath = "servers.json";
var queryInterval = 10000;

var Server = function (id, title, port, mods) {
  this.id = id;
  this.title = title;
  this.port = port;
  this.mods = mods;
};

Server.prototype = new events.EventEmitter();

Server.prototype.armaServerPath = function() {
  if (config.type === "linux") {
    return config.path + '/arma3server';
  }

  return config.path + '/arma3server.exe';
};

Server.prototype.makeModsParameter = function() {
  var mods = this.mods;

  ["@a3mp", "@a3mp_ap", "@agm"].forEach(function (modToMoveLast) {
    if (mods.indexOf(modToMoveLast) > -1) {
      mods = mods.filter(function (mod) {
        return mod != modToMoveLast;
      });
      mods.push(modToMoveLast);
    }
  });

  return '-mod=' + mods.join(';');
};

Server.prototype.makePortParameter = function() {
  return '-port=' + this.port;
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
  var startParams = [];
  var gamePath = this.armaServerPath();
  var options = null;

  if (config.type === "linux") {
    options = {
      cwd: config.path,
      env: process.env,
    };
  }

  if (config.type === "wine") {
    gamePath = "wine";
    startParams.push(this.armaServerPath());
  }

  startParams.push(this.makePortParameter());
  startParams.push('-config=server.cfg');
  startParams.push('-noSound');
  startParams.push('-world=empty');

  if (this.mods.length) {
    startParams.push(this.makeModsParameter());
  }

  console.log(gamePath);
  console.log(startParams);

  var instance = spawn(gamePath, startParams, options);
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
    id: this.id,
    title: this.title,
    port: this.port,
    mods: this.mods,
    pid: this.pid,
    state: this.state,
  };
};

var Manager = function () {
  this.serversArr = [];
  this.serversHash = {};
};

Manager.prototype = new events.EventEmitter();

Manager.prototype.addServer = (function (id, title) {
  mods = [];
  port = 2302;
  var server = this._addServer(id, title, port, mods);
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
  delete this.serversHash[id];
  this.save();

  if (server.pid) {
    server.stop();
  }

  return server;
});

Manager.prototype._addServer = (function (id, title, port, mods) {
  var server = new Server(id, title, port, mods);
  this.serversArr.push(server);
  this.serversHash[id] = server;

  this.serversArr.sort(function(a, b) {
    return a.title.localeCompare(b.title);
  });

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
        self._addServer(server.id, server.title, server.port, server.mods);
      });
    } catch(e) {
        console.error("Manager load error: " + e);
    }
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
    });
  });

  var self = this;

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
