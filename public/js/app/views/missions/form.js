define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      FormView            = require('marionette-formview'),
      IframeTransport     = require('jquery.iframe-transport'),
      Mission             = require('app/models/mission'),
      tpl                 = require('text!tpl/missions/form.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    initialize: function (options) {
      this.missions = options.missions;
      this.model = new Mission();
      this.bind("ok", this.submit);
    },

    submit: function (modal) {
      var self = this;

      modal.preventClose();

      var $form = $("form");
      $.ajax("/api/missions", {
        files: $form.find(":file"),
        iframe: true
      }).complete(function(data) {
        modal.close();
        self.missions.fetch({success : function () {
          Backbone.history.navigate('#missions', true);
        }});
      });
    },
  });
});
