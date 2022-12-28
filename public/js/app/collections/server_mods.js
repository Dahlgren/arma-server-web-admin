var Backbone = require('backbone')

var ServerMod = require('app/models/server_mod')

module.exports = Backbone.Collection.extend({
  comparator: function (a, b) {
    return a.get('name').toLowerCase().localeCompare(b.get('name').toLowerCase())
  },
  model: ServerMod
})
