define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      FormView            = require('app/views/missions/form'),
      ListView            = require('app/views/missions/list'),
      tpl                 = require('text!tpl/missions/index.html');

  return Marionette.Layout.extend({
    template: _.template(tpl),

    regions: {
      formView: "#form",
      listView: "#list",
    },

    onRender: function() {
      this.formView.show(new FormView({missions: this.options.missions}));
      this.listView.show(new ListView({collection: this.options.missions}));
    },
  });

});
