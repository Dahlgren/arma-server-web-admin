define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      tpl                 = require('text!tpl/servers/parameters/list_item.html'),

      template = _.template(tpl);

  return Marionette.ItemView.extend({
    tagName: "tr",
    template: template,

    events: {
      "click button.delete": "delete",
      "change input#parameter": "changed",
    },

    changed: function (e) {
      var val = $(e.target).val();
      this.model.set(e.target.id, val);
    },

    delete: function (e) {
      e.preventDefault();
      this.model.destroy();
    },
  });
});
