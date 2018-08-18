var _ = require('lodash')

var Settings = function (config) {
  this.config = config
}

Settings.prototype.getPublicSettings = function () {
  return _.pick(this.config, ['game', 'path', 'type'])
}

module.exports = Settings
