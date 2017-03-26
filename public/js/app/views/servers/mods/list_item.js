define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      ModListItemView     = require('app/views/mods/list_item'),
      tpl                 = require('text!tpl/servers/mods/list_item.html'),

      template = _.template(tpl);

  return ModListItemView.extend({
    tagName: "tr",
    template: template,

    templateHelpers: function(){
      return {
        enabled: this.options.server.get('mods').indexOf(this.model.get('id')) > -1
      }
    },
  });
});
