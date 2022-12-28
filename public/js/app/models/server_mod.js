var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  defaults: {
    name: ''
  },
  idAttribute: 'name',
  isNew: function () {
    return true
  }
})
