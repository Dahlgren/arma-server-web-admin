define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      AddServerView       = require('app/views/servers/add'),
      tpl                 = require('text!tpl/servers/empty.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    events: {
      "click #add-server": "addServer"
    },

    initialize: function (options) {
      this.servers = options.servers;
    },

    addServer: function () {
      var view = new AddServerView({servers: this.servers});
      new Backbone.BootstrapModal({ content: view, servers: this.servers }).open()
    },
  });

});
