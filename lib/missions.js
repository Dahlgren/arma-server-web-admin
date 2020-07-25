var async = require('async')
var events = require('events')
var filesize = require('filesize')
var fs = require('fs.extra')
var path = require('path')
var SteamWorkshop = require('steam-workshop')

var Missions = function (config) {
  this.config = config
  this.missions = []
  this.steamWorkshop = new SteamWorkshop(this.missionsPath())

  this.updateMissions()
}

Missions.prototype = new events.EventEmitter()

Missions.prototype.missionsPath = function () {
  return path.join(this.config.path, 'mpmissions')
}

Missions.prototype.missionPath = function (name) {
  return path.join(this.missionsPath(), name)
}

Missions.prototype.updateMissions = function (cb) {
  var self = this
  fs.readdir(this.missionsPath(), function (err, files) {
    if (err) {
      console.log(err)

      if (cb) {
        return cb(err)
      }

      return
    }

    async.map(files, function (filename, cb) {
      fs.stat(self.missionPath(filename), function (err, stat) {
        if (err) {
          console.log(err)
          return cb(err)
        }

        var filenameWithoutPbo = path.basename(filename, '.pbo')
        var worldName = path.extname(filenameWithoutPbo)
        var missionName = path.basename(filenameWithoutPbo, worldName)
        worldName = worldName.replace('.', '')

        cb(null, {
          dateCreated: new Date(stat.ctime),
          dateModified: new Date(stat.mtime),
          missionName: missionName,
          name: filename,
          size: stat.size,
          sizeFormatted: filesize(stat.size),
          worldName: worldName
        })
      })
    }, function (err, missions) {
      if (!err) {
        self.missions = missions
        self.emit('missions', missions)
      }

      if (cb) {
        cb(err, missions)
      }
    })
  })
}

Missions.prototype.handleUpload = function (uploadedFile, cb) {
  var filename = decodeURI(uploadedFile.originalname.toLowerCase())
  var self = this
  fs.move(uploadedFile.path, path.join(this.missionsPath(), filename), function (err) {
    self.updateMissions()

    if (cb) {
      cb(err)
    }
  })
}

Missions.prototype.delete = function (missionName, cb) {
  var self = this
  fs.unlink(path.join(this.missionsPath(), missionName), function (err) {
    self.updateMissions()

    if (cb) {
      cb(err)
    }
  })
}

Missions.prototype.downloadSteamWorkshop = function (id, cb) {
  if (!id) {
    return cb(new Error('Not a valid Steam Workshop ID: ' + id))
  }

  var self = this

  this.steamWorkshop.downloadFile(id, function (err) {
    self.updateMissions()

    if (cb) {
      cb(err)
    }
  })
}

module.exports = Missions
