var path = require('path');
var SteamWorkshop = require('steam-workshop');

var config = require('./../config');

exports.mission = function(req, res){
  var outputFolder = path.join(config.path, 'mpmissions');
  var steamWorkshop = new SteamWorkshop(outputFolder);
  steamWorkshop.downloadFile(req.body.id, function (err, files) {
    if (err) {
      res.json(500, {success: false});
    } else {
      res.json({success: true});
    }
  });
};
