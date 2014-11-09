define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      Mods                = require('app/collections/mods'),
      InfoView            = require('app/views/servers/info'),
      ModsListView        = require('app/views/servers/mods/list'),
      PlayersView         = require('app/views/servers/players'),
      tpl                 = require('text!tpl/servers/view.html');

  return Marionette.Layout.extend({
    template: _.template(tpl),

    regions: {
      infoView: "#tab-info",
      modsView: "#tab-mods",
      playersView: "#tab-players",
      settings: "#tab-settings",
    },

    events: {
      "click .nav-tabs a" : "tabs",
    },

    modelEvents: {
      "change": "serverUpdated",
    },

    initialize: function (options) {
      this.mods = options.mods;
    },

    onRender: function() {
      this.infoView.show(new InfoView({model: this.model}));
      this.modsView.show(new ModsListView({collection: this.mods, server: this.model}));
      this.playersView.show(new PlayersView({model: this.model}));
    },

    serverUpdated: function() {
      this.infoView.currentView.render();
      this.modsView.currentView.render();
      this.playersView.currentView.render();
    },

    tabs: function(e) {
      e.preventDefault()
      $($(e.target).attr('href')).tab('show')
    },
  });

});
