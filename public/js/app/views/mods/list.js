var _ = require('underscore')
var Marionette = require('marionette')

var ListItemView = require('app/views/mods/list_item')
var tpl = require('tpl/mods/list.html')

var template = _.template(tpl)

module.exports = Marionette.CompositeView.extend({
  childView: ListItemView,
  childViewContainer: 'tbody',
  template: template,

  initialize: function (options) {
    this.filterValue = options.filterValue
  },

  filter: function (child, index, collection) {
    var name = child.get('name').toLowerCase()

    if (name.indexOf(this.filterValue.toLowerCase()) >= 0) {
      return true
    }

    var modFile = child.get('modFile')
    if (modFile && modFile.name && modFile.name.toLowerCase().indexOf(this.filterValue.toLowerCase()) >= 0) {
      return true
    }

    var steamMeta = child.get('steamMeta')
    if (steamMeta && steamMeta.name && steamMeta.name.toLowerCase().indexOf(this.filterValue.toLowerCase()) >= 0) {
      return true
    }

    return false
  }
})
