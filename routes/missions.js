module.exports = function (missionsManager) {
  return {
    index: function (req, res) {
      missionsManager.list(function (err, missions) {
        if (err) {
          res.send(err);
        } else {
          res.send(missions);
        }
      });
    },
    create: function (req, res) {
      var missionFile = req.files.mission;
      missionsManager.handleUpload(missionFile, function (err) {
        res.send(err);
      });
    },
    show: function(req, res){
      var filename = req.params.mission;
      if (req.params.format) {
        filename += '.' + req.params.format;
      }

      res.download(missionsManager.missionPath(encodeURI(filename)), decodeURI(filename));
    },
    destroy: function(req, res){
      var filename = req.params.mission;
      if (req.params.format) {
        filename += '.' + req.params.format;
      }

      missionsManager.delete(filename, function (err) {
        if (err) {
          res.json(500, {success: false});
        } else {
          res.json({success: true});
        }
      });
    },
  };
};
