var Backbone = require('backbone')

var MissionParameter = require('app/models/mission_parameter')

module.exports = Backbone.Collection.extend({
  model: MissionParameter
})
