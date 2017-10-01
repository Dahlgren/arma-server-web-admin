var basicAuth = require('express-basic-auth')

function getBasicAuthUsers (configAuth) {
  var basicAuthUsers = {}
  if (configAuth.username && configAuth.password) {
    configAuth = [configAuth]
  }

  configAuth.forEach(function (user) {
    basicAuthUsers[user.username] = user.password
  })

  return basicAuthUsers
}

module.exports = function (config, app) {
  if (!config.auth) {
    return
  }

  if (!config.auth.username && !config.auth.password && !Array.isArray(config.auth)) {
    return
  }

  app.use(basicAuth({
    challenge: true,
    users: getBasicAuthUsers(config.auth)
  }))
}
