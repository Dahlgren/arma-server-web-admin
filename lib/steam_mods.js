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
    self.addStatusForCurrentDowloads()
    self.updateMods()

    if (cb) {
      cb(err)
    }
  })
  self.addStatusForCurrentDowloads()
  self.emit('mods', this.mods)
}

SteamMods.prototype.search = function (query, cb) {
  this.armaSteamWorkshop.search(query, cb)
}

SteamMods.prototype.updateMods = function () {
  var self = this
  this.armaSteamWorkshop.mods(function (err, mods) {
    if (!err) {
      self.mods = mods
      self.addStatusForCurrentDowloads()
      self.emit('mods', mods)
    }
  })
}

SteamMods.prototype.isModDownloading = function (workshopId) {
  return this.armaSteamWorkshop.currentDownloads[workshopId] === true
}

SteamMods.prototype.addStatusForCurrentDowloads = function () {
  var self = this
  this.mods.forEach(function (mod) {
    mod.downloading = self.isModDownloading(mod.id)
  })

  this.addDummyModsForCurrentDowloads()
  this.emit('mods', this.mods)
}

SteamMods.prototype.addDummyModsForCurrentDowloads = function () {
  var self = this
  for (var workshopId in this.armaSteamWorkshop.currentDownloads) {
    var mod = self.mods.find(function (mod) {
      return mod.id === workshopId
    })

    if (!mod) {
      self.mods.splice(0, 0, {
        id: workshopId,
        name: workshopId,
        path: null,
        downloading: true
      })
    }
  }
}

module.exports = SteamMods
