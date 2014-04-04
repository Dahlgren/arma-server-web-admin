var fs = require('fs');

var config = require('./../config');

exports.index = function(req, res){
  var path = config.path + '/mpmissions';
  fs.readdir(path, function (err, files) {
    if (err) {
      res.send(err);
    } else {
      res.send(files);
    }
  });
};

exports.create = function(req, res){
  res.send('create mission');
};

exports.show = function(req, res){
  res.send('download mission ' + req.params.mission);
};

exports.destroy = function(req, res){
  res.send('destroy mission ' + req.params.mission);
};