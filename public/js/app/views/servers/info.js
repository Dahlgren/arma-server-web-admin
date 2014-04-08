define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      GamespyView         = require('app/views/servers/gamespy'),
      tpl                 = require('text!tpl/servers/info.html');

  return Marionette.Layout.extend({
    template: _.template(tpl),

    regions: {
      gamespyView: "#gamespy",
    },

    events: {
      "click #start": "start",
      "click #stop": "stop",
    },

    onRender: function() {
      this.gamespyView.show(new GamespyView({server: this.model}));
    },

    start: function (event) {
      var self = this;
      event.preventDefault();
      $.ajax({
        url: "/api/servers/" + this.model.get('id') + "/start",
        type: 'GET',
        success: function (resp) {
          self.model.set("pid", resp.pid);
          self.render();
        },
        error: $.noop
      });
    },

    stop: function (event) {
      var self = this;
      event.preventDefault();
      $.ajax({
        url: "/api/servers/" + this.model.get('id') + "/stop",
        type: 'GET',
        success: function (resp) {
          self.model.set("pid", resp.pid);
          self.render();
        },
        error: $.noop
      });
    },
  });

});
