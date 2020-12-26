var _ = require('underscore')
var Marionette = require('marionette')

var MissionParameter = require('app/models/mission_parameter')
var ListItemView = require('app/views/servers/missions/parameters/list_item')
var tpl = require('tpl/servers/missions/parameters/list.html')

module.exports = Marionette.CompositeView.extend({
  childView: ListItemView,
  childViewContainer: 'tbody',
  template: _.template(tpl),

  events: {
    'click .add-parameter': 'addParameter'
  },

  childViewOptions: function (model, index) {
    return {
      index: index
    }
  },

  addParameter: function (e) {
    e.preventDefault()
    this.collection.add(new MissionParameter())
  }
})
