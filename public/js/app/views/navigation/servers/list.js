var Marionette = require('marionette')

var ListItemView = require('app/views/navigation/servers/list_item')

module.exports = Marionette.CollectionView.extend({
  tagName: 'ul',
  childView: ListItemView
})
