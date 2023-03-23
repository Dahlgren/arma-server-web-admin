var _ = require('lodash')

var Settings = function (config, logs) {
  this.config = config
  this.config.logsPath = logs.logsPath()
}

Settings.prototype.getPublicSettings = function () {
  return _.pick(this.config, ['game', 'path', 'logsPath', 'type'])
}

module.exports = Settings
