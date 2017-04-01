var express = require('express');

module.exports = function (config) {
  var router = express.Router();

  router.get('/', function (req, res) {
    res.json(config);
  });

  return router;
};
