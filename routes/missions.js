var fs = require('fs');
var path = require('path');

var config = require('./../config');

function missionsPath() {
  return path.join(config.path, 'mpmissions');
}

exports.index = function(req, res){
  fs.readdir(missionsPath(), function (err, files) {
    if (err) {
      res.send(err);
    } else {
      var missions = files.map(function (filename) {
        return {
          name: filename,
        };
      });
      res.send(missions);
    }
  });
};

exports.create = function(req, res){
  var missionFile = req.files.mission;

  fs.readFile(missionFile.path, function (err, data) {
    var filename = decodeURI(missionFile.name.toLowerCase());
    fs.writeFile(path.join(missionsPath(), filename), data, function (err) {
      res.json(missionFile);
    });
  });
};

exports.show = function(req, res){
  var filename = req.params.mission;
  if (req.params.format) {
    filename += '.' + req.params.format;
  }

  res.download(path.join(missionsPath(), encodeURI(filename)), decodeURI(filename));
};

exports.destroy = function(req, res){
  var filename = req.params.mission;
  if (req.params.format) {
    filename += '.' + req.params.format;
  }

  fs.unlink(path.join(missionsPath(), filename), function (err) {
    if (err) {
      res.json(500, {success: false});
    } else {
      res.json({success: true});
    }
  });
};
