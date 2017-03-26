var should = require('should');

var SteamMods = require('../../lib/steam_mods.js');

var dummyMods = [
  {
    id: 'test',
    name: 'test',
  }
];

describe('SteamMods', function() {
  describe('find()', function() {
    it('should find mod', function() {
      var steamMods = new SteamMods({});
      steamMods.mods = dummyMods;
      var mod = steamMods.find('test');
      mod.should.eql(dummyMods[0]);
    });
  });
});
