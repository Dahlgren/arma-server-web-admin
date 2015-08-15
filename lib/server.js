var events = require('events');
var gamedig = require('gamedig');
var slug = require('slug');
var spawn = require('child_process').spawn;

var ArmaServer = require('arma-server');

var config = require('../config.js');

var queryInterval = 5000;
var queryTypes = {
  arma1: 'arma',
  arma2: 'arma2',
  arma2oa: 'arma2',
  arma3: 'arma3',
  cwa: 'operationflashpoint',
  ofp: 'operationflashpoint',
  ofpresistance: 'operationflashpoint',
};

var createServerTitle = function(title) {
  if (config.prefix) {
    title = config.prefix + title;
  }

  if (config.suffix) {
    title = title + config.suffix;
  }

  return title;
};

var Server = function (path, type, options) {
  this.path = path;
  this.type = type;
  this.update(options);
};

Server.prototype = new events.EventEmitter();

Server.prototype.update = function (options) {
  this.admin_password = options.admin_password;
  this.battle_eye = options.battle_eye;
  this.headless = options.headless;
  this.max_players = options.max_players;
  this.mods = options.mods || [];
  this.password = options.password;
  this.persistent = options.persistent;
  this.port = options.port || 2302;
  this.title = options.title;
  this.von = options.von;

  this.id = slug(this.title).replace('.', '-');
  this.port = parseInt(this.port, 10); // If port is a string then gamedig fails
};

Server.prototype.queryStatus = function() {
  var self = this;
  Gamedig.query(
    {
      type: queryTypes[config.game],
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
  var server = new ArmaServer.Server({
    battleEye: this.battle_eye ? 1 : 0,
    config: this.id,
    disableVoN: this.von ? 0 : 1,
    game: config.game,
    headlessClients: this.headless ? ["127.0.0.1"] : null,
    hostname: createServerTitle(this.title),
    localClient: this.headless ? ["127.0.0.1"] : null,
    mods: this.mods,
    password: this.password,
    passwordAdmin: this.admin_password,
    path: this.path,
    persistent: this.persistent ? 1 : 0,
    platform: this.type,
    players: this.max_players,
    port: this.port,
  });
  server.writeServerConfig();
  var instance = server.start();
  var self = this;

  instance.stdout.on('data', function (data) {
    console.log(self.id + ': ' + data);
  });

  instance.stderr.on('data', function (data) {
    console.log(self.id + ' err: ' + data);
  });

  instance.on('close', function (code) {
    console.log(self.id + ' exited with code ' + code);
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

  if (this.headless) {
    var headless = new ArmaServer.Headless({
      game: config.game,
      host: "127.0.0.1",
      mods: this.mods,
      password: this.password,
      path: this.path,
      platform: this.type,
      port: this.port,
    });
    var headlessInstance = headless.start();

    headlessInstance.stdout.on('data', function (data) {
      console.log(self.id + ' HC: ' + data);
    });

    headlessInstance.stderr.on('data', function (data) {
      console.log(self.id + ' HC err: ' + data);
    });

    headlessInstance.on('close', function (code) {
      console.log(self.id + ' HC exited with code ' + code);
      self.headlessInstance = null;
    });

    self.headlessInstance = headlessInstance;
  }

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
  if (this.headlessInstance) {
    this.headlessInstance.kill();
  }

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
    headless: this.headless,
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

module.exports = Server;
