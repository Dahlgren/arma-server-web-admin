define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Mission             = require('app/models/mission');

  return Backbone.Collection.extend({
    comparator: 'name',
    model: Mission,
    url: '/api/missions/'
  });

});
