var path = require('path')

module.exports = function (steamDirectory) {
  return path.join(steamDirectory, 'steamapps', 'workshop', 'content', '107410')
}
