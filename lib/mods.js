var async = require('async');
var events = require('events');
var filesize = require('filesize');
var fs = require('fs.extra');
var _ = require('lodash');
var path = require('path');
var playwithsix = require('playwithsix');

var Mods = function (config) {
  this.config = config;
  this.liteMods = true;
  this.mods = [];

  var self = this;
};

Mods.prototype = new events.EventEmitter();

Mods.prototype.delete = function (mod, cb) {
  var self = this;
  fs.rmrf(path.join(this.config.path, mod), function (err) {
    cb(err);

    if (!err) {
      self.updateMods();
    }
  });
};

Mods.prototype.download = function (mod, cb) {
  var self = this;
  var currentDownloadMod = null;
  var currentDownloadProgress = 0;

  playwithsix.downloadMod(this.config.path, mod, {lite: this.liteMods}, function(err, mods) {
    if (currentDownloadMod) {
      currentDownloadMod.progress = null;
      self.emit('mods', self.mods);
    }
    self.updateMods();

    if (cb) {
      cb(err, mods);
    }
  }).on('progress', function (progress) {
    var modName = progress.mod;

    if (!currentDownloadMod || currentDownloadMod.name != modName) {
      if (currentDownloadMod) {
        currentDownloadMod.progress = null;
      }

      var mod = _.find(self.mods, {name: modName});

      if (mod) {
        currentDownloadMod = mod;
      } else {
        currentDownloadMod = {
          name: modName,
          outdated: false,
          playWithSix: true,
        };
        self.mods.push(currentDownloadMod);
      }
    }

    // Progress in whole percent
    var newProgress = parseInt(progress.completed / progress.size * 100, 10);

    if (newProgress != currentDownloadMod.progress) {
      currentDownloadMod.progress = newProgress;
      self.emit('mods', self.mods);
    }
  });
};

Mods.prototype.find = function (id) {
  this.mods.find(function (mod) {
    return mod.id == id;
  })
};

Mods.prototype.updateMods = function () {
  var self = this;
  fs.readdir(self.config.path, function (err, files) {
    if (err) {
      console.log(err);
    } else {
      var mods = files.filter(function (file) {
        return file.charAt(0) == "@";
      });

      playwithsix.checkOutdated(self.config.path, function (err, outdatedMods) {
        async.map(mods, function (mod, cb) {
          var modPath = path.join(self.config.path, mod);
          self.isPlayWithSixMod(modPath, function (isPlayWithSixMod) {
            cb(null, {
              id: mod,
              name: mod,
              outdated: outdatedMods && outdatedMods.indexOf(mod) >= 0,
              path: mod,
              progress: null,
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

module.exports = Mods;
