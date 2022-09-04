var _ = require('underscore')

var ModsView = require('app/views/mods/index')
var ListView = require('app/views/servers/mods/list')
var tpl = require('tpl/servers/mods/index.html')

var template = _.template(tpl)

module.exports = ModsView.extend({
  template: template,

  modelEvents: {
    change: 'serverUpdated'
  },

  initialize: function (options) {
    ModsView.prototype.initialize.call(this, options)
    this.modsListView = new ListView({
      collection: this.options.mods,
      server: this.options.server,
      filterValue: this.filterValue
    })
  },

  serverUpdated: function () {
    this.modsListView.render()
  },

  serialize: function () {
    return this.modsListView.serialize()
  }
})
