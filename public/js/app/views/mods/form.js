define(function (require) {

  'use strict';

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      FormView            = require('marionette-formview'),
      Ladda               = require('ladda'),
      Mod                 = require('app/models/mod'),
      tpl                 = require('text!tpl/mods/form.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    initialize: function (options) {
      this.mods = options.mods;
      this.model = new Mod();
      this.bind('ok', this.submit);
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

      this.model.save({ name: $form.find('.mod').val() }, {
        success: function () {
          self.mods.fetch({
            success : function () {
              self.laddaBtn.stop();
              modal.close();
            }
          });
        },
        error: function () {
          self.laddaBtn.stop();
          $form.find('.form-group').addClass('has-error');
          $form.find('.help-block').text('Problem downloading mod');
          modal.$el.find('.btn.cancel').removeClass('disabled');
        }
      });
    },
  });
});
