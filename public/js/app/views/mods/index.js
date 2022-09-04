var $ = require('jquery')
var _ = require('underscore')
var Marionette = require('marionette')

var ListView = require('app/views/mods/list')
var tpl = require('tpl/mods/index.html')

var template = _.template(tpl)

module.exports = Marionette.LayoutView.extend({
  template: template,
  templateHelpers: function () {
    return {
      filterValue: this.filterValue
    }
  },

  regions: {
    listView: '#list'
  },

  events: {
    'click #refresh': 'refresh',
    'keyup #filterMods': 'updateFilter'
  },

  initialize: function () {
    this.filterValue = ''
  },

  updateFilter: function (event) {
    this.filterValue = event.target.value
    this.listView.currentView.filterValue = this.filterValue
    this.listView.currentView.render()
  },

  onRender: function () {
    this.listView.show(new ListView({ collection: this.options.mods, filterValue: this.filterValue }))
  },

  refresh: function (event) {
    event.preventDefault()
    $.ajax({
      url: '/api/mods/refresh',
      type: 'POST',
      success: function (resp) {

      },
      error: function (resp) {

      }
    })
  }
})
