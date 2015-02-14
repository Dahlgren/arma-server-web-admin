var should = require('should');

var Server = require('../../lib/server.js');

describe('Server', function() {
  describe('toJSON()', function() {
    it('should include title', function() {
      var server = new Server(null, null, {title: 'test'});
      server.toJSON().should.have.property('title', 'test');
    });
  });
});
