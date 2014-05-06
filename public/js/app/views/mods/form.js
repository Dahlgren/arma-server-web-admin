define(function (require) {

  'use strict';

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      FormView            = require('marionette-formview'),
      Mod                 = require('app/models/mod'),
      tpl                 = require('text!tpl/mods/form.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    initialize: function (options) {
      this.mods = options.mods;
      this.model = new Mod();
      this.bind('ok', this.submit);
    },

    submit: function (modal) {
      var self = this;
      var $form = $('form');

      modal.preventClose();

      $form.find('.form-group').removeClass('has-error');
      $form.find('.help-block').text('');

      this.model.save({ name: $form.find('.mod').val() }, {
        success: function () {
          self.mods.fetch({
            success : function () {
              modal.close();
            }
          });
        },
        error: function () {
          $form.find('.form-group').addClass('has-error');
          $form.find('.help-block').text('Problem downloading mod');
        }
      });
    },
  });
});
