var async = require('async');
var events = require('events');
var filesize = require('filesize');
var fs = require('fs');
var path = require('path');
var playwithsix = require('playwithsix');

var traverse = require('./mods/traverse');

var Mods = function (config) {
  this.config = config;
  this.liteMods = true;
  this.mods = [];

  var self = this;
  this.updateMods();
};

Mods.prototype = new events.EventEmitter();

Mods.prototype.download = function (mod, cb) {
  var self = this;
  playwithsix.downloadMod(this.config.path, mod, {lite: this.liteMods}, function(err, mods) {
    self.updateMods();
    cb(err, mods);
  });
};

Mods.prototype.updateMods = function () {
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
          if (!err) {
            self.mods = mods;
            self.emit('mods', mods);
          }
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

Mods.prototype.search = function (query, cb) {
  playwithsix.search(query, function (err, mods) {
    if (err) {
      cb(err);
    } else {
      mods.map(function (mod) {
        mod.formattedSize = filesize(mod.size);
      });
      cb(null, mods);
    }
  });
};

Mods.prototype.traverse = function (mod, cb) {
  traverse(path.join(this.config.path, mod), cb);
};

module.exports = Mods;
