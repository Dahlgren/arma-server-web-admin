define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      FormView            = require('marionette-formview'),
      Ladda               = require('ladda'),
      IframeTransport     = require('jquery.iframe-transport'),
      Mission             = require('app/models/mission'),
      tpl                 = require('text!tpl/missions/form.html');

  return Marionette.ItemView.extend({
    template: _.template(tpl),

    events: {
      'click form button': 'submit',
    },

    initialize: function (options) {
      this.missions = options.missions;
      this.model = new Mission();
    },

    onShow: function () {
      var $okBtn = this.$el.find('form button[type=submit]');
      $okBtn.addClass('ladda-button').attr('data-style', 'expand-left');

      this.laddaBtn = Ladda.create($okBtn.get(0));
    },

    submit: function () {
      var self = this;
      var $form = $('form');

      this.laddaBtn.start();

      $.ajax("/api/missions", {
        files: $form.find(":file"),
        iframe: true
      }).complete(function(data) {
        self.missions.fetch({success : function () {
          self.laddaBtn.stop();
          self.render();
        }});
      }).error(function() {
        self.laddaBtn.stop();
      });
    },
  });
});
