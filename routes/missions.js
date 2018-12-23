var async = require('async')
var express = require('express')
var multer = require('multer')
var path = require('path')

var upload = multer({ storage: multer.diskStorage({}) })

module.exports = function (missionsManager) {
  var router = express.Router()

  router.get('/', function (req, res) {
    res.json(missionsManager.missions)
  })

  router.post('/', upload.array('missions', 64), function (req, res) {
    var missions = req.files.filter(function (file) {
      return path.extname(file.originalname) === '.pbo'
    })

    async.parallelLimit(
      missions.map(function (missionFile) {
        return function (next) {
          missionsManager.handleUpload(missionFile, next)
        }
      }),
      8,
      function (err) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(200).json({ success: true })
        }
      }
    )
  })

  router.get('/:mission', function (req, res) {
    var filename = req.params.mission

    res.download(missionsManager.missionPath(filename), decodeURI(filename))
  })

  router.delete('/:mission', function (req, res) {
    var filename = req.params.mission

    missionsManager.delete(filename, function (err) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.json({ success: true })
      }
    })
  })

  router.post('/refresh', function (req, res) {
    missionsManager.updateMissions()
    res.status(204).send()
  })

  router.post('/workshop', function (req, res) {
    var id = req.body.id

    missionsManager.downloadSteamWorkshop(id, function (err) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.json({ success: true })
      }
    })
  })

  return router
}
