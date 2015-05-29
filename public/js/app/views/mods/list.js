define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      ListItemView        = require('app/views/mods/list_item'),
      FormView            = require('app/views/mods/form'),
      tpl                 = require('text!tpl/mods/list.html'),

      template = _.template(tpl);

  return Marionette.CompositeView.extend({
    itemView: ListItemView,
    itemViewContainer: "tbody",
    template: template,

    events: {
      "click #download": "download",
      "click #refresh": "refresh",
    },

    initialize: function (options) {
      this.listenTo(this.collection, "change reset", this.render);
    },

    download: function (event) {
      event.preventDefault();
      var view = new FormView({mods: this.collection});
      var modal = new Backbone.BootstrapModal({
        content: view,
        animate: true,
        cancelText: 'Close',
        okText: 'Search',
      });
      view.modal = modal;
      modal.open();
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
