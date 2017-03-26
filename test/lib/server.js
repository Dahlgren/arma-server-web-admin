var should = require('should');

var Server = require('../../lib/server.js');

describe('Server', function() {
  describe('generateId()', function() {
    it('should include title', function() {
      var server = new Server(null, null, null, {title: 'title.with.lot.of.dots'});
      server.generateId().should.eql('title-with-lot-of-dots');
    });
  });

  describe('toJSON()', function() {
    it('should include title', function() {
      var server = new Server(null, null, null, {title: 'test'});
      server.toJSON().should.have.property('title', 'test');
    });
  });
});
