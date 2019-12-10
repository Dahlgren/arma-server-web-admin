var Backbone = require('backbone')

var MissionRotation = require('app/models/mission_rotation')

module.exports = Backbone.Collection.extend({
  model: MissionRotation
})
