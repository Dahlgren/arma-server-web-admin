var Backbone = require('backbone')

var Mod = require('app/models/mod')

module.exports = Backbone.Collection.extend({
  comparator: function (a, b) {
    return a.get('name').toLowerCase().localeCompare(b.get('name').toLowerCase())
  },
  model: Mod,
  url: '/api/mods/'
})
