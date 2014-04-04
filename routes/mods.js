var fs = require('fs');

var config = require('./../config');

exports.index = function(req, res){
  fs.readdir(config.path, function (err, files) {
    if (err) {
      res.send(err);
    } else {
      var mods = files.filter(function (file) {
        return file.charAt(0) == "@";
      }).map(function (mod) {
        return { name: mod }
      });
      res.send(mods);
    }
  });
};

exports.create = function(req, res){
  res.send('create mod');
};

exports.show = function(req, res){
  res.send('show mod ' + req.params.mod);
};

exports.destroy = function(req, res){
  res.send('destroy mod ' + req.params.mod);
};