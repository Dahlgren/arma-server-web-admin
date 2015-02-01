var async = require('async');
var fs = require('fs');
var path = require('path');
var playwithsix = require('playwithsix');

var traverse = require('./mods/traverse');

var Mods = function (config) {
  this.config = config;
  this.liteMods = true;
};

Mods.prototype.download = function (mod, cb) {
  playwithsix.downloadMod(this.config.path, mod, {lite: this.liteMods}, cb);
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
          self.isPlayWithSixMod(modPath, function (isPlayWithSixMod) {
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

Mods.prototype.isPlayWithSixMod = function (modPath, cb) {
  var pwsFile = path.join(modPath, '.synq.json');
  fs.exists(pwsFile, function (exists) {
    if (cb) {
      cb(exists);
    }
  });
};

Mods.prototype.removeDuplicates = function (mods) {
  return mods.reduce(function(a,b){
    if (a.indexOf(b) < 0 ) a.push(b);
    return a;
  },[]);
};

Mods.prototype.resolveMods = function (modsToResolve, cb) {
  var self = this;
  playwithsix.resolveDependencies(modsToResolve, {lite: this.liteMods}, function (err, mods) {
    if (!err && mods) {
      cb(null, self.removeDuplicates(modsToResolve.concat(mods)));
    } else {
      cb(err);
    }
  });
};

Mods.prototype.traverse = function (mod, cb) {
  traverse(path.join(this.config.path, mod), cb);
};

module.exports = Mods;
