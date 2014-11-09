var fs = require('fs')
, path = require('path')
, async = require('async')
, playwithsix = require('playwithsix')
, when = require('when')
, nodefn = require('when/node/function');

var config = require('./../config');

function downloadMod(mod, cb) {
  playwithsix.downloadMod(config.path, mod, cb);
}

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

function isPlayWithSixMod(modPath, cb) {
  var pwsFile = path.join(modPath, '.synq.json');
  fs.exists(pwsFile, function (exists) {
    if (cb) {
      cb(exists);
    }
  });
};

exports.index = function(req, res){
  fs.readdir(config.path, function (err, files) {
    if (err) {
      res.send(err);
    } else {
      var mods = files.filter(function (file) {
        return file.charAt(0) == "@";
      });

      playwithsix.checkOutdated(config.path, function (err, outdatedMods) {
        async.map(mods, function (mod, cb) {
          var modPath = path.join(config.path, mod);
          isPlayWithSixMod(modPath, function (isPlayWithSixMod) {
            cb(null, { name: mod, outdated: outdatedMods.indexOf(mod) >= 0, playWithSix: isPlayWithSixMod });
          });
        }, function (err, mods) {
          res.send(mods);
        });
      });
    }
  });
};

exports.create = function(req, res){
  downloadMod(req.body.name, function (err, mods) {
    if (mods && !err) {
      res.send(mods);
    } else {
      res.send(500, err);
    }
  });
};

exports.show = function(req, res){
  walk(config.path + "/" + req.params.mod).then(function(files) {
    res.json(files);
  }).otherwise(function(error) {
    console.error(error.stack || error);
    res.send({success: false});
  });
};

exports.update = function(req, res){
  downloadMod(req.params.mod, function (err, mods) {
    if (mods && !err) {
      res.send(mods);
    } else {
      res.send(500, err);
    }
  });
};

exports.destroy = function(req, res){
  res.send('destroy mod ' + req.params.mod);
};
