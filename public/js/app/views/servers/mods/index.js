var _ = require('underscore')

var ModsView = require('app/views/mods/index')
var ListView = require('app/views/servers/mods/list')
var tpl = require('tpl/servers/mods/index.html')

var template = _.template(tpl)

module.exports = ModsView.extend({
  template: template,

  onRender: function () {
    this.listView.show(new ListView({
      collection: this.options.mods,
      server: this.options.server,
      filterValue: this.filterValue
    }))
  }
})
