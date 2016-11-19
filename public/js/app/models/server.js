define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone');

  return Backbone.Model.extend({
    defaults: {
      admin_password: '',
      battle_eye: false,
      headless: false,
      max_players: null,
      mods: [],
      parameters: [],
      password: '',
      persistent: false,
      port: 2302,
      state: null,
      title: '',
      von: false,
    },
    urlRoot: '/api/servers/',
  });

});
