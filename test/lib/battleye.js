var path = require('path')
require('should')

var BattlEye = require('../../lib/battleye.js')
var Server = require('../../lib/server.js')

var server = new Server(null, null, {
  battle_eye: true,
  battle_eye_password: 'password',
  battle_eye_port: '12345',
  title: 'BattlEye Server'
})

describe('BattlEye', function () {
  describe('configContents()', function () {
    it('should include password', function () {
      var battlEye = new BattlEye({}, server)
      battlEye.configContents().should.containEql('RConPassword password')
    })

    it('should include port', function () {
      var battlEye = new BattlEye({}, server)
      battlEye.configContents().should.containEql('RConPort 12345')
    })

    it('should generate valid config contents', function () {
      var battlEye = new BattlEye({}, server)
      battlEye.configContents().should.eql('RConPassword password\nRConPort 12345')
    })
  })

  describe('configPath()', function () {
    it('should generate x64 config for arma 3 x64 server', function () {
      var battlEye = new BattlEye({ game: 'arma3_x64', path: '/' }, server)
      battlEye.configPath().should.eql(path.join('/', 'battleye', 'beserver_x64.cfg'))
    })

    it('should generate regular config for arma3 server', function () {
      var battlEye = new BattlEye({ game: 'arma3', path: '/' }, server)
      battlEye.configPath().should.eql(path.join('/', 'battleye', 'beserver.cfg'))
    })
  })
})
