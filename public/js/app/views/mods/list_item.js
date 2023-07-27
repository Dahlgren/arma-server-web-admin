var _ = require('underscore')
var Marionette = require('marionette')
var sweetAlert = require('sweet-alert')

var tpl = require('tpl/mods/list_item.html')

var template = _.template(tpl)

module.exports = Marionette.ItemView.extend({
  tagName: 'tr',
  template: template,

  events: {
    'click .destroy': 'deleteMod'
  },

  templateHelpers: function () {
    var modFile = this.model.get('modFile')
    var steamMeta = this.model.get('steamMeta')

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

    var id = this.model.get('id')
    var name = this.model.get('name')
    if (id !== name) {
      title = name
      link = 'https://reforger.armaplatform.com/workshop/' + id
    }

    return {
      link: link,
      title: title
    }
  },

  deleteMod: function (event) {
    var self = this
    sweetAlert({
      title: 'Are you sure?',
      text: 'The mod will be deleted from the server!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, delete it!'
    },
    function () {
      self.model.destroy()
    })
  }
})
