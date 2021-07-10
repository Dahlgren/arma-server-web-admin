var _ = require('lodash')
var events = require('events')
var Gamedig = require('gamedig')
var slugify = require('slugify')

var ArmaServer = require('arma-server')

var virtualServer = require('./virtualServer')

var queryInterval = 5000
var queryTypes = {
  arma1: 'arma',
  arma2: 'arma2',
  arma2oa: 'arma2',
  arma3: 'arma3',
  arma3_x64: 'arma3',
  cwa: 'operationflashpoint',
  ofp: 'operationflashpoint',
  ofpresistance: 'operationflashpoint'
}

var Server = function (config, logs, mods, options) {
  this.config = config
  this.logs = logs
  this.modsManager = mods
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
  this.additionalConfigurationOptions = options.additionalConfigurationOptions
  this.admin_password = options.admin_password
  this.allowed_file_patching = options.allowed_file_patching
  this.auto_start = options.auto_start
  this.battle_eye = options.battle_eye
  this.file_patching = options.file_patching
  this.forcedDifficulty = options.forcedDifficulty || null
  this.max_players = options.max_players
  this.missions = options.missions
  this.mods = options.mods || []
  this.motd = options.motd || null
  this.number_of_headless_clients = options.number_of_headless_clients || 0
  this.password = options.password
  this.parameters = options.parameters
  this.persistent = options.persistent
  this.port = options.port || 2302
  this.title = options.title
  this.von = options.von
  this.verify_signatures = options.verify_signatures

  this.id = this.generateId()
  this.port = parseInt(this.port, 10) // If port is a string then gamedig fails
}

Server.prototype.queryStatus = function () {
  if (!this.instance) {
    return
  }

  var self = this
  Gamedig.query(
    {
      type: queryTypes[this.config.game],
      host: '127.0.0.1',
      port: self.port
    },
    function (state) {
      if (!self.instance) {
        return
      }

      if (state.error) {
        self.state = null
      } else {
        self.state = state
        self.startHeadlessClientsIfNeeded()
      }

      self.emit('state')
    }
  )
}

Server.prototype.getMods = function () {
  var self = this
  return this.mods.map(function (mod) {
    return self.modsManager.find(mod)
  }).filter(function (mod) {
    return mod
  }).map(function (mod) {
    if (self.config.type === 'linux' && self.config.steam && self.config.steam.path) {
      return mod.path.replace(self.config.steam.path, 'workshop/')
    }

    return mod.path
  })
}

Server.prototype.getParameters = function () {
  var parameters = []

  if (this.config.parameters && Array.isArray(this.config.parameters)) {
    parameters = parameters.concat(this.config.parameters)
  }

  if (this.parameters && Array.isArray(this.parameters)) {
    parameters = parameters.concat(this.parameters)
  }

  return parameters
}

Server.prototype.getAdditionalConfigurationOptions = function () {
  var additionalConfigurationOptions = ''

  if (this.config.additionalConfigurationOptions) {
    additionalConfigurationOptions += this.config.additionalConfigurationOptions
  }

  if (this.additionalConfigurationOptions) {
    if (additionalConfigurationOptions) {
      additionalConfigurationOptions += '\n'
    }

    additionalConfigurationOptions += this.additionalConfigurationOptions
  }

  return additionalConfigurationOptions
}

Server.prototype.start = function () {
  if (this.instance) {
    return this
  }

  var self = this

  if (self.config.virtualServer && self.config.virtualServer.enabled) {
    virtualServer.create(self.config, self.mods)
      .then((serverFolder) => {
        self.virtualServerFolder = serverFolder
        self.path = serverFolder
        self.realStart()
      })
      .catch((err) => {
        console.error('Error creating virtual server folder:', err)
      })
  } else {
    self.path = self.config.path
    self.realStart()
  }
}

