module.exports = function (logsManager) {
  return {
    index: function(req, res){
      logsManager.logFiles(function (err, files) {
        if (err) {
          res.send(err);
        } else {
          res.send(files);
        }
      });
    },
    show: function(req, res){
      var requestedFilename = req.params.log;
      if (req.format) {
        requestedFilename += "." + req.format;
      }

      logsManager.getLogFile(requestedFilename, function (err, file) {
        if (err) {
          res.send(err);
        } else {
          if (file) {
            res.download(file.path);
          } else {
            res.send(404, new Error("File not found"));
          }
        }
      });
    },
  };
};
