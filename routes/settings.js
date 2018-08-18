var express = require('express')

module.exports = function (settings) {
  var router = express.Router()

  router.get('/', function (req, res) {
    res.json(settings.getPublicSettings())
  })

  return router
}
