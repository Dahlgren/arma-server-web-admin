define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
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
      $.ajax({
        url: "/api/mods/" + this.model.get('name'),
        type: 'PUT',
        success: function (resp) {
          self.trigger("mods:update", mods);
        },
        error: $.noop
      });
    },
  });
});
