define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      BootstrapModal      = require('backbone.bootstrap-modal'),
      ServersListView     = require('app/views/navigation/servers/list'),
      SettingsView        = require('app/views/settings'),
      tpl                 = require('text!tpl/navigation.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    templateHelpers: function() {
      return {
        isActiveRoute: function (route) {
          return Backbone.history.fragment === route ? 'active' : ''
        }
      }
    },

    events: {
      "click #settings": "settings"
    },

    initialize: function (options) {
      this.settings = options.settings;
      this.servers = options.servers;
      this.serversListView = new ServersListView({ collection: this.servers })
      Backbone.history.on('route', this.render);
    },

    onDomRefresh: function () {
      this.serversListView.setElement('#servers-list');
      this.serversListView.render();
    },

    settings: function (event) {
      event.preventDefault();
      var view = new SettingsView({ model: this.settings });
      new Backbone.BootstrapModal({ content: view, animate: true, cancelText: false }).open();
    }
  });

});
