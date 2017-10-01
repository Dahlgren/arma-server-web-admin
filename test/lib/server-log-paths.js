require('should')
var tk = require('timekeeper')

var Logs = require('../../lib/server-log-paths.js')
var logs = new Logs({
  path: '/tmp/',
  type: 'linux',
  game: 'arma3'
})

describe('Logs', function () {
  beforeEach(function () {
    tk.freeze(1445455712000) // 2015-10-21 19:28:32
  })

  afterEach(function () {
    tk.reset()
  })

  describe('generateLogFileName(game, identifier)', function () {
    it('should generate valid file name', function () {
      Logs.generateLogFileName('arma3', 'server').should.eql('arma3_server_2015-10-21_19-28-32.log')
    })
    it('should use identifier in file name', function () {
      Logs.generateLogFileName('arma3', 'foo').should.eql('arma3_foo_2015-10-21_19-28-32.log')
    })
  })

  describe('generateLogFilePath()', function () {
    it('should generate valid file path', function () {
      logs.generateLogFilePath('server').should.eql('/tmp/logs/arma3_server_2015-10-21_19-28-32.log')
    })
  })
})
