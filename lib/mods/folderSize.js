var async = require('async')
var fs = require('fs')
var glob = require('glob')
var path = require('path')

module.exports = function (modPath, callback) {
  var total = 0
  glob('**/*', { cwd: modPath, dot: true }, function (err, files) {
    if (err) {
      return callback(err, 0)
    }

    async.forEach(files, function (file, cb) {
      fs.stat(path.join(modPath, file), function stat (err, stats) {
        if (!err && (stats.isFile() || stats.isSymbolicLink())) {
          var size = stats.size || 0
          total += size
        }
        cb()
      })
    }, function (err) {
      callback(err, total)
    })
  })
}
