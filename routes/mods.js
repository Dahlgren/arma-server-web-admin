var express = require('express')

module.exports = function (modsManager) {
  var router = express.Router()

  router.get('/', function (req, res) {
    res.send(modsManager.mods)
  })

  router.post('/', function (req, res) {
    modsManager.download(req.body.id)
    res.status(204).send()
  })

  router.put('/:mod', function (req, res) {
    modsManager.download(req.params.mod)
    res.status(204).send()
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

  router.post('/search', function (req, res) {
    var query = req.body.query || ''
    modsManager.search(query, function (err, mods) {
      if (err || !mods) {
        res.status(500).send(err)
      } else {
        res.send(mods)
      }
    })
  })

  return router
}
