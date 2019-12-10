var $ = require('jquery')
var _ = require('underscore')

var ModsListView = require('app/views/mods/list')
var ListItemView = require('app/views/servers/mods/list_item')
var tpl = require('tpl/servers/mods/list.html')

module.exports = ModsListView.extend({
  childView: ListItemView,
  template: _.template(tpl),

  events: {
    'click .check-all': 'checkAll',
    'click .uncheck-all': 'uncheckAll'
  },

  buildChildView: function (item, ChildViewType, childViewOptions) {
    var options = _.extend({ model: item, server: this.options.server }, childViewOptions)
    var view = new ChildViewType(options)
    return view
  },

  changeAllCheckbox: function (checked) {
    this.$('input:checkbox').map(function (idx, el) {
      return $(el).prop('checked', checked)
    })
  },

  checkAll: function (e) {
    e.preventDefault()
    this.changeAllCheckbox(true)
  },

  uncheckAll: function (e) {
    e.preventDefault()
    this.changeAllCheckbox(false)
  },

  serialize: function () {
    return {
      mods: this.$('input:checkbox:checked').map(function (idx, el) {
        return $(el).val()
      }).get()
    }
  }
})
