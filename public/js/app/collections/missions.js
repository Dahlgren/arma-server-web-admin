var Backbone = require('backbone')

var Mission = require('app/models/mission')

module.exports = Backbone.Collection.extend({
  comparator: 'name',
  model: Mission,
  url: '/api/missions/'
})
