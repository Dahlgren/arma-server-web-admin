var $ = require('jquery')
var _ = require('underscore')
var Marionette = require('marionette')
var Ladda = require('ladda')
var tpl = require('tpl/mods/search/list_item.html')

var template = _.template(tpl)

module.exports = Marionette.ItemView.extend({
  tagName: 'tr',
  template: template,

  events: {
    'click .install': 'install'
  },

  templateHelpers: {
    downloading: function () {
      if (this.mods.get(this.id)) {
        return this.mods.get(this.id).get('downloading')
      }

      return false
    }
  },

  install: function (event) {
    var self = this
    event.preventDefault()

    this.laddaBtn = Ladda.create(this.$el.find('.ladda-button').get(0))
    this.laddaBtn.start()
    this.$el.find('.ladda-button').addClass('disabled')

    $.ajax({
      url: '/api/mods/',
      type: 'POST',
      data: {
        id: this.model.get('id')
      },
      dataType: 'json',
      success: function (resp) {
        self.laddaBtn.stop()
        self.$el.find('.ladda-button').removeClass('disabled')
      },
      error: function (resp) {
        self.laddaBtn.stop()
        self.$el.find('.ladda-button').removeClass('disabled')
      }
    })
  }
})
