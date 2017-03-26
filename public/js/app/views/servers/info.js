define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      swal                = require('sweet-alert'),
      tpl                 = require('text!tpl/servers/info.html');

  return Marionette.Layout.extend({
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
        type: 'POST',
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
      sweetAlert({
        title: "Are you sure?",
        text: "The server will stopped.",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-warning",
        confirmButtonText: "Yes, stop it!",
      },
      function(){
        $.ajax({
          url: "/api/servers/" + self.model.get('id') + "/stop",
          type: 'POST',
          success: function (resp) {
            self.model.set("pid", resp.pid);
            self.render();
          },
          error: $.noop
        });
      });
    },

    templateHelpers: function() {
      var self = this;
      return {
        mods: self.options.mods.filter(function (mod) {
          return self.model.get('mods').indexOf(mod.get('id')) >= 0;
        }).map(function (mod) {
          return mod.get('name');
        }),
      };
    },
  });
});
