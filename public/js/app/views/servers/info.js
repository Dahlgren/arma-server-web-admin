define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      tpl                 = require('text!tpl/servers/info.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    events: {
      "click #start": "start",
      "click #stop": "stop",
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
