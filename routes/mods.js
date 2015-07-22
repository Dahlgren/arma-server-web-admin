module.exports = function (modsManager) {
  return {
    index: function(req, res){
      res.send(modsManager.mods);
    },

    create: function(req, res){
      modsManager.download(req.body.name, function (err, mods) {
        if (err || !mods) {
          res.send(500, err);
        } else {
          res.send(mods);
        }
      });
    },

    show: function(req, res){
      modsManager.traverse(req.params.mod, function (err, files) {
        if (err || !files) {
          console.error(err.stack || err);
          res.send(500, err);
        } else {
          res.json(files);
        }
      });
    },

    update: function(req, res){
      modsManager.download(req.params.mod, function (err, mods) {
        if (err || !mods) {
          res.send(500, err);
        } else {
          res.send(mods);
        }
      });
    },

    destroy: function(req, res){
      modsManager.delete(req.params.mod, function (err) {
        if (err) {
          res.send(500, err);
        } else {
         res.send(204, {});
        }
      });
    },

    refresh: function(req, res){
      modsManager.updateMods();
      res.send(200, {});
    },

    search: function(req, res){
      var query = req.body.query || "";
      modsManager.search(query, function (err, mods) {
        if (err || !mods) {
          res.send(500, err);
        } else {
          res.send(mods);
        }
      });
    }
  };
};
