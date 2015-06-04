require.config({

  baseUrl: 'js/lib',

  paths: {
    app: '../app',
    tpl: '../tpl'
  },

  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'backbone.bootstrap-modal': {
      deps: ['backbone', 'bootstrap']
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'ladda': {
      deps: ['bootstrap']
    },
    'marionette': {
      deps: ['backbone'],
      exports: 'Marionette'
    },
    'marionette-formview': {
      deps: ['marionette']
    },
    'sweet-alert': {
      deps: ['bootstrap']
    },
    'underscore': {
      exports: '_'
    }
  }
});

require(['jquery', 'bootstrap', 'backbone', 'app/router'], function ($, Bootstrap, Backbone, Router) {
  var router = new Router();
  Backbone.history.start();
});
