var async = require('async')
var events = require('events')
var filesize = require('filesize')
var fs = require('fs.extra')
var glob = require('glob')
var path = require('path')

var folderSize = require('./folderSize')
var modFile = require('./modFile')
var steamMeta = require('./steamMeta')

var Mods = function (config) {
  this.config = config
  this.mods = []
}

Mods.prototype = new events.EventEmitter()

Mods.prototype.delete = function (mod, cb) {
  var self = this
  fs.rmrf(path.join(this.config.path, mod), function (err) {
    cb(err)

    if (!err) {
      self.updateMods()
    }
  })
}

Mods.prototype.updateMods = function () {
  var self = this
  glob('**/{@*,csla,gm,vn,ws}/addons', { cwd: self.config.path }, function (err, files) {
    if (err) {
      console.log(err)
      return
    }

    var mods = files.map(function (file) {
      // Find actual parent mod folder from addons folder
      return path.join(file, '..')
    })

    async.map(mods, self.resolveModData.bind(self), function (err, mods) {
      if (err) {
        console.log(err)
        return
      }

      self.mods = mods
      self.emit('mods', mods)
    })
  })
}

Mods.prototype.resolveModData = function (modPath, cb) {
  var self = this
  async.parallel({
    folderSize: function (cb) {
      folderSize(modPath, self.config, cb)
    },
    modFile: function (cb) {
      modFile(modPath, self.config, cb)
    },
    steamMeta: function (cb) {
      steamMeta(modPath, self.config, cb)
    }
  }, function (err, results) {
    if (err) {
      return cb(err)
    }

    cb(null, {
      name: modPath,
      size: results.folderSize,
      formattedSize: filesize(results.folderSize),
      modFile: results.modFile,
      steamMeta: results.steamMeta
    })
  })
}

module.exports = Mods
