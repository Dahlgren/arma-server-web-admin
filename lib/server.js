var _ = require('lodash')
var events = require('events')
var fs = require('fs')
var Gamedig = require('gamedig')
var slugify = require('slugify')

var ArmaServer = require('arma-server')

var config = require('../config.js')

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

var createServerTitle = function (title) {
  if (config.prefix) {
    title = config.prefix + title
  }

  if (config.suffix) {
    title = title + config.suffix
  }

  return title
}

var Server = function (config, logs, options) {
  this.config = config
  this.logs = logs
  this.update(options)
}

Server.prototype = new events.EventEmitter()

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
      type: queryTypes[config.game],
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
      }

      self.emit('state')
    }
  )
}

Server.prototype.getParameters = function () {
  var parameters = []

  if (config.parameters && Array.isArray(config.parameters)) {
    parameters = parameters.concat(config.parameters)
  }

  if (this.parameters && Array.isArray(this.parameters)) {
    parameters = parameters.concat(this.parameters)
  }

  return parameters
}

Server.prototype.getAdditionalConfigurationOptions = function () {
  var additionalConfigurationOptions = ''

  if (config.additionalConfigurationOptions) {
    additionalConfigurationOptions += config.additionalConfigurationOptions
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

  var parameters = this.getParameters()
  var server = new ArmaServer.Server({
    additionalConfigurationOptions: this.getAdditionalConfigurationOptions(),
    admins: config.admins,
    allowedFilePatching: this.allowed_file_patching || 1,
    battleEye: this.battle_eye ? 1 : 0,
    config: this.id,
    disableVoN: this.von ? 0 : 1,
    game: config.game,
    filePatching: this.file_patching || false,
    forcedDifficulty: this.forcedDifficulty || null,
    headlessClients: this.number_of_headless_clients > 0 ? ['127.0.0.1'] : null,
    hostname: createServerTitle(this.title),
    localClient: this.number_of_headless_clients > 0 ? ['127.0.0.1'] : null,
    missions: this.missions,
    mods: this.mods,
    motd: (this.motd && this.motd.split('\n')) || null,
    parameters: parameters,
    password: this.password,
    passwordAdmin: this.admin_password,
    path: this.config.path,
    persistent: this.persistent ? 1 : 0,
    platform: this.config.type,
    players: this.max_players,
    port: this.port,
    serverMods: config.serverMods,
    verifySignatures: this.verify_signatures ? 2 : 0
  })
  server.writeServerConfig()
  var instance = server.start()
  var self = this

  var logStream = null
  if (this.config.type === 'linux') {
    logStream = fs.createWriteStream(this.logs.generateLogFilePath(), {
      flags: 'a'
    })
  }

  instance.stdout.on('data', function (data) {
    if (logStream) {
      logStream.write(data)
    }
  })

  instance.stderr.on('data', function (data) {
    if (logStream) {
      logStream.write(data)
    }
  })

  instance.on('close', function (code) {
    if (logStream) {
      logStream.end()
    }

    clearInterval(self.queryStatusInterval)
    self.state = null
    self.pid = null
    self.instance = null

    self.stopHeadlessClients()

    self.emit('state')
  })

  instance.on('error', function (err) {
    console.log(err)
  })

  this.pid = instance.pid
  this.instance = instance
  this.queryStatusInterval = setInterval(function () {
    self.queryStatus()
  }, queryInterval)

  this.startHeadlessClients()

  this.emit('state')

  return this
}

Server.prototype.startHeadlessClients = function () {
  var parameters = this.getParameters()
  var self = this
  var headlessClientInstances = _.times(this.number_of_headless_clients, function (i) {
    var headless = new ArmaServer.Headless({
      filePatching: self.file_patching,
      game: config.game,
      host: '127.0.0.1',
      mods: self.mods,
      parameters: parameters,
      password: self.password,
      path: self.config.path,
      platform: self.config.type,
      port: self.port
    })
    var headlessInstance = headless.start()
    var name = 'HC_' + i
    var logPrefix = self.id + ' ' + name
    console.log(logPrefix + ' starting')

    headlessInstance.stdout.on('data', function (data) {
      console.log(logPrefix + ' stdout: ' + data)
    })

    headlessInstance.stderr.on('data', function (data) {
      console.log(logPrefix + ' stderr: ' + data)
    })

    headlessInstance.on('close', function (code) {
      console.log(logPrefix + ' exited: ' + code)

      var elementIndex = headlessClientInstances.indexOf(headlessInstance)
      if (elementIndex !== -1) {
        headlessClientInstances.splice(elementIndex, 1)
      }
    })

    headlessInstance.on('error', function (err) {
      console.log(logPrefix + ' error: ' + err)
    })

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
  this.headlessClientInstances.map(function (headlessClientInstance) {
    headlessClientInstance.kill()
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
