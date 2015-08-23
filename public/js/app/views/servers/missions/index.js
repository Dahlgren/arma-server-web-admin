define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      MissionRotations    = require('app/collections/mission_rotations'),
      AvailableListView   = require('app/views/servers/missions/available/list'),
      RotationListView    = require('app/views/servers/missions/rotation/list'),
      tpl                 = require('text!tpl/servers/missions/index.html');

  return Marionette.Layout.extend({
    template: _.template(tpl),

    regions: {
      availableView: "#available",
      rotationView: "#rotation",
    },

    initialize: function (options) {
      this.missions = options.missions;
      this.server = options.server;

      this.rotationCollection = new MissionRotations(this.server.get('missions'));
    },

    onRender: function() {
      var self = this;

      var availableListView = new AvailableListView({collection: this.missions});
      availableListView.on('add', function (model) {
        self.rotationCollection.add([{
          name: model.get('name').replace('.pbo', ''),
        }]);
      });
      var rotationListView = new RotationListView({collection: this.rotationCollection});

      this.availableView.show(availableListView);
      this.rotationView.show(rotationListView);
    },

    serialize : function() {
      return {
        missions: this.rotationCollection.toJSON(),
      };
    },
  });
});
