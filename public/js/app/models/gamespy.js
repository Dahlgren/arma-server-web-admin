define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone');

  return Backbone.Model.extend({
    initialize: function(attributes, options) {
      this.server = options.server;
    },

    url : function(){
      return this.server.url() + '/gamespy';
    }
  });

});
