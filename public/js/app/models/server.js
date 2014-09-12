define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone');

  return Backbone.Model.extend({
    defaults: {
      admin_password: '',
      battle_eye: false,
      max_players: null,
      mods: [],
      password: '',
      persistent: false,
      state: null,
      title: '',
      von: false,
    },
    urlRoot: '/api/servers/',
  });

});
