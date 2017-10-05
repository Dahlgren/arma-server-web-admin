define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      Settings            = require('app/models/settings'),
      tpl                 = require('text!tpl/settings.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    modelEvents: {
      'change': 'render',
    },

    initialize: function () {
      this.model = new Settings()
      this.model.fetch();
    },

    templateHelpers: {
      isTypeChecked: function(type) {
        return this.type === type ? 'checked' : '';
      },
    },
  });

});
