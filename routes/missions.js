var express = require('express');

module.exports = function (missionsManager) {
  var router = express.Router();

  router.get('/', function (req, res) {
    missionsManager.list(function (err, missions) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(missions);
      }
    });
  });

  router.post('/', function (req, res) {
    var missionFile = req.files.mission;
    missionsManager.handleUpload(missionFile, function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(204);
      }
    });
  });

  router.get('/:mission', function (req, res) {
    var filename = req.params.mission;

    res.download(missionsManager.missionPath(filename), decodeURI(filename));
  });

  router.delete('/:mission', function (req, res) {
    var filename = req.params.mission;

    missionsManager.delete(filename, function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({success: true});
      }
    });
  });

  router.post('/workshop', function (req, res) {
    var id = req.body.id;

    missionsManager.downloadSteamWorkshop(id, function (err, files) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({success: true});
      }
    });
  });

  return router;
};
