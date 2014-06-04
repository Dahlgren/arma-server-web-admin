define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      tpl                 = require('text!tpl/servers/empty.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    initialize: function (options) {
      this.servers = options.servers;
    },
  });

});
