define(function (require) {

  "use strict";

  var $               = require('jquery'),
      Backbone        = require('backbone'),
      LayoutView      = require('app/views/layout'),
      NavigationView  = require('app/views/navigation'),
      ServersView     = require('app/views/servers/list'),
      LogsListView    = require('app/views/logs/list'),
      MissionsView    = require('app/views/missions/index'),
      ModsListView    = require('app/views/mods/list'),
      ServerView      = require('app/views/servers/view'),
      Logs            = require('app/collections/logs'),
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
      missionsView = new MissionsView({missions: missions}),
      modsListView = new ModsListView({collection: mods});

  return Backbone.Router.extend({

    routes: {
      "logs": "logs",
      "missions": "missions",
      "mods": "mods",
      "servers/:id": "server",
      "": "home",
    },

    initialize: function () {
      layoutView.navigation.show(navigationView);
      missions.fetch();

      var socket = io.connect();
      socket.on('mods', function (_mods) {
        mods.set(_mods);
      });
      socket.on('servers', function (_servers) {
        servers.set(_servers);
      });
    },

    home: function () {
      layoutView.content.show(serversView);
      serversView.delegateEvents();
    },

    logs: function () {
      var logs = new Logs();
      logs.fetch();
      layoutView.content.show(new LogsListView({collection: logs}));
    },

    missions: function () {
      layoutView.content.show(missionsView);
      missionsView.delegateEvents();
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
