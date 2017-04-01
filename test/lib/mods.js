var should = require('should');

var Mods = require('../../lib/mods.js');

describe('Mods', function() {
  describe('search()', function() {
    it('should find mods', function(done) {
      var mods = new Mods();
      mods.search('', function (err, mods) {
        should(err).be.null;
        mods.should.not.be.empty;
        done();
      });
    });
  });
});
