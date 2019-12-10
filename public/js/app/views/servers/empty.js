var _ = require('underscore')
var Marionette = require('marionette')

var tpl = require('tpl/servers/empty.html')

module.exports = Marionette.ItemView.extend({
  tagName: 'tr',
  template: _.template(tpl),

  initialize: function (options) {
    this.servers = options.servers
  }
})
