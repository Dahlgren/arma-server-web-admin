var events = require('events')
var fs = require('fs.extra')
var path = require('path')

var Mods = function (config) {
  this.config = config
  this.mods = []
  this.modsPath = config.modsPath ? (path.join(config.path, config.modsPath)) : config.path
}

Mods.prototype = new events.EventEmitter()

Mods.prototype.delete = function (mod, cb) {
  var self = this
  fs.rmrf(path.join(self.modsPath, mod), function (err) {
    cb(err)

    if (!err) {
      self.updateMods()
    }
  })
}

Mods.prototype.updateMods = function () {
  var self = this
  fs.readdir(self.modsPath, function (err, files) {
    if (err) {
      console.log(err)
    } else {
      var mods = files.filter(function (file) {
        return file.charAt(0) === '@'
      }).map(function (name) {
        return {
          name: name
        }
      })

      self.mods = mods
      self.emit('mods', mods)
    }
  })
}

module.exports = Mods
