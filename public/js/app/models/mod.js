var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  defaults: {
    id: '',
    name: ''
  },
  idAttribute: 'id',
  urlRoot: '/api/mods/'
})
