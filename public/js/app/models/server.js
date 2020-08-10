var $ = require('jquery')
var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  defaults: {
    additionalConfigurationOptions: '',
    admin_password: '',
    allowed_file_patching: 1,
    auto_start: false,
    battle_eye: false,
    file_patching: false,
    forcedDifficulty: '',
    max_players: null,
    mods: [],
    motd: '',
    number_of_headless_clients: 0,
    parameters: [],
    password: '',
    persistent: false,
    port: 2302,
    state: null,
    title: '',
    von: false,
    verify_signatures: false
  },
  urlRoot: '/api/servers/',
  start: function (cb) {
    var self = this
    $.ajax({
      url: '/api/servers/' + self.get('id') + '/start',
      type: 'POST',
      success: function (resp) {
        self.set('pid', resp.pid)

        if (cb) {
          cb()
        }
      },
      error: function (err) {
        if (cb) {
          cb(err)
        }
      }
    })
  },

  stop: function (cb) {
    var self = this
    $.ajax({
      url: '/api/servers/' + self.get('id') + '/stop',
      type: 'POST',
      success: function (resp) {
        self.set('pid', resp.pid)

        if (cb) {
          cb()
        }
      },
      error: function (err) {
        if (cb) {
          cb(err)
        }
      }
    })
  },

  missionDifficulty: function () {
    var serverDifficulty = this.get('forcedDifficulty')
    if (serverDifficulty) {
      return serverDifficulty.toLowerCase()
    }

    return undefined
  }
})
