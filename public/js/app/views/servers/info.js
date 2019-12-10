var $ = require('jquery')
var _ = require('underscore')
var Marionette = require('marionette')
var sweetAlert = require('sweet-alert')

var tpl = require('tpl/servers/info.html')

module.exports = Marionette.LayoutView.extend({
  template: _.template(tpl),

  events: {
    'click #start': 'start',
    'click #stop': 'stop'
  },

  start: function (event) {
    var self = this
    event.preventDefault()
    $.ajax({
      url: '/api/servers/' + this.model.get('id') + '/start',
      type: 'POST',
      success: function (resp) {
        self.model.set('pid', resp.pid)
        self.render()
      },
      error: $.noop
    })
  },

  stop: function (event) {
    var self = this
    event.preventDefault()
    sweetAlert({
      title: 'Are you sure?',
      text: 'The server will stopped.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-warning',
      confirmButtonText: 'Yes, stop it!'
    },
    function () {
      $.ajax({
        url: '/api/servers/' + self.model.get('id') + '/stop',
        type: 'POST',
        success: function (resp) {
          self.model.set('pid', resp.pid)
          self.render()
        },
        error: $.noop
      })
    })
  }
})
