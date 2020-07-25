var _ = require('underscore')
var Backbone = require('backbone')
var Marionette = require('marionette')

var Server = require('app/models/server')
var AddServerView = require('app/views/servers/form')
var EmptyView = require('app/views/servers/empty')
var ListItemView = require('app/views/servers/list_item')
var tpl = require('tpl/servers/list.html')

var template = _.template(tpl)

module.exports = Marionette.CompositeView.extend({
  childView: ListItemView,
  childViewContainer: 'tbody',
  template: template,

  emptyView: EmptyView,

  events: {
    'click #add-server': 'addServer'
  },

  buildChildView: function (item, ChildViewType, childViewOptions) {
    // build the final list of options for the item view type
    var options = _.extend({ model: item }, childViewOptions)

    if (ChildViewType === EmptyView) {
      options = _.extend({ servers: this.collection }, options)
    }

    // create the item view instance
    var view = new ChildViewType(options)
    // return it
    return view
  },

  addServer: function () {
    var view = new AddServerView({ model: new Server(), servers: this.collection })
    new Backbone.BootstrapModal({ content: view, servers: this.collection }).open()
  }
})
