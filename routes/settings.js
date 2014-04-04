var config = require('./../config');

exports.index = function (req, res){
  res.send(config);
};
