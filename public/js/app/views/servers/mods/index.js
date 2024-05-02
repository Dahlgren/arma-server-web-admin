var _ = require('underscore')

var ServerMods = require('app/collections/server_mods')
var ModsView = require('app/views/mods/index')
var AvailableModsListView = require('app/views/servers/mods/available/list')
var SelectedModsListView = require('app/views/servers/mods/selected/list')
var tpl = require('tpl/servers/mods/index.html')

var template = _.template(tpl)

module.exports = ModsView.extend({
  template: template,

  regions: {
    availableView: '#available',
    selectedView: '#selected'
  },

  modelEvents: {
    change: 'serverUpdated'
  },

  initialize: function (options) {
    ModsView.prototype.initialize.call(this, options)

    this.selectedModsCollection = new ServerMods(this.serverMods())

    this.availableModsListView = new AvailableModsListView({
      collection: this.options.mods,
      selectedModsCollection: this.selectedModsCollection,
      filterValue: this.filterValue
    })
    this.selectedModsListView = new SelectedModsListView({
      collection: this.selectedModsCollection
    })

    this.listenTo(this.selectedModsCollection, 'update', this.availableModsListView.render)
  },

  updateFilter: function (event) {
    this.filterValue = event.target.value

    this.availableModsListView.filterValue = this.filterValue
    this.availableModsListView.render()
    this.selectedModsListView.filterValue = this.filterValue
    this.selectedModsListView.render()
  },

  onRender: function () {
    this.availableView.show(this.availableModsListView)
    this.selectedView.show(this.selectedModsListView)
  },

  serverMods: function () {
    return this.model.get('mods')
      .map(function (mod) {
        return {
          id: mod
        }
      })
  },

  serverUpdated: function () {
    this.selectedModsCollection.set(this.serverMods())
  },

  serialize: function () {
    this.selectedModsCollection.sort()
    return {
      mods: this.selectedModsCollection.toJSON()
        .map(function (mod) {
          return mod.id
        })
    }
  }
})
