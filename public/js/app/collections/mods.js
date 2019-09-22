var Backbone = require('backbone')

var Mod = require('app/models/mod')

module.exports = Backbone.Collection.extend({
  comparator: 'name',
  model: Mod,
  url: '/api/mods/'
})
