define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      MissionRotation     = require('app/models/mission_rotation'),
      ListItemView        = require('app/views/servers/missions/rotation/list_item'),
      tpl                 = require('text!tpl/servers/missions/rotation/list.html');

  return Marionette.CompositeView.extend({
    childView: ListItemView,
    childViewContainer: "tbody",
    template: _.template(tpl),

    events: {
      "click .add-mission": "addMission",
    },

    addMission: function (e) {
      e.preventDefault();
      this.collection.add(new MissionRotation());
    },
  });

});
