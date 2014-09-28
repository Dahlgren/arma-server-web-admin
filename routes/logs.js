var async = require('async');
var fs = require('fs');
var path = require('path');
var userhome = require('userhome');

var config = require('./../config');

function logsPath() {
  if (config.type === "windows") {
    return userhome('AppData', 'Local', 'Arma 3');
  }

  if (config.type === "wine") {
    var username = process.env.USER;
    return userhome('.wine', 'drive_c', 'users', username, 'Local Settings', 'Application Data', 'Arma 3');
  }

  return null;
}

function logFiles(directory, callback) {
  fs.readdir(directory, function (err, files) {
    if (err) {
      callback (err);
      return;
    }

    files = files.map(function (file) {
      return path.join(directory, file);
    });

    async.filter(files, function(file, cb) {
      fs.stat(file, function (err, file) {
        cb(!err && file.isFile());
      });
    }, function (files) {
      callback(null, files.map(path.basename).sort());
    });
  });
}

exports.index = function(req, res){
  var pathToLogs = logsPath();

  if (pathToLogs === null) {
    res.send([]);
  } else {
    logFiles(pathToLogs, function (err, files) {
      if (err) {
        res.send(err);
      } else {
        var logs = files.map(function (filename) {
          return { name: filename };
        });
        res.send(logs);
      }
    });
  }
};

exports.show = function(req, res){
  var pathToLogs = logsPath();

  var requestedFilename = req.params.log;
  if (req.format) {
    requestedFilename += "." + req.format;
  }

  if (pathToLogs === null) {
    res.send(404, new Error("File not found"));
  } else {
    logFiles(pathToLogs, function (err, files) {
      var logfile = null;
      if (err) {
        res.send(err);
      } else {
        var logs = files.map(function (filename) {
          if (filename === requestedFilename) {
            logfile = path.join(pathToLogs, filename);
          }
        });
      }

      if (logfile) {
        res.download(logfile);
      } else {
        res.send(404, new Error("File not found"));
      }
    });
  }
};
