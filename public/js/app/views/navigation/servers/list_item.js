var _ = require('underscore')
var Backbone = require('backbone')
var Marionette = require('marionette')

var tpl = require('tpl/navigation/servers/list_item.html')

var template = _.template(tpl)

module.exports = Marionette.ItemView.extend({
  className: function () {
    return Backbone.history.fragment === 'servers/' + this.model.get('id') ? 'active' : ''
  },
  tagName: 'li',
  template: template
})
