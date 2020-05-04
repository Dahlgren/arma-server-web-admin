var deleteMod = require('./delete_mod')
var downloadMod = require('./download_mod')
var mods = require('./mods')
var search = require('./search')

var SteamWorkshop = function (options) {
  this.currentDownloads = {}
  this.options = options
}

SteamWorkshop.prototype.mods = function (callback) {
  mods(this.options.path, this.currentDownloads, callback)
}

SteamWorkshop.prototype.deleteMod = function (workshopId, callback) {
  deleteMod({
    workshopId: workshopId,
    path: this.options.path
  }, callback)
}

SteamWorkshop.prototype.downloadMod = function (workshopId, callback) {
  if (this.currentDownloads[workshopId]) {
    return callback(new Error('Already downloading ' + workshopId))
  }

  var self = this
  self.currentDownloads[workshopId] = true

  downloadMod({
    workshopId: workshopId,
    path: this.options.path,
    username: this.options.username,
    password: this.options.password,
    steamGuardCode: this.options.steamGuardCode
  }, function (err) {
    delete self.currentDownloads[workshopId]

    if (callback) {
      return callback(err)
    }
  })
}

SteamWorkshop.prototype.search = function (text, callback) {
  search(text, this.options.apiKey, callback)
}

module.exports = SteamWorkshop
