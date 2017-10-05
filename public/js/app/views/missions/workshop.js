define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      Ladda               = require('ladda'),
      IframeTransport     = require('jquery.iframe-transport'),
      Mission             = require('app/models/mission'),
      tpl                 = require('text!tpl/missions/workshop.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    events: {
      'click form button': 'submit',
    },

    initialize: function (options) {
      this.missions = options.missions;
    },

    submit: function () {
      var self = this;
      var $form = this.$el.find('form');

      var $downloadBtn = $form.find('button[type=submit]');
      var laddaBtn = Ladda.create($downloadBtn.get(0));
      laddaBtn.start();

      $.ajax({
        url: '/api/missions/workshop',
        type: 'POST',
        data: {
          id: $form.find("input.workshop").val(),
        },
        dataType: 'json',
        success: function (data) {
          self.missions.fetch({success : function () {
            laddaBtn.stop();
            self.render();
          }});
        },
        error: function () {
          laddaBtn.stop();
        },
      });
    },
  });
});
