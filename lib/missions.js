var async = require('async');
var filesize = require('filesize');
var fs = require('fs');
var path = require('path');
var SteamWorkshop = require('steam-workshop');

var Missions = function (config) {
  this.config = config;
  this.steamWorkshop = new SteamWorkshop(this.missionsPath());
};

Missions.prototype.missionsPath = function() {
  return path.join(this.config.path, 'mpmissions');
};

Missions.prototype.missionPath = function (name) {
  return path.join(this.missionsPath(), name);
}

Missions.prototype.list = function (cb){
  var self = this;
  fs.readdir(this.missionsPath(), function (err, files) {
    if (err) {
      cb(err);
    } else {
      async.map(files, function (filename, cb) {
        fs.stat(self.missionPath(filename), function (err, stat) {
          if (err) {
            cb(err);
          }

          cb(null, {
            dateCreated: new Date(stat.ctime),
            dateModified: new Date(stat.mtime),
            name: filename,
            size: stat.size,
            sizeFormatted: filesize(stat.size),
          });
        });
      }, function (err, missions) {
        if (cb) {
          cb(err, missions);
        }
      });
    }
  });
};

Missions.prototype.handleUpload = function (uploadedFile, cb) {
  var filename = decodeURI(uploadedFile.originalname.toLowerCase());
  fs.rename(uploadedFile.path, path.join(this.missionsPath(), filename), function (err) {
    cb(err);
  });
};

Missions.prototype.delete = function (missionName, cb) {
  fs.unlink(path.join(this.missionsPath(), missionName), cb);
};

Missions.prototype.downloadSteamWorkshop = function (id, cb) {
  if (!id) {
    return cb(new Error('Not a valid Steam Workshop ID: ' + id));
  }

  this.steamWorkshop.downloadFile(id, cb);
}

module.exports = Missions;
