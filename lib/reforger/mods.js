var async = require('async')
var events = require('events')
var filesize = require('filesize')
var fs = require('fs.extra')
var filesize = require('filesize')
var glob = require('glob')
var path = require('path')

var folderSize = require('../mods/folderSize')
var stripBOM = require('./stripBOM')

var Mods = function (config) {
  this.config = config
  this.mods = []
}

Mods.prototype = new events.EventEmitter()

Mods.prototype.workshopPath = function () {
  return this.config.reforger.workshop
}

Mods.prototype.delete = function (mod, cb) {
  var self = this
  var workshopFolder = this.workshopPath()

  fs.rmrf(path.join(workshopFolder, 'addons', mod), function (err) {
    cb(err)

    if (!err) {
      self.updateMods()
    }
  })
}

Mods.prototype.updateMods = function () {
  var self = this

  glob('**/ServerData.json', { cwd: this.workshopPath() }, function (err, files) {
    if (err) {
      console.log(err)
      return
    }

    async.map(files, self.resolveModData.bind(self), function (err, mods) {
      if (err) {
        console.log(err)
        return
      }

      self.mods = mods
      self.emit('mods', mods)
    })
  })
}

Mods.prototype.resolveModData = function (serverDataPath, cb) {
  var self = this
  var serverDataFile = path.join(this.workshopPath(), serverDataPath)
  var modPath = path.dirname(serverDataFile)
  async.parallel({
    folderSize: function (cb) {
      folderSize(modPath, cb)
    },
    serverData: function (cb) {
      fs.readFile(serverDataFile, 'utf-8', function (err, data) {
        if (err) {
          console.log(err)
          return cb(err)
        }

        try {
          var serverData = JSON.parse(stripBOM(data))
          cb(null, serverData)
        } catch (err) {
          console.log(err)
          return cb(err)
        }
      })
    }
  }, function (err, results) {
    if (err) {
      return cb(err)
    }

    cb(null, {
      id: results.serverData.id,
      name: results.serverData.name,
      size: results.folderSize,
      formattedSize: filesize(results.folderSize)
    })
  })
}

module.exports = Mods
