var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  defaults: {
    name: '',
    formattedSize: '0 B',
    size: 0
  },
  idAttribute: 'name'
})
