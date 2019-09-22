var _ = require('underscore')
var Marionette = require('marionette')

var tpl = require('tpl/settings.html')

module.exports = Marionette.ItemView.extend({
  template: _.template(tpl),

  modelEvents: {
    change: 'render'
  },

  templateHelpers: {
    isTypeChecked: function (type) {
      return this.type === type ? 'checked' : ''
    }
  }
})
