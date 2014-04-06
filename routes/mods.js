var fs = require('fs')
, path = require('path')
, when = require('when')
, nodefn = require('when/node/function');

var config = require('./../config');

function walk (directory) {
  createFile = function (file, stat) {
    return {
      type: "file",
      name: file,
      size: stat.size
    };
  };

  createFolder = function (folder) {
    return {
      type: "folder",
      name: folder,
      files: []
    };
  };

  var results = [];

  return when.map(nodefn.call(fs.readdir, directory), function(file) {
    var absolutePath = path.join(directory, file);
    return nodefn.call(fs.stat, absolutePath).then(function(stat) {
      if (stat.isFile()) {
        return results.push(createFile(file, stat));
      }

      folder = createFolder(file);
      return walk(absolutePath).then(function(filesInDir) {
        folder.files = filesInDir;
        results.push(folder);
      });
    });
  }).then(function() {
    return results;
  });
};

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
  walk(config.path + "/" + req.params.mod).then(function(files) {
    res.json(files);
  }).otherwise(function(error) {
    console.error(error.stack || error);
    res.send({success: false});
  });
};

exports.destroy = function(req, res){
  res.send('destroy mod ' + req.params.mod);
};
