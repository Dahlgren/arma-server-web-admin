var playwithsix = require('playwithsix');
var slug = require('slug');

var manager = require('./../manager');

function isPlayWithSixIgnoredMod(mod) {
  var ignoredMods = ["@acre"];
  return ignoredMods.indexOf(mod.toLowerCase()) != -1;
}

function removeDuplicates(mods) {
  return mods.reduce(function(a,b){
    if (a.indexOf(b) < 0 ) a.push(b);
    return a;
  },[]);
}

exports.index = function (req, res){
  var servers = [];

  manager.getServers().forEach(function (server) {
    servers.push({
      id: server.id,
      title: server.title,
      port: server.port,
      mods: server.mods,
      pid: server.pid,
    });
  });

  res.send(servers);
};

exports.create = function (req, res){
  var title = req.body.title;
  var id = slug(title);
  res.send(manager.addServer(id, title));
};

exports.show = function (req, res){
  var server = manager.getServer(req.params.server);
  res.send(server);
};

exports.update = function(req, res){
  var server = manager.getServer(req.params.server);

  if (req.body.mods) {
    server.mods = req.body.mods;
    manager.save();

    var modsToResolve = server.mods.filter(function(mod) {
      return !isPlayWithSixIgnoredMod(mod);
    });

    playwithsix.resolveDependencies(modsToResolve, function (err, mods) {
      if (!err && mods) {
        server.mods = removeDuplicates(server.mods.concat(mods));
        manager.save();
      }

      res.send(server);
    });
  } else {
    res.send(server);
  }
};

exports.destroy = function(req, res){
  var server = manager.removeServer(req.params.server);
  res.send(server);
};

exports.start = function (req, res){
  var server = manager.getServer(req.params.server);
  server.start();
  res.send({status:"ok", pid: server.pid});
};

exports.stop = function (req, res){
  var server = manager.getServer(req.params.server);
  server.stop(function () {
    if (!server.pid) {
      res.send({status: true, pid: server.pid});
    } else {
      res.send({status: false, pid: server.pid});
    }
  });
};
