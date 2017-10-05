define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      Server              = require('app/models/server'),
      AddServerView       = require('app/views/servers/form'),
      EmptyView           = require('app/views/servers/empty'),
      ListItemView        = require('app/views/servers/list_item'),
      tpl                 = require('text!tpl/servers/list.html'),

      template = _.template(tpl);

  return Marionette.CompositeView.extend({
    childView: ListItemView,
    childViewContainer: "tbody",
    template: template,

    emptyView: EmptyView,

    events: {
      "click #add-server": "addServer"
    },

    buildChildView: function(item, ChildViewType, childViewOptions){
      // build the final list of options for the item view type
      var options = _.extend({model: item}, childViewOptions);

      if (ChildViewType == EmptyView) {
        options = _.extend({servers: this.collection}, options);
      }

      // create the item view instance
      var view = new ChildViewType(options);
      // return it
      return view;
    },

    addServer: function () {
      var view = new AddServerView({model: new Server(), servers: this.collection});
      new Backbone.BootstrapModal({ content: view, servers: this.collection }).open()
    },
  });
});
