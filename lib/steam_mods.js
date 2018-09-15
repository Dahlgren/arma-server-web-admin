var events = require('events')
var ArmaSteamWorkshop = require('arma-steam-workshop')

var SteamMods = function (config) {
  this.config = config
  this.armaSteamWorkshop = new ArmaSteamWorkshop(this.config.steam)
  this.mods = []
}

SteamMods.prototype = new events.EventEmitter()

SteamMods.prototype.delete = function (mod, cb) {
  var self = this
  this.armaSteamWorkshop.deleteMod(mod, function (err) {
    if (!err) {
      self.updateMods()
    }

    if (cb) {
      cb(err)
    }
  })
}

SteamMods.prototype.find = function (id) {
  return this.mods.find(function (mod) {
    return mod.id === id
  })
}

SteamMods.prototype.download = function (workshopId, cb) {
  var self = this
  this.armaSteamWorkshop.downloadMod(workshopId, function (err) {
    self.updateMods()

    if (cb) {
      cb(err)
    }
  })
  self.updateMods()
}

SteamMods.prototype.search = function (query, cb) {
  this.armaSteamWorkshop.search(query, cb)
}

SteamMods.prototype.updateMods = function () {
  var self = this
  this.armaSteamWorkshop.mods(function (err, mods) {
    if (!err) {
      self.mods = mods
      self.emit('mods', mods)
    }
  })
}

module.exports = SteamMods
