var playwithsix = require('playwithsix');

function removeDuplicates(mods) {
  return mods.reduce(function(a,b){
    if (a.indexOf(b) < 0 ) a.push(b);
    return a;
  },[]);
}

function resolveMods(server, cb) {
  playwithsix.resolveDependencies(server.mods, function (err, mods) {
    if (!err && mods) {
      server.mods = removeDuplicates(server.mods.concat(mods));
      manager.save();
    }

    cb(err);
  });
}

module.exports = function (manager) {
  return {
    index: function (req, res){
      res.send(manager.getServers());
    },

    create: function (req, res) {
      var server = manager.addServer(req.body);
      if (server.mods.length > 0) {
        resolveMods(server, function(err) {
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
        resolveMods(server, function(err) {
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
