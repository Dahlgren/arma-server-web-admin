const request = require('supertest')

const app = require('../app')

function requestPath (path, contentType, done) {
  request(app)
    .get(path)
    .expect('Content-Type', contentType)
    .expect(200)
    .end(done)
}

describe('App', function () {
  it('should serve main page', function (done) {
    requestPath('/', /html/, done)
  })

  it('should serve logs', function (done) {
    requestPath('/api/logs', /json/, done)
  })

  it('should serve missions', function (done) {
    requestPath('/api/missions', /json/, done)
  })

  it('should serve mods', function (done) {
    requestPath('/api/mods', /json/, done)
  })

  it('should serve servers', function (done) {
    requestPath('/api/servers', /json/, done)
  })

  it('should serve settings', function (done) {
    requestPath('/api/settings', /json/, done)
  })
})
