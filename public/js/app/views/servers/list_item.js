define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      tpl                 = require('text!tpl/servers/list_item.html'),

      template = _.template(tpl);

  return Marionette.ItemView.extend({
    tagName: "tr",
    template: template,

    events: {
      "click .delete": "delete"
    },

    modelEvents: {
      "change": "serverUpdated",
    },

    delete: function (event) {
      this.model.destroy({wait: true});
    },

    serverUpdated: function (event) {
      this.render();
    },
  });
});
