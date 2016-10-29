var fs = require('fs');
var path = require('path');

var Missions = function (config) {
  this.config = config;
};

Missions.prototype.missionsPath = function() {
  return path.join(this.config.path, 'mpmissions');
};

Missions.prototype.missionPath = function (name) {
  return path.join(this.missionsPath(), name);
}

Missions.prototype.list = function (cb){
  fs.readdir(this.missionsPath(), function (err, files) {
    if (err) {
      cb(err);
    } else {
      var missions = files.map(function (filename) {
        return {
          name: filename,
        };
      });
      cb(null, missions);
    }
  });
};

Missions.prototype.handleUpload = function (uploadedFile, cb) {
  var filename = decodeURI(uploadedFile.name.toLowerCase());
  fs.rename(uploadedFile.path, path.join(this.missionsPath(), filename), function (err) {
    cb(err);
  });
};

Missions.prototype.delete = function (missionName, cb) {
  fs.unlink(path.join(this.missionsPath(), missionName), cb);
};

module.exports = Missions;
