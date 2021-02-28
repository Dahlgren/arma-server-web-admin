var Backbone = require('backbone')

var Log = require('app/models/log')

module.exports = Backbone.Collection.extend({
  comparator: function (a, b) {
    return b.get('created').localeCompare(a.get('created')) // Descending order
  },
  model: Log,
  url: '/api/logs/'
})
