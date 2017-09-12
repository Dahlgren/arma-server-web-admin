require('should')
var tk = require('timekeeper')

var Logs = require('../../lib/logs.js')
var logs = new Logs({
  path: '/tmp/',
  type: 'linux'
})

describe('Logs', function () {
  beforeEach(function () {
    tk.freeze(1445455712000) // 2015-10-21 19:28:32
  })

  afterEach(function () {
    tk.reset()
  })

  describe('generateLogFileName()', function () {
    it('should generate valid file name', function () {
      Logs.generateLogFileName().should.eql('arma3server_2015-10-21_19-28-32.log')
    })
  })

  describe('generateLogFilePath()', function () {
    it('should generate valid file path', function () {
      logs.generateLogFilePath().should.eql('/tmp/logs/arma3server_2015-10-21_19-28-32.log')
    })
  })
})
