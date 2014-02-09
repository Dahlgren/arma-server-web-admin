define(function (require) {
  
  "use strict";
  
  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Server              = require('app/models/server');
  
  return Backbone.Collection.extend({
    model: Server,
    url: '/api/servers/'
  });
  
});