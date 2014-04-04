define(function (require) {
  
  "use strict";
  
  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      FormView            = require('marionette-formview'),
      Settings            = require('app/models/settings'),
      tpl                 = require('text!tpl/forms/settings.html');
  
  return FormView.extend({
    template: _.template(tpl),
    
    fields: {
      path: {
        el: ".mission",
        required: "Please select a file."
      }
    },
    
    initialize: function () {
      var self = this;
      new Mission().fetch({success: function (model, response, options) {
        self.model = model;
        self.runInitializers();
      }});
    }
  });
  
});