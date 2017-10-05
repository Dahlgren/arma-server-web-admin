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

    events: {
      "click #settings": "settings"
    },

    initialize: function (options) {
      this.servers = options.servers;
      this.serversListView = new ServersListView({ collection: this.servers })
    },

    onDomRefresh: function () {
      this.serversListView.setElement('#servers-list');
      this.serversListView.render();
    },

    settings: function (event) {
      event.preventDefault();
      var view = new SettingsView();
      new Backbone.BootstrapModal({ content: view, animate: true, cancelText: false }).open();
    }
  });

});
