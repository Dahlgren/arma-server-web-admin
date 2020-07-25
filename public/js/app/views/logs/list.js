var _ = require('underscore')
var Marionette = require('marionette')

var ListItemView = require('app/views/logs/list_item')
var tpl = require('tpl/logs/list.html')

var template = _.template(tpl)

module.exports = Marionette.CompositeView.extend({
  childView: ListItemView,
  childViewContainer: 'tbody',
  template: template
})
