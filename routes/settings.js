var express = require('express')
var _ = require('lodash')

module.exports = function (config) {
  var router = express.Router()

  router.get('/', function (req, res) {
    res.json(_.pick(config, ['game', 'path', 'type']))
  })

  return router
}
