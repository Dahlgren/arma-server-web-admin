var events = require('events')
var fs = require('fs')

var Server = require('./server')

var filePath = 'servers.json'

var Manager = function (config, logs) {
  this.config = config
  this.logs = logs
  this.serversArr = []
  this.serversHash = {}
  this.maxInstances = config.maxInstances !== undefined ? config.maxInstances : Infinity
}

Manager.prototype = new events.EventEmitter()

Manager.prototype.addServer = function (options) {
  var server = this._addServer(options)
  this.save()
  return server
}

Manager.prototype.removeServer = function (id) {
  var server = this.serversHash[id]

  if (!server) {
    return {}
  }

  var index = this.serversArr.indexOf(server)
  if (index > -1) {
    this.serversArr.splice(index, 1)
  }
  this.save()

  if (server.pid) {
    server.stop()
  }

  return server
}

Manager.prototype._addServer = function (data) {
  var server = new Server(this.config, this.logs, data)
  this.serversArr.push(server)
  this.serversArr.sort(function (a, b) {
    return a.title.localeCompare(b.title)
  })
  this.serversHash[server.id] = server

  var self = this
  var statusChanged = function () {
    self.emit('servers')
  }
  server.on('state', statusChanged)

  return server
}

Manager.prototype.getServer = function (id) {
  return this.serversHash[id]
}

Manager.prototype.getServers = function () {
  return this.serversArr
}

Manager.prototype.getNumberOfRunningInstances = function () {
  return this.serversArr.reduce(
    function (aggregation, server) {
      return aggregation + server.headlessClientInstances.length + (server.instance ? 1 : 0)
    },
    0
  )
}

Manager.prototype.load = function () {
  var self = this

  fs.readFile(filePath, function (err, data) {
    if (err) {
      console.log('Could not load any existing servers configuration, starting fresh')
      return
    }

    try {
      JSON.parse(data).forEach(function (server) {
        self._addServer(server)
      })
    } catch (e) {
      console.error('Manager load error: ' + e)
    }

    self.getServers()
      .filter(function (server) {
        return server.auto_start
      })
      .map(function (server) {
        var result = self.start(server)
        if (result.statusCode > 200) {
          console.warn('could not start server ' + server.id + ': ' + result.status)
        }
      })
  })
}

Manager.prototype.start = function (server) {
  var runningInstances = this.getNumberOfRunningInstances()
  var requiredInstances = 1 + (server.number_of_headless_clients || 0)

  if (runningInstances + requiredInstances <= this.maxInstances) {
    server.start()
    return {statusCode: 200, status: 'ok', pid: server.pid}
  } else {
    return {
      statusCode: 409,
      status: 'Too many instances',
      message:
      'Starting this server would require ' + requiredInstances + ' more game instances. ' +
      'Currently, ' + runningInstances + ' are already running of the maximum number of ' + this.maxInstances + '.'
    }
  }
}

Manager.prototype.save = function () {
  var data = []
  var self = this

  this.serversArr.sort(function (a, b) {
    return a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  })

  this.serversHash = {}
  this.serversArr.forEach(function (server) {
    data.push({
      additionalConfigurationOptions: server.additionalConfigurationOptions,
      admin_password: server.admin_password,
      allowed_file_patching: server.allowed_file_patching,
      auto_start: server.auto_start,
      battle_eye: server.battle_eye,
      file_patching: server.file_patching,
      forcedDifficulty: server.forcedDifficulty,
      max_players: server.max_players,
      missions: server.missions,
      mods: server.mods,
      motd: server.motd,
      number_of_headless_clients: server.number_of_headless_clients,
      parameters: server.parameters,
      password: server.password,
      persistent: server.persistent,
      port: server.port,
      title: server.title,
      von: server.von,
      verify_signatures: server.verify_signatures
    })

    self.serversHash[server.id] = server
  })

  fs.writeFile(filePath, JSON.stringify(data), function (err) {
    if (err) {
      throw err
    } else {
      self.emit('servers')
    }
  })
}

module.exports = Manager
