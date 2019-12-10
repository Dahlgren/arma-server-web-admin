var _ = require('underscore')
var Marionette = require('marionette')

var tpl = require('tpl/servers/missions/available/list_item.html')

var template = _.template(tpl)

module.exports = Marionette.ItemView.extend({
  tagName: 'tr',
  template: template,

  events: {
    'click .add': 'add'
  },

  add: function () {
    this.trigger('add', this.model)
  }
})
