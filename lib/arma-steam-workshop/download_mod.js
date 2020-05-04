var steamcmd = require('steamcmd')

module.exports = function (options, callback) {
  steamcmd.install({
    applicationId: 107410,
    path: options.path,
    password: options.password,
    username: options.username,
    steamGuardCode: options.steamGuardCode,
    workshopId: options.workshopId
  }, callback)
}
