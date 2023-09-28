var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  defaults: {
    path: '',
    modsPath: '',
    type: ''
  },
  urlRoot: '/api/settings'
})
