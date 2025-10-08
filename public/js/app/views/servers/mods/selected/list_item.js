var $ = require('jquery')
var _ = require('underscore')

var ModListItemView = require('app/views/mods/list_item')
var tpl = require('tpl/servers/mods/selected/list_item.html')

var template = _.template(tpl)

module.exports = ModListItemView.extend({
  template: template,

  events: {
    'click button.delete': 'delete',
    'change select#difficulty': 'changed',
    'change input#id': 'changed'
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
