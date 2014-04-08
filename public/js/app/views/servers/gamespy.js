define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      Gamespy             = require('app/models/gamespy'),
      tpl                 = require('text!tpl/servers/gamespy.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    initialize: function (options) {
      this.model = new Gamespy({running: false}, {server: options.server});

      this.clockInterval = this.startUpdating();
      this.refresh();
    },

    onBeforeClose: function(){
      this.stopUpdating();

      return true;
    },

    refresh: function () {
      this.model.unset("error");
      if (this.options.server.get("pid")) {
        var self = this;
        this.model.fetch({
          success: function() {
            self.model.set("running", true);
            self.render();
          }
        });
      } else {
        this.model.set("running", false)
      }
    },

    startUpdating: function(){
      return setInterval(
        this.refresh.bind(this),
        5000
      )
    },

    stopUpdating: function(){
      clearInterval(this.clockInterval);
    },
  });

});
