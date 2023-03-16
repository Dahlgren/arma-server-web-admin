var _ = require('lodash')

var Settings = function (config, logs) {
  this.config = config
  this.config.logpath = logs.logsPath()
}

Settings.prototype.getPublicSettings = function () {
  return _.pick(this.config, ['game', 'path', 'logpath', 'type'])
}

module.exports = Settings
