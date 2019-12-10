var $ = require('jquery')
var _ = require('underscore')
var Marionette = require('marionette')

var ListItemView = require('app/views/mods/list_item')
var tpl = require('tpl/mods/list.html')

var template = _.template(tpl)

module.exports = Marionette.CompositeView.extend({
  childView: ListItemView,
  childViewContainer: 'tbody',
  template: template,

  events: {
    'click #refresh': 'refresh'
  },

  refresh: function (event) {
    event.preventDefault()
    $.ajax({
      url: '/api/mods/refresh',
      type: 'POST',
      success: function (resp) {

      },
      error: function (resp) {

      }
    })
  }
})
