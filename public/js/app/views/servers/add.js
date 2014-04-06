define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      FormView            = require('marionette-formview'),
      Server              = require('app/models/server'),
      tpl                 = require('text!tpl/servers/add.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    initialize: function (options) {
      this.servers = options.servers;
      this.model = new Server();
      this.bind("ok", this.submit);
    },

    submit: function (modal) {
      modal.preventClose();

      this.model.set('title', $("form #title").val());

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
