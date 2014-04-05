define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      tpl                 = require('text!tpl/missions/list_item.html'),

      template = _.template(tpl);

  return Marionette.ItemView.extend({
    tagName: "tr",
    template: template,

    events: {
      "click .delete": "delete"
    },

    delete: function (event) {
      var self = this;
      event.preventDefault();
      $.ajax({
        url: "/api/missions/" + this.model.get('name'),
        type: 'DELETE',
        success: function (resp) {
          self.model.destroy();
        },
        error: $.noop
      });
    },
  });
});
