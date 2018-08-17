var express = require('express')

module.exports = function (modsManager) {
  var router = express.Router()

  router.get('/', function (req, res) {
    res.send(modsManager.mods)
  })

  router.delete('/:mod', function (req, res) {
    modsManager.delete(req.params.mod, function (err) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.status(204).send()
      }
    })
  })

  router.post('/refresh', function (req, res) {
    modsManager.updateMods()
    res.status(204).send()
  })

  return router
}
