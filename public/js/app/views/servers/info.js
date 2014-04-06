define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      tpl                 = require('text!tpl/servers/info.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    events: {
      "click #start": "start"
    },

    start: function (event) {
      var self = this;
      event.preventDefault();
      $.ajax({
        url: "/api/servers/" + this.model.get('id') + "/start",
        type: 'GET',
        success: function (resp) {
          console.log(resp);
        },
        error: $.noop
      });
    },
  });

});
