var Backbone = require('backbone')

var Mod = require('app/models/mod')

module.exports = Backbone.Collection.extend({
  comparator: function(item) { item.get('name').toLowerCase() },
  model: Mod,
  url: '/api/mods/'
})
