var $ = require('jquery')
var _ = require('underscore')
var Marionette = require('marionette')

var MissionParameters = require('app/collections/mission_parameters')
var ParametersListView = require('app/views/servers/missions/parameters/list')
var tpl = require('tpl/servers/missions/rotation/list_item.html')

var template = _.template(tpl)

module.exports = Marionette.LayoutView.extend({
  tagName: 'tr',
  template: template,

  events: {
    'click button.delete': 'delete',
    'change select#difficulty': 'changed',
    'change input#name': 'changed'
  },

  regions: {
    parametersView: '.parameters'
  },

  initialize: function (options) {
    this.parametersCollection = new MissionParameters(this.model.get('params'))
    this.parametersCollection.on('all', this.updateMissionParameters, this)
    this.parametersListView = new ParametersListView({ collection: this.parametersCollection })
  },

  updateMissionParameters: function () {
    this.model.set('params', this.parametersCollection.toJSON())
  },

  changed: function (e) {
    var val = $(e.target).val()
    this.model.set(e.target.id, val)
  },

  delete: function (e) {
    e.preventDefault()
    this.model.destroy()
  },

  onRender: function () {
    this.parametersView.show(this.parametersListView)
    var difficulty = this.model.get('difficulty')
    var $option = this.$el.find("#difficulty option[value='" + difficulty + "']")
    $option.attr('selected', 'selected')
  }
})
