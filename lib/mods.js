var async = require('async');
var fs = require('fs');
var path = require('path');
var playwithsix = require('playwithsix');

var traverse = require('./mods/traverse');

function isPlayWithSixMod(modPath, cb) {
  var pwsFile = path.join(modPath, '.synq.json');
  fs.exists(pwsFile, function (exists) {
    if (cb) {
      cb(exists);
    }
  });
}

var Mods = function (config) {
  this.config = config;
};

Mods.prototype.download = function (mod, cb) {
  playwithsix.downloadMod(this.config.path, mod, cb);
};

Mods.prototype.getMods = function (callback) {
  var self = this;
  fs.readdir(self.config.path, function (err, files) {
    if (err) {
      callback(err);
    } else {
      var mods = files.filter(function (file) {
        return file.charAt(0) == "@";
      });

      playwithsix.checkOutdated(self.config.path, function (err, outdatedMods) {
        async.map(mods, function (mod, cb) {
          var modPath = path.join(self.config.path, mod);
          isPlayWithSixMod(modPath, function (isPlayWithSixMod) {
            cb(null, {
              name: mod,
              outdated: outdatedMods && outdatedMods.indexOf(mod) >= 0,
              playWithSix: isPlayWithSixMod,
            });
          });
        }, function (err, mods) {
          callback(err, mods);
        });
      });
    }
  });
};

Mods.prototype.traverse = function (mod, cb) {
  traverse(path.join(this.config.path, mod), cb);
};

module.exports = Mods;
