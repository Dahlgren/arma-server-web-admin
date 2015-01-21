var nodefn = require('when/node/function');
var fs = require('fs');
var path = require('path');
var when = require('when');

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
}

module.exports = function (path, cb) {
  walk(path).then(function(files) {
    cb(null, files);
  }).otherwise(function(error) {
    cb(error);
  });
};
