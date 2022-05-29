var async = require('async')
var events = require('events')
var fs = require('fs.extra')
var filesize = require('filesize')
var glob = require('glob')
var path = require('path')

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

  fs.rmrf(path.join(workshopFolder, mod), function (err) {
    cb(err)

    if (!err) {
      self.updateMods()
    }
  })
}

Mods.prototype.updateMods = function () {
  var self = this
  var workshopFolder = this.workshopPath()

  glob('**/ServerData.json', { cwd: workshopFolder }, function (err, files) {
    if (err) {
      console.log(err)
      return
    }

    async.map(files, function (filename, cb) {
      var serverDataFile = path.join(workshopFolder, filename)
      fs.readFile(serverDataFile, 'utf-8', function (err, data) {
        if (err) {
          console.log(err)
          return cb(err)
        }

        try {
          var serverData = JSON.parse(stripBOM(data))
          var mod = {
            id: serverData.id,
            name: serverData.name,
            size: 0,
            formattedSize: filesize(0)
          }
          cb(null, mod)
        } catch (err) {
          console.log(err)
          return cb(err)
        }
      })
    }, function (err, mods) {
      if (err) {
        console.log(err)
        return
      }

      self.mods = mods
      self.emit('mods', mods)
    })
  })
}

module.exports = Mods
