var $ = require('jquery')
var _ = require('underscore')
var Marionette = require('marionette')
var Ladda = require('ladda')
var Mods = require('app/collections/mods')
var tpl = require('tpl/mods/download/form.html')
var sweetAlert = require('sweet-alert')

module.exports = Marionette.ItemView.extend({

  events: {
    submit: 'beforeSubmit'
  },

  template: _.template(tpl),

  initialize: function (options) {
    this.mods = options.mods
    this.collection = new Mods()
    this.bind('ok', this.submit)
    this.bind('shown', this.shown)

    var self = this
    this.listenTo(this.mods, 'change reset add remove', function () {
      self.collection.trigger('reset')
    })
  },

  beforeSubmit: function (e) {
    e.preventDefault()
    this.submit()
  },

  shown: function (modal) {
    var $okBtn = modal.$el.find('.btn.ok')
    $okBtn.addClass('ladda-button').attr('data-style', 'expand-left')

    this.laddaBtn = Ladda.create($okBtn.get(0))

    this.$el.find('form .query').focus()
  },

  submit: function (modal) {
    var self = this
    var $form = this.$el.find('form')

    if (modal) {
      self.modal.preventClose()
    }

    $form.find('.form-group').removeClass('has-error')
    $form.find('.help-block').text('')

    this.laddaBtn.start()
    self.modal.$el.find('.btn.cancel').addClass('disabled')

    $.ajax({
      url: '/api/mods/',
      type: 'POST',
      data: {
        id: $form.find('.query').val()
      },
      dataType: 'json',
      success: function (resp) {
        self.laddaBtn.stop()
        self.modal.$el.find('.ladda-button').removeClass('disabled')
        self.modal.close()
      },
      error: function (resp) {
        self.laddaBtn.stop()
        self.modal.$el.find('.ladda-button').removeClass('disabled')
        self.modal.close()

        sweetAlert({
          title: 'Error',
          text: 'An error occurred, please consult the logs',
          type: 'error'
        })
      }
    })
  }
})
