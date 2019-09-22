var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  defaults: {
    name: '',
    difficulty: 'recruit'
  }
})
