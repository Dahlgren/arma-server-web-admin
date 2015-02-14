var should = require('should');

var Mods = require('../../lib/mods.js');

describe('Mods', function() {
  describe('removeDuplicates()', function() {
    it('should remove duplicate mods', function() {
      Mods.removeDuplicates(['mod1', 'mod1']).should.eql(['mod1']);
    });
  });

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
