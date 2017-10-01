var bunyan = require('bunyan')
var config = require('../config')

var loggers = {}

function createLogger (name) {
  var bunyanLoggerConfig = (config.bunyanConfig && (config.bunyanConfig[name] || config.bunyanConfig['default'])) || {}
  bunyanLoggerConfig.name = name

  return bunyan.createLogger(name)
}

module.exports.getLogger = function (name) {
  if (!loggers[name]) {
    loggers[name] = createLogger(name)
  }

  return loggers[name]
}
