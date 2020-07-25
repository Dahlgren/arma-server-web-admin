var _ = require('underscore')
var Marionette = require('marionette')

var ListItemView = require('app/views/servers/missions/available/list_item')
var tpl = require('tpl/servers/missions/available/list.html')

module.exports = Marionette.CompositeView.extend({
  childView: ListItemView,
  childViewContainer: 'tbody',
  template: _.template(tpl),

  initialize: function (options) {
    this.filterValue = options.filterValue
  },

  filter: function (child, index, collection) {
    return child.get('name').toLowerCase().indexOf(this.filterValue.toLowerCase()) >= 0
  },

  buildChildView: function (item, ChildViewType, childViewOptions) {
    var self = this
    var options = _.extend({ model: item }, childViewOptions)
    var view = new ChildViewType(options)
    view.on('add', function (model) {
      self.trigger('add', model)
    })
    return view
  }
})
