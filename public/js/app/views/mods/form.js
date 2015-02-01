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

    events: {
      'submit': 'beforeSubmit',
    },

    template: _.template(tpl),

    initialize: function (options) {
      this.mods = options.mods;
      this.model = new Mod();
      this.bind('ok', this.submit);
      this.bind('shown', this.shown);
    },

    beforeSubmit: function(e) {
      e.preventDefault();
      this.submit();
    },

    shown: function (modal) {
      var $okBtn = modal.$el.find('.btn.ok');
      $okBtn.addClass('ladda-button').attr('data-style', 'expand-left');

      this.laddaBtn = Ladda.create($okBtn.get(0));

      this.$el.find('form .mod').focus();
    },

    submit: function (modal) {
      var self = this;
      var $form = $('form');

      if (modal) {
        self.modal.preventClose();
      }

      $form.find('.form-group').removeClass('has-error');
      $form.find('.help-block').text('');

      this.laddaBtn.start();
      self.modal.$el.find('.btn.cancel').addClass('disabled');

      this.model.save({ name: $form.find('.mod').val() }, {
        success: function () {
          self.laddaBtn.stop();
          self.modal.close();
        },
        error: function () {
          self.laddaBtn.stop();
          $form.find('.form-group').addClass('has-error');
          $form.find('.help-block').text('Problem downloading mod');
          self.modal.$el.find('.btn.cancel').removeClass('disabled');
        }
      });
    },
  });
});
