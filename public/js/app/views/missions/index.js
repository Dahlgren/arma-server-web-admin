var $ = require('jquery')
var _ = require('underscore')
var Marionette = require('marionette')

var UploadView = require('app/views/missions/upload')
var WorkshopView = require('app/views/missions/workshop')
var ListView = require('app/views/missions/list')
var tpl = require('tpl/missions/index.html')

module.exports = Marionette.LayoutView.extend({
  template: _.template(tpl),
  templateHelpers: function () {
    return {
      filterValue: this.filterValue
    }
  },

  regions: {
    uploadView: '#upload',
    workshopView: '#workshop',
    listView: '#list'
  },

  events: {
    'click #refresh': 'refresh',
    'keyup #filterMissions': 'updateFilter'
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
    this.uploadView.show(new UploadView())
    this.workshopView.show(new WorkshopView())
    this.listView.show(new ListView({ collection: this.options.missions, filterValue: this.filterValue }))
  },

  refresh: function (event) {
    event.preventDefault()
    $.ajax({
      url: '/api/missions/refresh',
      type: 'POST',
      success: function (resp) {

      },
      error: function (resp) {

      }
    })
  }
})
