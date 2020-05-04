var fs = require('fs')
var VDF = require('@node-steam/vdf')

var acfPath = require('./path')

module.exports = function (steamDirectory, data, callback) {
  var filePath = acfPath(steamDirectory)
  var text = VDF.stringify(data)
  fs.writeFile(filePath, text, callback)
}
