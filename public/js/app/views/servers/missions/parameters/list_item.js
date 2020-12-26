var $ = require('jquery')
var _ = require('underscore')
var Marionette = require('marionette')

var tpl = require('tpl/servers/missions/parameters/list_item.html')

var template = _.template(tpl)

module.exports = Marionette.ItemView.extend({
  tagName: 'tr',
  template: template,

  events: {
    'click button.parameter-delete': 'delete',
    'change input': 'changed'
  },

  changed: function (e) {
    var val = $(e.target).val()
    this.model.set(e.target.dataset.attr, val)
  },

  delete: function (e) {
    e.preventDefault()
    this.model.destroy()
  },

  templateHelpers: function () {
    return {
      index: this.options.index
    }
  }
})
