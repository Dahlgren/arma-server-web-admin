define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone');

  return Backbone.Model.extend({
    defaults: {
      id: '',
      name: '',
      path: '',
    },
    idAttribute: 'id',
    urlRoot: '/api/mods/',
  });

});
