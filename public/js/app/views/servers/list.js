define(function (require) {
  
  "use strict";
  
  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      ListItemView        = require('app/views/servers/list_item');
  
  return Marionette.CollectionView.extend({
    tagName: 'ul',
    itemView: ListItemView,
  });
});
