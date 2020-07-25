var $ = require('jquery')
var _ = require('underscore')
var Backbone = require('backbone')
var Marionette = require('marionette')
var sweetAlert = require('sweet-alert')

var FormView = require('app/views/servers/form')
var InfoView = require('app/views/servers/info')
var MissionsView = require('app/views/servers/missions/index')
var ModsListView = require('app/views/servers/mods/list')
var ParametersListView = require('app/views/servers/parameters/list')
var PlayersView = require('app/views/servers/players')
var tpl = require('tpl/servers/view.html')

module.exports = Marionette.LayoutView.extend({
  template: _.template(tpl),

  regions: {
    infoView: '#tab-info',
    missionsView: '#tab-missions',
    modsView: '#tab-mods',
    parametersView: '#parameters',
    playersView: '#tab-players',
    settingsView: '#settings'
  },

  events: {
    'click .nav-tabs a': 'tabs',
    submit: 'save'
  },

  modelEvents: {
    change: 'serverUpdated'
  },

  initialize: function (options) {
    this.missions = options.missions
    this.mods = options.mods
  },

  onRender: function () {
    this.infoView.show(new InfoView({ model: this.model }))
    this.missionsView.show(new MissionsView({ missions: this.missions, model: this.model }))
    this.modsView.show(new ModsListView({ collection: this.mods, server: this.model }))
    this.parametersView.show(new ParametersListView({ model: this.model }))
    this.playersView.show(new PlayersView({ model: this.model }))
    this.settingsView.show(new FormView({ model: this.model }))
  },

  serverUpdated: function () {
    this.infoView.currentView.render()
    this.modsView.currentView.render()
    this.parametersView.currentView.render()
    this.playersView.currentView.render()
    this.settingsView.currentView.render()
  },

  save: function (e) {
    e.preventDefault()
    var self = this
    var oldId = this.model.get('id')
    var data = this.settingsView.currentView.serialize()
    _.extend(data, this.missionsView.currentView.serialize())
    _.extend(data, this.modsView.currentView.serialize())
    _.extend(data, this.parametersView.currentView.serialize())
    this.model.save(data, {
      success: function () {
        var newId = self.model.get('id')
        if (oldId !== newId) {
          Backbone.history.navigate('#servers/' + newId, true)
        } else {
          self.serverUpdated()
        }
      },
      error: function (model, response) {
        sweetAlert({
          title: 'Error',
          text: 'An error occurred, please consult the logs',
          type: 'error'
        })
      }
    })
  },

  tabs: function (e) {
    e.preventDefault()
    $($(e.target).attr('href')).tab('show')
  }
})
