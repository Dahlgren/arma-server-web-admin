var Backbone = require('backbone')

var Mod = require('app/models/mod')

module.exports = Backbone.Collection.extend({
  comparator: function (a, b) {
    return a.get('name').localeCompare(b.get('name'))
  },
  model: Mod,
  url: '/api/mods/'
})
