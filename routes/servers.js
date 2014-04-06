var slug = require('slug');

var Manager = require('./../manager');

var manager = new Manager();

exports.index = function (req, res){
  var servers = [];

  manager.getServers().forEach(function (server) {
    servers.push({
      id: server.id,
      title: server.title,
      port: server.port,
      mods: server.mods,
    })
  });

  res.send(servers);
};

exports.create = function (req, res){
  var title = req.body.title;
  var id = slug(title);
  res.send(manager.addServer(id, title));
};

exports.show = function (req, res){
  res.send(manager.getServer(req.params.server));
};

exports.update = function(req, res){
  res.send('update server ' + req.params.server);
};

exports.destroy = function(req, res){
  res.send('destroy server ' + req.params.server);
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