Server.prototype.realStart = function () {
  if (this.instance) {
    return this
  }

  var mods = this.getMods()
  var parameters = this.getParameters()
  var server = new ArmaServer.Server({
    additionalConfigurationOptions: this.getAdditionalConfigurationOptions(),
    admins: this.config.admins,
    allowedFilePatching: this.allowed_file_patching || 1,
    battleEye: this.battle_eye ? 1 : 0,
    config: this.id,
    disableVoN: this.von ? 0 : 1,
    game: this.config.game,
    filePatching: this.file_patching || false,
    forcedDifficulty: this.forcedDifficulty || null,
    headlessClients: this.number_of_headless_clients > 0 ? ['127.0.0.1'] : null,
    hostname: this.createServerTitle(this.title),
    localClient: this.number_of_headless_clients > 0 ? ['127.0.0.1'] : null,
    missions: this.missions,
    mods: mods,
    motd: (this.motd && this.motd.split('\n')) || null,
    parameters: parameters,
    password: this.password,
    passwordAdmin: this.admin_password,
    path: this.path,
    persistent: this.persistent ? 1 : 0,
    platform: this.config.type,
    players: this.max_players,
    port: this.port,
    serverMods: this.config.serverMods,
    verifySignatures: this.verify_signatures ? 2 : 0
  })
  server.writeServerConfig()
  var instance = server.start()
  var self = this

  instance.on('close', function (code) {
    clearInterval(self.queryStatusInterval)
    self.state = null
    self.pid = null
    self.instance = null

    self.stopHeadlessClients()
      .then(() => {
        if (self.virtualServerFolder) {
          virtualServer.remove(self.virtualServerFolder)
          self.virtualServerFolder = null
        }
        self.emit('state')
      })
  })

  this.pid = instance.pid
  this.instance = instance
  this.headlessClientInstances = []
  this.queryStatusInterval = setInterval(function () {
    self.queryStatus()
  }, queryInterval)

  this.logs.logServerProcess(this.instance, this.id, 'server')
  this.logs.cleanupOldLogFiles()

  this.emit('state')

  return this
}

Server.prototype.startHeadlessClientsIfNeeded = function () {
  if (this.number_of_headless_clients > 0 && this.headlessClientInstances.length === 0) {
    this.startHeadlessClients()
  }
}

Server.prototype.startHeadlessClients = function () {
  var mods = this.getMods()
  var parameters = this.getParameters()
  var self = this
  var headlessClientInstances = _.times(this.number_of_headless_clients, function (i) {
    var headless = new ArmaServer.Headless({
      filePatching: self.file_patching,
      game: self.config.game,
      host: '127.0.0.1',
      mods: mods,
      parameters: parameters,
      password: self.password,
      path: self.path,
      platform: self.config.type,
      port: self.port
    })
    var headlessInstance = headless.start()
    self.logs.logServerProcess(headlessInstance, self.id, 'hc_' + (i + 1))
    return headlessInstance
  })

  this.headlessClientInstances = headlessClientInstances
}

Server.prototype.stop = function (cb) {
  var handled = false

  this.instance.on('close', function (code) {
    if (!handled) {
      handled = true

      if (cb) {
        cb()
      }
    }
  })

  this.instance.kill()

  setTimeout(function () {
    if (!handled) {
      handled = true

      if (cb) {
        cb()
      }
    }
  }, 5000)

  return this
}

Server.prototype.stopHeadlessClients = function () {
  var self = this
  return Promise.all(this.headlessClientInstances.map(function (headlessClientInstance) {
    var handled = false
    return new Promise(function (resolve, reject) {
      headlessClientInstance.on('close', function () {
        if (!handled) {
          handled = true
          resolve()
        }
      })

      setTimeout(function () {
        if (!handled) {
          handled = true
          resolve()
        }
      }, 5000)

      headlessClientInstance.kill()
    })
  })).then(function () {
    self.headlessClientInstances = []
  })
}

Server.prototype.toJSON = function () {
  return {
    additionalConfigurationOptions: this.additionalConfigurationOptions,
    admin_password: this.admin_password,
    allowed_file_patching: this.allowed_file_patching,
    auto_start: this.auto_start,
    battle_eye: this.battle_eye,
    id: this.id,
    file_patching: this.file_patching,
    forcedDifficulty: this.forcedDifficulty,
    max_players: this.max_players,
    missions: this.missions,
    motd: this.motd,
    mods: this.mods,
    number_of_headless_clients: this.number_of_headless_clients,
    parameters: this.parameters,
    password: this.password,
    persistent: this.persistent,
    pid: this.pid,
    port: this.port,
    state: this.state,
    title: this.title,
    von: this.von,
    verify_signatures: this.verify_signatures
  }
}

module.exports = Server
