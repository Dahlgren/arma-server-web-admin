var express = require('express')

module.exports = function (manager, mods) {
  var router = express.Router()

  router.get('/', function (req, res) {
    res.json(manager.getServers())
  })

  router.post('/', function (req, res) {
    if (!req.body.title) {
      res.status(400).send('Server title cannot be empty')
      return
    }

    manager.addServer(req.body, function (err, server) {
      if (err) {
        return res.status(500).send(err)
      }

      res.status(201).send(server)
    })
  })

  router.get('/:server', function (req, res) {
    var server = manager.getServer(req.params.server)
    res.json(server)
  })

  router.put('/:server', function (req, res) {
    if (!req.body.title) {
      res.status(400).send('Server title cannot be empty')
      return
    }

    manager.update(req.params.server, req.body, function (err, server) {
      if (err) {
        return res.status(500).send(err)
      }

      res.status(200).send(server)
    })
  })

  router.delete('/:server', function (req, res) {
    manager.removeServer(req.params.server, function (err, server) {
      if (err) {
        return res.status(500).send(err)
      }

      res.status(204).send()
    })
  })

  router.post('/:server/start', function (req, res) {
    var server = manager.getServer(req.params.server)
    server.start()
    res.json({ status: 'ok', pid: server.pid })
  })

  router.post('/:server/stop', function (req, res) {
    var server = manager.getServer(req.params.server)
    server.stop(function () {
      if (!server.pid) {
        res.json({ status: true, pid: server.pid })
      } else {
        res.json({ status: false, pid: server.pid })
      }
    })
  })

  return router
}
