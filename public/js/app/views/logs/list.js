var $ = require('jquery')
var _ = require('underscore')
var Marionette = require('marionette')
var sweetAlert = require('sweet-alert')

var ListItemView = require('app/views/logs/list_item')
var tpl = require('tpl/logs/list.html')

var template = _.template(tpl)

module.exports = Marionette.CompositeView.extend({
  childView: ListItemView,
  childViewContainer: 'tbody',
  template: template,

  events: {
    'click .delete-all': 'deleteAll'
  },

  deleteAll: function (event) {
    var self = this

    sweetAlert({
      title: 'Are you sure?',
      text: 'All logs will be deleted from the server!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, delete all!'
    },
    function () {
      $.ajax('/api/logs/all', {
        type: 'DELETE',
        success: function (data) {
          self.collection.fetch()
        },
        error: function () {}
      })
    })
  }
})
