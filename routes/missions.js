var fs = require('fs');

var config = require('./../config');

exports.index = function(req, res){
  var path = config.path + '/mpmissions';
  fs.readdir(path, function (err, files) {
    if (err) {
      res.send(err);
    } else {
      var missions = files.map(function (filename) {
        return { name: filename }
      });
      res.send(missions);
    }
  });
};

exports.create = function(req, res){
  var missionFile = req.files.mission;
  
  fs.readFile(missionFile.path, function (err, data) {
    var newPath = config.path + '/mpmissions/' + missionFile.name;
    console.log(newPath);
    fs.writeFile(newPath, data, function (err) {
      res.json(missionFile);
    });
  });
};

exports.show = function(req, res){
  res.send('download mission ' + req.params.mission);
};

exports.destroy = function(req, res){
  res.send('destroy mission ' + req.params.mission);
};