var Backbone = require('backbone')

var Mission = require('app/models/mission')

module.exports = Backbone.Collection.extend({
  comparator: function(item) { item.get('name').toLowerCase() },
  model: Mission,
  url: '/api/missions/'
})
