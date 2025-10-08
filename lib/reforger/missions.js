var async = require('async')
var events = require('events')
var fs = require('fs.extra')
var glob = require('glob')
var path = require('path')

var stripBOM = require('./stripBOM')

var Missions = function (config) {
  this.config = config
  this.missions = []

  this.updateMissions()
}

Missions.prototype = new events.EventEmitter()

Missions.prototype.workshopPath = function () {
  return this.config.reforger.workshop
}

Missions.prototype.updateMissions = function (cb) {
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
          fs.stat(serverDataFile, function (err, stat) {
            if (err) {
              console.log(err)
              return cb(err)
            }

            var missions = serverData.revision.scenarios.map(function (scenario) {
              return {
                dateCreated: new Date(stat.ctime),
                dateModified: new Date(stat.mtime),
                missionName: scenario.name,
                name: scenario.gameId,
                size: 0,
                sizeFormatted: '',
                worldName: ''
              }
            })

            cb(null, missions)
          })
        } catch (err) {
          console.log(err)
          return cb(err)
        }
      })
    }, function (err, missions) {
      if (!err) {
        missions = missions.flat()
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
  cb(new Error('Not implemented'))
}

Missions.prototype.delete = function (missionName, cb) {
  cb(new Error('Not implemented'))
}

Missions.prototype.downloadSteamWorkshop = function (id, cb) {
  cb(new Error('Not implemented'))
}

module.exports = Missions
