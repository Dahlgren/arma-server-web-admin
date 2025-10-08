var Backbone = require('backbone')

var ServerMod = require('app/models/server_mod')

module.exports = Backbone.Collection.extend({
  comparator: function (a, b) {
    return a.get('id').toLowerCase().localeCompare(b.get('id').toLowerCase())
  },
  model: ServerMod
})
