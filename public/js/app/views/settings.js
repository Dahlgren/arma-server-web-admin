define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      tpl                 = require('text!tpl/settings.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    modelEvents: {
      'change': 'render',
    },

    templateHelpers: {
      isTypeChecked: function(type) {
        return this.type === type ? 'checked' : '';
      },
    },
  });

});
