var $ = require('jquery')
var _ = require('underscore')
var Marionette = require('marionette')
var Ladda = require('ladda')

var tpl = require('tpl/missions/workshop.html')

module.exports = Marionette.ItemView.extend({
  template: _.template(tpl),

  events: {
    'click form button': 'submit'
  },

  initialize: function (options) {
    this.missions = options.missions
  },

  submit: function () {
    var self = this
    var $form = this.$el.find('form')

    var $downloadBtn = $form.find('button[type=submit]')
    var laddaBtn = Ladda.create($downloadBtn.get(0))
    laddaBtn.start()

    $.ajax({
      url: '/api/missions/workshop',
      type: 'POST',
      data: {
        id: $form.find('input.workshop').val()
      },
      dataType: 'json',
      success: function (data) {
        laddaBtn.stop()
        self.render()
      },
      error: function () {
        laddaBtn.stop()
      }
    })
  }
})
