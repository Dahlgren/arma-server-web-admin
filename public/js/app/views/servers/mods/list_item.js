var _ = require('underscore')

var ModListItemView = require('app/views/mods/list_item')
var tpl = require('tpl/servers/mods/list_item.html')

var template = _.template(tpl)

module.exports = ModListItemView.extend({
  tagName: 'tr',
  template: template,

  templateHelpers: function () {
    var modFile = this.model.get('modFile')
    var name = this.model.get('name')
    var steamMeta = this.model.get('steamMeta')

    var enabled = this.options.server.get('mods').indexOf(name) > -1
    var link = null
    var title = null

    if (steamMeta && steamMeta.id) {
      if (steamMeta.id) {
        link = 'https://steamcommunity.com/sharedfiles/filedetails/?id=' + steamMeta.id
      }

      if (steamMeta.name) {
        title = steamMeta.name
      }
    }

    if (modFile && modFile.name) {
      title = modFile.name
    }

    return {
      enabled: enabled,
      link: link,
      title: title
    }
  }
})
