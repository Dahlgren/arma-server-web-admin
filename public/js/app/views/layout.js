define(function (require) {
  
  "use strict";
  
  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      tpl                 = require('text!tpl/layout.html');    
  
  return Marionette.LayoutView.extend({
    template: _.template(tpl),
    
    regions: {
      navigation: "#navigation",
      content: "#content"
    }
  });
  
});