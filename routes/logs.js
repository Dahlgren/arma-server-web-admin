var express = require('express');

module.exports = function (logsManager) {
  var router = express.Router();

  router.get('/', function (req, res) {
    logsManager.logFiles(function (err, files) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(files);
      }
    });
  });

  router.get('/:log', function(req, res) {
    var requestedFilename = req.params.log;

    logsManager.getLogFile(requestedFilename, function (err, file) {
      if (err) {
        res.status(500).send(err);
      } else {
        if (file) {
          res.download(file.path);
        } else {
          res.status(404).send(new Error("File not found"));
        }
      }
    });
  });

  return router;
};
