var events = require('events')
var fs = require('fs.extra')
var glob = require('glob')
var path = require('path')

var Mods = function (config) {
  this.config = config
  this.mods = []
}

Mods.prototype = Object.create(events.EventEmitter.prototype)

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
  glob('**/{@*,gm,vn}/addons', { cwd: self.getAbsoluteModsPath() }, function (err, files) {
    if (err) {
      console.log(err)
    } else {
      var mods = files.map(function (file) {
        return {
          // Find actual parent mod folder from addons folder
          name: path.join(file, '..')
        }
      })

      self.mods = mods
      self.emit('mods', mods)
    }
  })
}

Mods.prototype.getAbsoluteModsPath = function () {
  if (this.config.modsPath) {
    if (path.isAbsolute(this.config.modsPath)) {
      return this.config.modsPath
    }
    return path.join(this.config.path, this.config.modsPath)
  }
  return this.config.path
}

Mods.prototype.getApplicableModPath = function (mod) {
  if (!this.config.modsPath) {
    return mod
  }
  return path.join(this.config.modsPath, mod)
}

Mods.prototype.getAbsoluteModPath = function (mod) {
  return path.join(this.getAbsoluteModsPath(), mod)
}

module.exports = Mods
