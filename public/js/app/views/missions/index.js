define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      UploadView          = require('app/views/missions/upload'),
      WorkshopView        = require('app/views/missions/workshop'),
      ListView            = require('app/views/missions/list'),
      tpl                 = require('text!tpl/missions/index.html');

  return Marionette.LayoutView.extend({
    template: _.template(tpl),

    regions: {
      uploadView: "#upload",
      workshopView: "#workshop",
      listView: "#list",
    },

    onRender: function() {
      this.uploadView.show(new UploadView({missions: this.options.missions}));
      this.workshopView.show(new WorkshopView({missions: this.options.missions}));
      this.listView.show(new ListView({collection: this.options.missions}));
    },
  });

});
