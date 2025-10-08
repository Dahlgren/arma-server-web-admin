require('should')

var Server = require('../../lib/server.js')

describe('Server', function () {
  describe('generateId()', function () {
    it('should generate id for title with dots', function () {
      Server.generateId('title.with.lot.of.dots').should.eql('title-with-lot-of-dots')
    })

    it('should generate id title with brackets', function () {
      Server.generateId('title [with] [lots of] [brackets]').should.eql('title-with-lots-of-brackets')
    })

    it('should generate id title with parentheses', function () {
      Server.generateId('title (with) (lots of) (parentheses)').should.eql('title-with-lots-of-parentheses')
    })
  })

  describe('toJSON()', function () {
    it('should include title', function () {
      var server = new Server(null, null, { title: 'test' })
      server.toJSON().should.have.property('title', 'test')
    })
  })
})
