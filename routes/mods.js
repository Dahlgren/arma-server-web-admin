module.exports = function (modsManager) {
  return {
    index: function(req, res){
      modsManager.getMods(function (err, mods) {
        if (err) {
          res.send(500, err);
        } else {
          res.send(mods);
        }
      });
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
      res.send('destroy mod ' + req.params.mod);
    },
  };
};
