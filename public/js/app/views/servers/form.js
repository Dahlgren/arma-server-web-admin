define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      FormView            = require('marionette-formview'),
      tpl                 = require('text!tpl/servers/form.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    initialize: function (options) {
      this.servers = options.servers;
      this.bind("ok", this.submit);
    },

    serialize : function() {
      return {
        admin_password: this.$("form .admin-password").val(),
        auto_start: this.$("form .auto-start").prop("checked"),
        battle_eye: this.$("form .battle-eye").prop("checked"),
        headless: this.$("form .headless").prop("checked"),
        max_players: this.$("form .max-players").val(),
        password: this.$("form .password").val(),
        persistent: this.$("form .persistent").prop("checked"),
        port: this.$("form .port").val(),
        title: this.$("form .title").val(),
        von: this.$("form .von").prop("checked"),
      };
    },

    submit: function (modal) {
      modal.preventClose();

      this.model.set(this.serialize());

      var self = this;

      this.model.save({}, {
        success: function() {
          modal.close();
          self.servers.fetch({success : function () {
            Backbone.history.navigate('#servers/' + self.model.get('id'), true);
          }});
        },
        error: function() {
          alert("Error :(");
        }
      });
    }
  });

});
