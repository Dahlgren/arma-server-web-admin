define(function (require) {
  
  "use strict";
  
  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Log                 = require('app/models/log');
  
  return Backbone.Collection.extend({
    model: Log,
    url: '/api/logs/'
  });
  
});
