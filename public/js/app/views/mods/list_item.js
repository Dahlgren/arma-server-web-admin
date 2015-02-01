define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      Ladda               = require('ladda'),
      tpl                 = require('text!tpl/mods/list_item.html'),

      template = _.template(tpl);

  return Marionette.ItemView.extend({
    tagName: "tr",
    template: template,

    events: {
      "click .update": "update"
    },

    update: function (event) {
      var self = this;
      event.preventDefault();

      this.laddaBtn = Ladda.create(this.$el.find(".ladda-button").get(0));
      this.laddaBtn.start();
      this.$el.find('.ladda-button').addClass('disabled');

      $.ajax({
        url: "/api/mods/" + this.model.get('name'),
        type: 'PUT',
        success: function (resp) {
          self.laddaBtn.stop();
          self.$el.find('.ladda-button').removeClass('disabled');
        },
        error: function (resp) {
          self.laddaBtn.stop();
          self.$el.find('.ladda-button').removeClass('disabled');
        },
      });
    },
  });
});
