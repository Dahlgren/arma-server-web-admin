var async = require('async');
var events = require('events');
var filesize = require('filesize');
var fs = require('fs.extra');
var _ = require('lodash');
var path = require('path');
var ArmaSteamWorkshop = require('arma-steam-workshop');

var SteamMods = function (config) {
  this.config = config;
  this.armaSteamWorkshop = new ArmaSteamWorkshop(this.config.steam);
  this.mods = [];
};

SteamMods.prototype = new events.EventEmitter();

SteamMods.prototype.delete = function (mod, cb) {
  cb(new Error('not implemented'));
};

SteamMods.prototype.find = function (id) {
  return this.mods.find(function (mod) {
    return mod.id == id;
  });
};

SteamMods.prototype.download = function (mod, cb) {
  cb(new Error('not implemented'));
};

SteamMods.prototype.resolveMods = function (mods, cb) {
  cb(null, mods);
};

SteamMods.prototype.search = function (query, cb) {
  cb(new Error('not implemented'));
};

SteamMods.prototype.updateMods = function () {
  var self = this;
  this.armaSteamWorkshop.mods(function (err, mods) {
    if (!err) {
      mods.map(function (mod) {
        mod.id = mod.id + '';
        mod.playWithSix = null;
        mod.progress = null;
        mod.outdated = false;
      });
      
      self.mods = mods;
      self.emit('mods', mods);
    }
  });
};

module.exports = SteamMods;
