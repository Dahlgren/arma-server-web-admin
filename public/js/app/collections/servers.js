define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Server              = require('app/models/server');

  return Backbone.Collection.extend({
    comparator: function (a, b) {
      return a.get('title').toLowerCase().localeCompare(b.get('title').toLowerCase());
    },
    model: Server,
    url: '/api/servers/'
  });

});
