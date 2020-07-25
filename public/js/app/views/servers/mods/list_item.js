var _ = require('underscore')

var ModListItemView = require('app/views/mods/list_item')
var tpl = require('tpl/servers/mods/list_item.html')

var template = _.template(tpl)

module.exports = ModListItemView.extend({
  tagName: 'tr',
  template: template,

  templateHelpers: function () {
    return {
      enabled: this.options.server.get('mods').indexOf(this.model.get('name')) > -1
    }
  }
})
