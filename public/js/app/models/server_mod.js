var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  defaults: {
    id: '',
    name: ''
  },
  idAttribute: 'id',
  isNew: function () {
    return true
  }
})
