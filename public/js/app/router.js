define(function (require) {
  
  "use strict";
  
  var $               = require('jquery'),
      Backbone        = require('backbone'),
      LayoutView      = require('app/views/layout'),
      NavigationView  = require('app/views/navigation'),
      HomeView        = require('app/views/home'),
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
      homeView = new HomeView({servers: servers}),
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
      layoutView.content.show(homeView);
      homeView.delegateEvents();
    },
    
    missions: function () {
      layoutView.content.show(missionsListView);
      missionsListView.delegateEvents();
    },
    
    mods: function () {
      layoutView.content.show(modsListView);
      modsListView.delegateEvents();
    },
    
    server: function () {
      layoutView.content.show(new ServerView({model: servers.first()}));
    }
    
  });
  
});