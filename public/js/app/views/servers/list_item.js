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
      "click .clone": "clone",
      "click .delete": "delete",
      "click .stop": "stop",
      "click .start": "start",
    },

    modelEvents: {
      "change": "serverUpdated",
    },

    clone: function (e) {
      var title = this.model.get('title') + ' Clone';
      var clone = this.model.clone();
      clone.set({id: null, title: title});
      clone.save();
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


    start: function (event) {
      var self = this;
      event.preventDefault();
      $.ajax({
        url: "/api/servers/" + this.model.get('id') + "/start",
        type: 'POST',
        success: function (resp) {
          self.model.set("pid", resp.pid);
          self.render();
        },
        error: $.noop
      });
    },

    stop: function (event) {
      var self = this;
      event.preventDefault();
      sweetAlert({
          title: "Are you sure?",
          text: "The server will stopped.",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-warning",
          confirmButtonText: "Yes, stop it!",
        },
        function(){
          $.ajax({
            url: "/api/servers/" + self.model.get('id') + "/stop",
            type: 'POST',
            success: function (resp) {
              self.model.set("pid", resp.pid);
              self.render();
            },
            error: $.noop
          });
        });
    },

    serverUpdated: function (event) {
      this.render();
    },
  });
});
