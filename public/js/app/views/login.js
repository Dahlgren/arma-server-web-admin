var _ = require('underscore')
var Marionette = require('marionette')

var tpl = require('tpl/login.html')

module.exports = Marionette.ItemView.extend({
  template: _.template(tpl)
})
