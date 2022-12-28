var _ = require('underscore')

var ServerMod = require('app/models/server_mod')
var ModListItemView = require('app/views/mods/list_item')
var tpl = require('tpl/servers/mods/available/list_item.html')

var template = _.template(tpl)

module.exports = ModListItemView.extend({
  template: template,
  templateHelpers: function () {
    var superTemplateHelpers = ModListItemView.prototype.templateHelpers.call(this)
    var name = this.model.get('name')
    var modSelected = this.options.selectedModsCollection.get(name)

    return Object.assign({}, superTemplateHelpers, {
      isDisabledButton: function () {
        return modSelected ? 'disabled' : ''
      }
    })
  },

  events: {
    'click .add-mod': 'addMod'
  },

  addMod: function (e) {
    e.preventDefault()
    this.options.selectedModsCollection.add(new ServerMod({
      name: this.model.get('name')
    }))
  }
})
