var _ = require('underscore')
var Marionette = require('marionette')

var tpl = require('tpl/layout.html')

module.exports = Marionette.LayoutView.extend({
  template: _.template(tpl),

  regions: {
    navigation: '#navigation',
    content: '#content'
  }
})
