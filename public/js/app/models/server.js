define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone');

  return Backbone.Model.extend({
    defaults: {
      admin_password: '',
      auto_start: false,
      battle_eye: false,
      max_players: null,
      mods: [],
      number_of_headless_clients: 0,
      parameters: [],
      password: '',
      persistent: false,
      port: 2302,
      state: null,
      title: '',
      von: false,
      verify_signatures: false,
    },
    urlRoot: '/api/servers/',
  });

});
