var Backbone = require('backbone')

var Mission = require('app/models/mission')

module.exports = Backbone.Collection.extend({
  comparator: function (a, b) {
    return a.get('name').toLowerCase().localeCompare(b.get('name').toLowerCase())
  },
  model: Mission,
  url: '/api/missions/'
})
