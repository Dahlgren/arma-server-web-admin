var childProcess = require('child_process')
var events = require('events')
var fs = require('fs.extra')
var Gamedig = require('gamedig')
var path = require('path')
var slugify = require('slugify')

var queryInterval = 5000

var Server = function (config, logs, options) {
  this.config = config
  this.logs = logs
  this.update(options)
}

Server.prototype = new events.EventEmitter()

Server.prototype.createServerTitle = function (title) {
  if (this.config.prefix) {
    title = this.config.prefix + title
  }

  if (this.config.suffix) {
    title = title + this.config.suffix
  }

  return title
}

Server.prototype.generateId = function () {
  return slugify(this.title).replace(/\./g, '-')
}

Server.prototype.update = function (options) {
  this.admin_password = options.admin_password
  this.auto_start = options.auto_start
  this.battle_eye = options.battle_eye
  this.max_players = options.max_players
  this.missions = options.missions
  this.mods = options.mods || []
  this.password = options.password
  this.port = options.port || 2001
  this.title = options.title

  this.id = this.generateId()
  this.port = parseInt(this.port, 10) // If port is a string then gamedig fails
}

Server.prototype.steamQueryPort = function () {
  return 10000 + this.port
}

Server.prototype.queryStatus = function () {
  if (!this.instance) {
    return
  }

  var self = this
  Gamedig.query(
    {
      type: 'arma3',
      host: '127.0.0.1',
      port: self.steamQueryPort() - 1
    },
    function (state) {
      if (!self.instance) {
        return
      }

      if (state.error) {
        self.state = null
      } else {
        self.state = state
      }

      self.emit('state')
    }
  )
}

Server.prototype.makeServerConfig = function () {
  var scenarioId = '{59AD59368755F41A}Missions/21_GM_Eden.conf'

  if (this.missions && this.missions.length > 0) {
    scenarioId = this.missions[0].name
  }

  return {
    bindAddress: '',
    bindPort: this.port,
    publicAddress: '',
    publicPort: this.port,
    a2s: {
      address: '127.0.0.1',
      port: this.steamQueryPort()
    },
    game: {
      name: this.createServerTitle(this.title),
      password: this.password,
      passwordAdmin: this.admin_password,
      scenarioId: scenarioId,
      maxPlayers: parseInt(this.max_players, 10),
      visible: true,
      crossPlatform: true,
      gameProperties: {
        serverMaxViewDistance: 2500,
        serverMinGrassDistance: 50,
        networkViewDistance: 1000,
        disableThirdPerson: true,
        fastValidation: true,
        battlEye: this.battle_eye
      },
      mods: this.mods.map(function (mod) {
        return {
          modId: mod
        }
      })
    }
  }
}

Server.prototype.serverConfigDirectory = function () {
  return this.config.reforger.configs
}

Server.prototype.serverConfigFile = function () {
  return path.join(this.serverConfigDirectory(), this.generateId() + '.json')
}

Server.prototype.saveServerConfig = function (config, cb) {
  var self = this
  fs.mkdirp(self.serverConfigDirectory(), function (err) {
    if (err) {
      return cb(err)
    }

    fs.writeFile(self.serverConfigFile(), JSON.stringify(config), cb)
  })
}

Server.prototype.serverBinary = function () {
  return path.join(this.config.path, 'ArmaReforgerServer')
}

Server.prototype.serverArguments = function () {
  var self = this
  var id = self.generateId()
  return [
    '-addonsDir',
    this.config.reforger.workshop,
    '-addonDownloadDir',
    this.config.reforger.workshop,
    '-config',
    this.serverConfigFile(),
    '-logsDir',
    path.join(this.config.reforger.logs, id),
    '-profile',
    path.join(this.config.reforger.profiles, id)
  ].map(function (argument) {
    if (self.config.type === 'windows') {
      return argument.replace(/\//g, '\\')
    }

    return argument
  })
}

Server.prototype.start = function () {
  if (this.instance) {
    return this
  }

  var self = this
  var config = self.makeServerConfig()
  self.saveServerConfig(config, function (err) {
    if (err) {
      console.log(err)
      return
    }

    var instance = childProcess.spawn(self.serverBinary(), self.serverArguments(), { cwd: self.config.path })

    instance.on('error', function (err) {
      console.error('Failed to start server', self.title, err)
    })

    instance.on('close', function (code) {
      clearInterval(self.queryStatusInterval)
      self.state = null
      self.pid = null
      self.instance = null

      self.emit('state')
    })

    self.pid = instance.pid
    self.instance = instance
    self.headlessClientInstances = []
    self.queryStatusInterval = setInterval(function () {
      self.queryStatus()
    }, queryInterval)

    self.emit('state')
  })

  return this
}

Server.prototype.stop = function (cb) {
  var handled = false

  var finalHandler = function () {
    if (!handled) {
      handled = true

      if (cb) {
        cb()
      }
    }
  }

  this.instance.on('close', finalHandler)

  this.instance.kill()

  setTimeout(finalHandler, 5000)

  return this
}

Server.prototype.toJSON = function () {
  return {
    admin_password: this.admin_password,
    auto_start: this.auto_start,
    battle_eye: this.battle_eye,
    id: this.id,
    max_players: this.max_players,
    missions: this.missions,
    mods: this.mods,
    password: this.password,
    pid: this.pid,
    port: this.port,
    state: this.state,
    title: this.title
  }
}

module.exports = Server
