var fs = require('fs')
var LogPathModule = require('./server-log-paths')
var config = require('../config')
var logger = require('./logger').getLogger('server-log-writer')

var logPaths = new LogPathModule(config)

function logInstance (instance, logFileName) {
  var logStream = fs.createWriteStream(logFileName, {
    'flags': 'a'
  })

  instance.stdout.on('data', function (data) {
    logStream.write(data)
  })

  instance.stderr.on('data', function (data) {
    logStream.write(data)
  })

  instance.on('close', function (code) {
    logStream.end()
  })
}

module.exports.setupFileLog = function (server) {
  var instance = server.instance
  if (!instance) {
    logger.warn('server has no instance, cannot set up logging')
    return
  }

  logInstance(instance, logPaths.generateLogFilePath('server'))
  server.headlessClientInstances.forEach(function (hcInstance, idx) {
    logInstance(hcInstance, logPaths.generateLogFilePath('hc' + idx))
  })
}
