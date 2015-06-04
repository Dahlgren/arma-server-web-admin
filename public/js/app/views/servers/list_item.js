define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      swal                = require('sweet-alert'),
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
      var self = this;
      sweetAlert({
        title: "Are you sure?",
        text: "Your server configuration will be deleted!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, delete it!",
      },
      function(){
        self.model.destroy();
      });
    },

    serverUpdated: function (event) {
      this.render();
    },
  });
});
