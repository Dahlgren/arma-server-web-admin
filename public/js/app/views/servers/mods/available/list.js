var _ = require('underscore')

var ModsListView = require('app/views/mods/list')
var ListItemView = require('app/views/servers/mods/available/list_item')
var tpl = require('tpl/servers/mods/available/list.html')

module.exports = ModsListView.extend({
  childView: ListItemView,
  template: _.template(tpl),

  buildChildView: function (item, ChildViewType, childViewOptions) {
    var options = _.extend({ model: item, selectedModsCollection: this.options.selectedModsCollection }, childViewOptions)
    var view = new ChildViewType(options)
    return view
  }
})
