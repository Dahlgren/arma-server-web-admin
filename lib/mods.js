var events = require('events')
var fs = require('fs.extra')
var path = require('path')

var Mods = function (config) {
  this.config = config
  this.mods = []
  this.modsPath = this.getAbsoluteModsPath()
}

Mods.prototype = new events.EventEmitter()

Mods.prototype.delete = function (mod, cb) {
  var self = this
  fs.rmrf(self.getAbsoluteModPath(mod), function (err) {
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

Mods.prototype.getAbsoluteModsPath = function () {
  return this.modsPath ? (path.join(this.config.path, this.config.modsPath)) : this.config.path
}

Mods.prototype.getRelativeModPath = function (mod) {
  return this.modsPath ? (path.join(this.config.modsPath, mod)) : mod
}

Mods.prototype.getAbsoluteModPath = function (mod) {
  return path.join(this.getAbsoluteModsPath(), mod)
}

module.exports = Mods
