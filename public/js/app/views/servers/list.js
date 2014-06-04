define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      AddServerView       = require('app/views/servers/add'),
      EmptyView           = require('app/views/servers/empty'),
      ListItemView        = require('app/views/servers/list_item'),
      tpl                 = require('text!tpl/servers/list.html'),

      template = _.template(tpl);

  return Marionette.CompositeView.extend({
    itemView: ListItemView,
    itemViewContainer: "tbody",
    template: template,

    emptyView: EmptyView,

    events: {
      "click #add-server": "addServer"
    },

    buildItemView: function(item, ItemViewType, itemViewOptions){
      // build the final list of options for the item view type
      var options = _.extend({model: item}, itemViewOptions);

      if (ItemViewType == EmptyView) {
        options = _.extend({servers: this.collection}, options);
      }

      // create the item view instance
      var view = new ItemViewType(options);
      // return it
      return view;
    },

    addServer: function () {
      var view = new AddServerView({servers: this.collection});
      new Backbone.BootstrapModal({ content: view, servers: this.collection }).open()
    },
  });
});
