var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  defaults: {
    path: '',
    type: ''
  },
  urlRoot: '/api/settings'
})
