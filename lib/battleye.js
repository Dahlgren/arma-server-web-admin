var fs = require('fs')
var path = require('path')

var BattlEye = function (config, server) {
  this.config = config
  this.server = server
}

BattlEye.prototype.configContents = function () {
  var vars = []

  if (this.server.battle_eye_password) {
    vars.push('RConPassword ' + this.server.battle_eye_password)
  }

  if (this.server.battle_eye_port) {
    vars.push('RConPort ' + this.server.battle_eye_port)
  }

  return vars.join('\n')
}

BattlEye.prototype.configPath = function () {
  if (this.config.game === 'arma3_x64') {
    return path.join(this.config.path, 'battleye', 'beserver_x64.cfg')
  }

  return path.join(this.config.path, 'battleye', 'beserver.cfg')
}

BattlEye.prototype.createConfigFile = function (callback) {
  var contents = this.configContents()
  var filePath = this.configPath()

  fs.writeFile(filePath, contents, function (err) {
    if (err) {
      console.error('Failed to write BattlEye config: ' + err)
    }

    callback(err)
  })
}

module.exports = BattlEye
