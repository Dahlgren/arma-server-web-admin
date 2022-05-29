var Backbone = require('backbone')

var Mission = require('app/models/mission')

module.exports = Backbone.Collection.extend({
  comparator: function (a, b) {
    return a.get('missionName').toLowerCase().localeCompare(b.get('missionName').toLowerCase())
  },
  model: Mission,
  url: '/api/missions/'
})
