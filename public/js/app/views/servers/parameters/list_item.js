var $ = require('jquery')
var _ = require('underscore')
var Marionette = require('marionette')

var tpl = require('tpl/servers/parameters/list_item.html')

var template = _.template(tpl)

module.exports = Marionette.ItemView.extend({
  tagName: 'tr',
  template: template,

  events: {
    'click button.delete': 'delete',
    'change input#parameter': 'changed',
    'click button.clone': 'clone'
  },

  changed: function (e) {
    var val = $(e.target).val()
    this.model.set(e.target.id, val)
  },

  delete: function (e) {
    e.preventDefault()
    this.model.destroy()
  }
})
