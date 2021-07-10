var express = require('express')
var fs = require('fs')
var path = require('path')

var indexPath = path.join(__dirname, '..', 'public', 'index.html')

module.exports = function (baseUrl) {
  var router = express.Router()

  router.get('/', function (req, res) {
    fs.readFile(indexPath, 'utf-8', function (err, data) {
      if (err) {
        return res.status(404).send()
      }

      data = data.replace('<base href="/" />', '<base href="' + baseUrl + '" />')

      return res.send(data)
    })
  })

  return router
}
