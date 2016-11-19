define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Parameter           = require('app/models/parameter');

  return Backbone.Collection.extend({
    model: Parameter,
  });

});
