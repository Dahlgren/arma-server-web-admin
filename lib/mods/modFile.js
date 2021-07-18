var armaClassParser = require('arma-class-parser')
var fs = require('fs')
var path = require('path')

function stripBOM (data) {
  if (data.charCodeAt(0) === 0xFEFF) {
    return data.slice(1)
  }

  return data
}

module.exports = function (modPath, config, callback) {
  var modCpp = path.resolve(config.path, modPath, 'mod.cpp')
  fs.readFile(modCpp, 'utf8', function (err, data) {
    if (err) {
      return callback(null, null)
    }

    try {
      var meta = armaClassParser.parse(stripBOM(data))
      callback(null, {
        name: meta.name
      })
    } catch (err) {
      console.log('Error parsing mod.cpp for ' + modPath + ', ' + err)
      callback(null, null)
    }
  })
}
