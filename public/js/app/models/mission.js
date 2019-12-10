var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  defaults: {
    name: ''
  },
  idAttribute: 'name',
  urlRoot: '/api/missions/'
})
