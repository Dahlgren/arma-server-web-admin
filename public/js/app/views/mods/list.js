define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      ListItemView        = require('app/views/mods/list_item'),
      tpl                 = require('text!tpl/mods/list.html'),

      template = _.template(tpl);

  return Marionette.CompositeView.extend({
    itemView: ListItemView,
    itemViewContainer: "tbody",
    template: template,

    events: {
      "click #refresh": "refresh",
    },

    initialize: function (options) {
      this.listenTo(this.collection, "change reset", this.render);
    },

    refresh: function (event) {
      event.preventDefault();
      $.ajax({
        url: "/api/mods/refresh",
        type: 'POST',
        success: function (resp) {

        },
        error: function (resp) {

        },
      });
    },
  });
});
