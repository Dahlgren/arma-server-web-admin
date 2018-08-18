define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      ListItemView        = require('app/views/servers/missions/available/list_item'),
      tpl                 = require('text!tpl/servers/missions/available/list.html');

  return Marionette.CompositeView.extend({
    childView: ListItemView,
    childViewContainer: "tbody",
    template: _.template(tpl),

    buildChildView: function(item, ChildViewType, childViewOptions){
      var self = this;
      var options = _.extend({model: item}, childViewOptions);
      var view = new ChildViewType(options);
      view.on('add', function (model) {
        self.trigger('add', model);
      });
      return view;
    },
  });

});
