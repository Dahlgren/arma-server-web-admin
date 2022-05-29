var async = require('async')
var filesize = require('filesize')
var fs = require('fs.extra')
var glob = require('glob')
var path = require('path')

var Logs = function (config) {
  this.config = config
}

Logs.prototype.delete = function (filename, callback) {
  callback = callback || function () {}

  this.getLogFile(filename, function (err, logFile) {
    if (err) {
      return callback(err)
    } else {
      if (logFile && logFile.path) {
        fs.unlink(logFile.path, callback)
      } else {
        return callback(new Error('File not found'))
      }
    }
  })
}

Logs.prototype.logsPath = function () {
  return this.config.reforger.profiles
}

Logs.prototype.logFiles = function (callback) {
  var directory = this.logsPath()

  if (directory === null) {
    return callback(null, [])
  }

  glob('**/*.log', { cwd: directory }, function (err, files) {
    if (err) {
      callback(err)
      return
    }

    files = files.map(function (file) {
      return {
        name: file,
        path: path.join(directory, file)
      }
    })

    async.filter(files, function (file, cb) {
      fs.stat(file.path, function (err, stat) {
        if (err) {
          return cb(err)
        }

        file.created = stat.birthtime.toISOString()
        file.modified = stat.mtime.toISOString()
        file.formattedSize = filesize(stat.size)
        file.size = stat.size
        cb(null, stat.isFile())
      })
    }, function (err, files) {
      if (err) {
        return callback(err)
      }

      files.sort(function (a, b) {
        return b.created.localeCompare(a.created) // Descending order
      })

      callback(null, files)
    })
  })
}

Logs.prototype.getLogFile = function (filename, callback) {
  this.logFiles(function (err, files) {
    if (err) {
      callback(err)
    } else {
      var validLogs = files.filter(function (file) {
        return file.name === filename
      })

      if (validLogs.length > 0) {
        callback(null, validLogs[0])
      } else {
        callback(null, null)
      }
    }
  })
}

Logs.prototype.readLogFile = function (filename, callback) {
  fs.readFile(filename, callback)
}

module.exports = Logs
