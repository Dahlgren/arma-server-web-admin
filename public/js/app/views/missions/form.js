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
      tpl                 = require('text!tpl/missions/form.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    initialize: function (options) {
      this.missions = options.missions;
      this.model = new Mission();
      this.bind("ok", this.submit);
      this.bind('shown', this.shown);
    },

    shown: function (modal) {
      var $okBtn = modal.$el.find('.btn.ok');
      $okBtn.addClass('ladda-button').attr('data-style', 'expand-left');

      this.laddaBtn = Ladda.create($okBtn.get(0));
    },

    submit: function (modal) {
      var self = this;
      var $form = $('form');

      modal.preventClose();

      $form.find('.form-group').removeClass('has-error');
      $form.find('.help-block').text('');

      this.laddaBtn.start();
      modal.$el.find('.btn.cancel').addClass('disabled');

      $.ajax("/api/missions", {
        files: $form.find(":file"),
        iframe: true
      }).complete(function(data) {
        self.missions.fetch({success : function () {
          self.laddaBtn.stop();
          modal.close();
        }});
      });
    },
  });
});
