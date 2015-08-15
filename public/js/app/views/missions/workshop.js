define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      FormView            = require('marionette-formview'),
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

    onShow: function () {
      var $okBtn = this.$el.find('form button[type=submit]');
      $okBtn.addClass('ladda-button').attr('data-style', 'expand-left');

      this.laddaBtn = Ladda.create($okBtn.get(0));
    },

    submit: function () {
      var self = this;
      var $form = this.$el.find('form');

      this.laddaBtn.start();

      $.ajax({
        url: '/api/missions/workshop',
        type: 'POST',
        data: {
          id: $form.find("input.workshop").val(),
        },
        dataType: 'json',
        success: function (data) {
          self.missions.fetch({success : function () {
            self.laddaBtn.stop();
            self.render();
          }});
        },
        error: function () {
          self.laddaBtn.stop();
        },
      });
    },
  });
});
