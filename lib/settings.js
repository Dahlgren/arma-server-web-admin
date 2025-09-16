var _ = require('lodash')

var Settings = function (config, logs) {
  this.config = config
  this.logsPath = logs.logsPath()
}

Settings.prototype.getPublicSettings = function () {
  return _.merge({}, _.pick(this.config, ['game', 'path', 'type']), {logsPath: this.logsPath})
}

module.exports = Settings
