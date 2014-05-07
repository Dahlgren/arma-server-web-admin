define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      ListItemView        = require('app/views/missions/list_item'),
      FormView            = require('app/views/missions/form'),
      tpl                 = require('text!tpl/missions/list.html'),

      template = _.template(tpl);

  return Marionette.CompositeView.extend({
    itemView: ListItemView,
    itemViewContainer: "tbody",
    template: template,

    events: {
      "click #upload": "upload"
    },

    upload: function (event) {
      event.preventDefault();
      var view = new FormView({missions: this.collection});
      new Backbone.BootstrapModal({ content: view, animate: true }).open()
    },
  });
});
