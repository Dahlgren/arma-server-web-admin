define(function (require) {
  
  "use strict";
  
  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      tpl                 = require('text!tpl/missions/list_item.html'),
      
      template = _.template(tpl);
  
  return Marionette.ItemView.extend({
    tagName: "td",
    template: template
  });
});
