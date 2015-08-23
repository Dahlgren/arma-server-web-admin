define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      ListItemView        = require('app/views/servers/missions/available/list_item'),
      tpl                 = require('text!tpl/servers/missions/available/list.html');

  return Marionette.CompositeView.extend({
    itemView: ListItemView,
    itemViewContainer: "tbody",
    template: _.template(tpl),

    buildItemView: function(item, ItemViewType, itemViewOptions){
      var self = this;
      var options = _.extend({model: item}, itemViewOptions);
      var view = new ItemViewType(options);
      view.on('add', function (model) {
        self.trigger('add', model);
      });
      return view;
    },
  });

});
