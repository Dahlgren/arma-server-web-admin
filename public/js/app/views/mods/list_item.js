define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      Ladda               = require('ladda'),
      swal                = require('sweet-alert'),
      tpl                 = require('text!tpl/mods/list_item.html'),

      template = _.template(tpl);

  return Marionette.ItemView.extend({
    tagName: "tr",
    template: template,

    events: {
      "click .destroy": "destroy",
      "click .update": "update",
    },

    destroy: function (event) {
      var self = this;
      sweetAlert({
        title: "Are you sure?",
        text: "The mod will be deleted from the server!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, delete it!",
      },
      function(){
        self.model.destroy();
      });
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
