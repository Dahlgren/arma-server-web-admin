module.exports = function (manager, mods) {
  var resolveMods = function(server, cb) {
    mods.resolveMods(server.mods, function(err, resolvedMods) {
      if (!err) {
        server.mods = resolvedMods;
        manager.save();
      }
      cb();
    });
  };

  return {
    index: function (req, res){
      res.send(manager.getServers());
    },

    create: function (req, res) {
      var server = manager.addServer(req.body);
      if (server.mods.length > 0) {
        resolveMods(server, function() {
          res.send(server);
        });
      } else {
        res.send(server);
      }
    },

    show: function (req, res){
      var server = manager.getServer(req.params.server);
      res.send(server);
    },

    update: function(req, res){
      var server = manager.getServer(req.params.server);
      server.update(req.body);
      manager.save();

      if (server.mods.length > 0) {
        resolveMods(server, function() {
          res.send(server);
        });
      } else {
        res.send(server);
      }
    },

    destroy: function(req, res){
      var server = manager.removeServer(req.params.server);
      res.send(server);
    },

    start: function (req, res){
      var server = manager.getServer(req.params.server);
      server.start();
      res.send({status:"ok", pid: server.pid});
    },

    stop: function (req, res){
      var server = manager.getServer(req.params.server);
      server.stop(function () {
        if (!server.pid) {
          res.send({status: true, pid: server.pid});
        } else {
          res.send({status: false, pid: server.pid});
        }
      });
    },
  };
};
