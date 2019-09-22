var Backbone = require('backbone')

var Parameter = require('app/models/parameter')

module.exports = Backbone.Collection.extend({
  model: Parameter
})
