var uuid = require('uuid').v1
var logger = require('./logger').getLogger('http')

module.exports = function (req, res, next) {
  var level = 'debug'
  if (req.path.indexOf('/api/') === 0) {
    level = 'info'
  }

  var id = req.reqId || req.headers['x-request-id'] || uuid()
  var start = process.hrtime()
  var user = req.auth ? req.auth.user : 'anon'

  req.log = res.log = logger.child({
    method: req.method,
    uri: req.uri,
    req_id: id,
    user: user
  }, true)

  req.reqId = res.reqId = id
  res.header('X-Request-Id', id)

  req.log.trace({headers: req.headers}, 'request start')
  res.on('finish', function () {
    if (res.statusCode >= 500) {
      level = 'error'
    }
    res.log[level]({duration: getDuration(start)}, serializeRequestResponse(req, res))
  })

  res.on('close', function () {
    res.log.debug({duration: getDuration(start)}, 'request socket closed')
  })

  next()
}

function getDuration (start) {
  var diff = process.hrtime(start)
  return diff[0] * 1e3 + diff[1] * 1e-6
}

function serializeRequestResponse (req, res) {
  var user = req.auth ? req.auth.user : 'anon'

  return req.method + ' ' + req.originalUrl + ' : ' + res.statusCode + ' (user: ' + user + ')'
}
