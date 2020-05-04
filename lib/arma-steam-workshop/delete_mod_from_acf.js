var readAcf = require('./acf/read')
var writeAcf = require('./acf/write')
var deleteModMetadata = require('./delete_mod_metadata')

module.exports = function (steamDirectory, workshopId, callback) {
  readAcf(steamDirectory, function (err, data) {
    if (err) {
      return callback(err)
    }
    deleteModMetadata(data, workshopId)
    writeAcf(steamDirectory, data, callback)
  })
}
