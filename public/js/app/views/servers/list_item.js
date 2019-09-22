var _ = require('underscore')
var Marionette = require('marionette')
var sweetAlert = require('sweet-alert')

var tpl = require('tpl/servers/list_item.html')

var template = _.template(tpl)

module.exports = Marionette.ItemView.extend({
  tagName: 'tr',
  template: template,

  events: {
    'click .clone': 'clone',
    'click .delete': 'delete'
  },

  modelEvents: {
    change: 'serverUpdated'
  },

  clone: function (e) {
    var title = this.model.get('title') + ' Clone'
    var clone = this.model.clone()
    clone.set({ id: null, title: title, auto_start: false })
    clone.save()
  },

  delete: function (event) {
    var self = this
    sweetAlert({
      title: 'Are you sure?',
      text: 'Your server configuration will be deleted!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, delete it!'
    },
    function () {
      self.model.destroy()
    })
  },

  serverUpdated: function (event) {
    this.render()
  }
})
