var slug = require('slug');

var Manager = require('./../manager');

var manager = new Manager();

exports.index = function (req, res){
  res.send(manager.servers);
};

exports.create = function (req, res){
  var title = req.body.title;
  var id = slug(title);
  res.send(manager.addServer(id, title));
};

exports.update = function(req, res){
  res.send('update server ' + req.params.server);
};

exports.destroy = function(req, res){
  res.send('destroy server ' + req.params.server);
};
