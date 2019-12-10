var $ = require('jquery')
var _ = require('underscore')
var Marionette = require('marionette')

var tpl = require('tpl/servers/missions/rotation/list_item.html')

var template = _.template(tpl)

module.exports = Marionette.ItemView.extend({
  tagName: 'tr',
  template: template,

  events: {
    'click button.delete': 'delete',
    'change select#difficulty': 'changed',
    'change input#name': 'changed'
  },

  changed: function (e) {
    var val = $(e.target).val()
    this.model.set(e.target.id, val)
  },

  delete: function (e) {
    e.preventDefault()
    this.model.destroy()
  },

  onRender: function () {
    var difficulty = this.model.get('difficulty')
    var $option = this.$el.find("#difficulty option[value='" + difficulty + "']")
    $option.attr('selected', 'selected')
  }
})
