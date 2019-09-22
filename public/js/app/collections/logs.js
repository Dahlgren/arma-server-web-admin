var Backbone = require('backbone')

var Log = require('app/models/log')

module.exports = Backbone.Collection.extend({
  comparator: 'name',
  model: Log,
  url: '/api/logs/'
})
