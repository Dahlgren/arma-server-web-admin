var express = require('express');
var multer  = require('multer');
var upload = multer({ storage: multer.diskStorage({}) });

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

router.post('/', upload.single('mission'), function (req, res) {
   var missionFile = req.file;

   if (!missionFile) {
     return res.status(400).send('No mission file uploaded');;
   }

    missionsManager.handleUpload(missionFile, function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
         res.status(200).json({success: true});
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
