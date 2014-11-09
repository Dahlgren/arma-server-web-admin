define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      tpl                 = require('text!tpl/servers/players.html');

  return Marionette.Layout.extend({
    template: _.template(tpl),
    templateHelpers: {
      players: function(){
        return _.sortBy(this.state.players, function (player) {
          return player.name;
        });
      }
    },
  });

});
