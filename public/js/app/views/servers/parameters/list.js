define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      Parameter           = require('app/models/parameter'),
      Parameters          = require('app/collections/parameters'),
      ListItemView        = require('app/views/servers/parameters/list_item'),
      tpl                 = require('text!tpl/servers/parameters/list.html');

  return Marionette.CompositeView.extend({
    childView: ListItemView,
    childViewContainer: "tbody",
    template: _.template(tpl),

    events: {
      "click .add-parameter": "addParameter",
    },

    modelEvents: {
      "change": "serverUpdated",
    },

    initialize: function (options) {
      this.collection = new Parameters();
      this.serverUpdated();
    },

    addParameter: function (e) {
      e.preventDefault();
      this.collection.add(new Parameter());
    },

    serialize : function() {
      return {
        parameters: this.collection.map(function (parameter) {
          return parameter.get('parameter');
        }),
      };
    },

    serverUpdated: function () {
      this.collection.reset(this.model.get('parameters').map(function (parameter) {
        return new Parameter({
          parameter: parameter,
        });
      }));
    },
  });

});
