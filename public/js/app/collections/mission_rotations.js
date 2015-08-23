define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      MissionRotation     = require('app/models/mission_rotation');
  
  return Backbone.Collection.extend({
    model: MissionRotation,
  });

});
