define(function (require) {

  "use strict";

  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      Marionette          = require('marionette'),
      Mods                = require('app/collections/mods'),
      ModsListView        = require('app/views/mods/list'),
      ListItemView        = require('app/views/servers/mods/list_item'),
      tpl                 = require('text!tpl/servers/mods/list.html');

  return ModsListView.extend({
    itemView: ListItemView,
    template: _.template(tpl),

    events: {
      "submit": "save",
    },

    buildItemView: function(item, ItemViewType, itemViewOptions){
      var options = _.extend({model: item, server: this.options.server}, itemViewOptions);
      var view = new ItemViewType(options);
      return view;
    },

    save: function (event) {
      event.preventDefault();
      var enabledMods = $('input:checkbox:checked').map(function (idx, el) {
        return $(el).val();
      }).get();

      this.options.server.set('mods', enabledMods);
      this.options.server.save();
    },
  });

});
