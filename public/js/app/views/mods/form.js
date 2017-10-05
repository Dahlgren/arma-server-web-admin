define(function (require) {

  'use strict';

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      ListItemView        = require('app/views/mods/search/list_item'),
      Ladda               = require('ladda'),
      Mods                = require('app/collections/mods'),
      tpl                 = require('text!tpl/mods/form.html');

  return Marionette.CompositeView.extend({

    events: {
      'submit': 'beforeSubmit',
    },

    itemView: ListItemView,
    itemViewContainer: "tbody",
    template: _.template(tpl),

    initialize: function (options) {
      this.mods = options.mods;
      this.collection = new Mods();
      this.bind('ok', this.submit);
      this.bind('shown', this.shown);

      var self = this;
      this.listenTo(this.mods, "change reset add remove", function () {
        self.collection.trigger('reset');
      });
    },

    itemViewOptions: function(options) {
      options.set('mods', this.mods);
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
      var $form = this.$el.find('form');

      if (modal) {
        self.modal.preventClose();
      }

      $form.find('.form-group').removeClass('has-error');
      $form.find('.help-block').text('');

      this.laddaBtn.start();
      self.modal.$el.find('.btn.cancel').addClass('disabled');

      $.ajax({
        url: '/api/mods/search',
        type: 'POST',
        data: {
          query: $form.find('.query').val()
        },
        dataType: 'json',
        success: function (data) {
          self.laddaBtn.stop();
          self.modal.$el.find('.btn.cancel').removeClass('disabled');
          self.collection.set(data);
        },
        error: function () {
          self.laddaBtn.stop();
          $form.find('.form-group').addClass('has-error');
          $form.find('.help-block').text('Problem searching, try again');
          self.modal.$el.find('.btn.cancel').removeClass('disabled');
        }
      });
    },
  });
});
