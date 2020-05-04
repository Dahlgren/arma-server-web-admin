var fs = require('fs.extra')
var path = require('path')
var modsDirectory = require('./mods_directory')
var deleteModFromAcf = require('./delete_mod_from_acf')

module.exports = function (options, callback) {
  var modsPath = modsDirectory(options.path)
  var modPath = path.resolve(modsPath, options.workshopId.toString())
  deleteModFromAcf(options.path, options.workshopId, function (err) {
    if (err) {
      if (callback) {
        callback(err)
      }
      return
    }

    fs.rmrf(modPath, callback)
  })
}
