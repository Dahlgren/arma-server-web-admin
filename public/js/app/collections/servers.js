var Backbone = require('backbone')

var Server = require('app/models/server')

module.exports = Backbone.Collection.extend({
  comparator: function (a, b) {
    return a.get('title').toLowerCase().localeCompare(b.get('title').toLowerCase())
  },
  model: Server,
  url: '/api/servers/'
})
