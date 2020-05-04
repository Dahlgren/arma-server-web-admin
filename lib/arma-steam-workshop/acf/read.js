var fs = require('fs')
var VDF = require('@node-steam/vdf')

var acfPath = require('./path')

module.exports = function (steamDirectory, callback) {
  var filePath = acfPath(steamDirectory)
  fs.readFile(filePath, 'utf8', function (err, text) {
    if (err) {
      return callback(err)
    }

    var data = VDF.parse(text)

    return callback(null, data)
  })
}
