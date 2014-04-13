define(function (require) {

  "use strict";

  var $               = require('jquery'),
      Backbone        = require('backbone'),
      LayoutView      = require('app/views/layout'),
      NavigationView  = require('app/views/navigation'),
      ServersView     = require('app/views/servers/list'),
      MissionsListView= require('app/views/missions/list'),
      ModsListView    = require('app/views/mods/list'),
      ServerView      = require('app/views/servers/view'),
      Missions        = require('app/collections/missions'),
      Mods            = require('app/collections/mods'),
      Servers         = require('app/collections/servers'),

      $body = $('body'),
      missions = new Missions(),
      mods = new Mods(),
      servers = new Servers(),
      layoutView = new LayoutView({el: $body}).render(),
      navigationView = new NavigationView({servers: servers}),
      serversView = new ServersView({collection: servers}),
      missionsListView = new MissionsListView({collection: missions}),
      modsListView = new ModsListView({collection: mods});

  return Backbone.Router.extend({

    routes: {
      "missions": "missions",
      "mods": "mods",
      "servers/:id": "server",
      "": "home",
    },

    initialize: function () {
      layoutView.navigation.show(navigationView);
      missions.fetch();
      mods.fetch();
      servers.fetch();
    },

    home: function () {
      layoutView.content.show(serversView);
      serversView.delegateEvents();
    },

    missions: function () {
      layoutView.content.show(missionsListView);
      missionsListView.delegateEvents();
    },

    mods: function () {
      layoutView.content.show(modsListView);
      modsListView.delegateEvents();
    },

    server: function (id) {
      var server = servers.get(id);
      if (server) {
        layoutView.content.show(new ServerView({model: server, mods: mods}));
      } else {
        this.navigate("#", true)
      }
    }

  });

});
