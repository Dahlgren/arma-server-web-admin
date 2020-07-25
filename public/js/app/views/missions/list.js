var _ = require('underscore')
var Marionette = require('marionette')

var ListItemView = require('app/views/missions/list_item')
var tpl = require('tpl/missions/list.html')

var template = _.template(tpl)

module.exports = Marionette.CompositeView.extend({
  childView: ListItemView,
  childViewContainer: 'tbody',
  template: template,

  initialize: function (options) {
    this.filterValue = options.filterValue
  },

  filter: function (child, index, collection) {
    return child.get('name').toLowerCase().indexOf(this.filterValue.toLowerCase()) >= 0
  }
})
