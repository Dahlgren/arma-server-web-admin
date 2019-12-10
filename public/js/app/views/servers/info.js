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

    this.model.start(function (err) {
      if (err) {
        sweetAlert({
          title: 'Error',
          text: err.responseText,
          type: 'error'
        })
        return
      }

      self.render()
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
      event.preventDefault()

      self.model.stop(function (err) {
        if (err) {
          sweetAlert({
            title: 'Error',
            text: err.responseText,
            type: 'error'
          })
          return
        }

        self.render()
      })
    })
  }
})
