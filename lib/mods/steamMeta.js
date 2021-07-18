var armaClassParser = require('arma-class-parser')
var fs = require('fs')
var path = require('path')

module.exports = function (modPath, config, callback) {
  var metaCpp = path.resolve(config.path, modPath, 'meta.cpp')
  fs.readFile(metaCpp, 'utf8', function (err, data) {
    if (err) {
      return callback(null, null)
    }

    try {
      var meta = armaClassParser.parse(data)
      callback(null, {
        id: meta.publishedid,
        name: meta.name
      })
    } catch (err) {
      console.log('Error parsing meta.cpp for ' + modPath + ', ' + err)
      callback(null, null)
    }
  })
}
