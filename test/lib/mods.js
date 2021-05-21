var path = require('path')
var os = require('os')
require('should')

function isWindows () {
  return os.type() === 'Windows_NT'
}

var Mods = require('../../lib/mods.js')

describe('Mods', function () {
  var rootPrefix = '/'
  if (isWindows()) {
    rootPrefix = 'C:'
  }
  var absoluteArmaPath = path.join(rootPrefix, 'foo', 'arma')
  var absoluteModsPath = path.join(rootPrefix, 'foo', 'mods')
  var relativeModsPath = path.join('..', 'mods')

  describe('getAbsoluteModsPath() / getAbsoluteModPath(mod)', function () {
    describe('when no modsPath is given', function () {
      it('returns path', function () {
        var mods = new Mods({ path: absoluteArmaPath })
        mods.getAbsoluteModsPath().should.eql(absoluteArmaPath)
        mods.getAbsoluteModPath('x').should.eql(path.join(absoluteArmaPath, 'x'))
      })
    })
    describe('when modsPath is', function () {
      it('relative, it returns absolute path', function () {
        var mods = new Mods({ path: absoluteArmaPath, modsPath: relativeModsPath })
        mods.getAbsoluteModsPath().should.eql(absoluteModsPath)
        mods.getAbsoluteModPath('x').should.eql(path.join(absoluteModsPath, 'x'))
      })
      it('absolute, it returns absolute path', function () {
        var mods = new Mods({ path: absoluteArmaPath, modsPath: absoluteModsPath })
        mods.getAbsoluteModsPath().should.eql(absoluteModsPath)
        mods.getAbsoluteModPath('x').should.eql(path.join(absoluteModsPath, 'x'))
      })
    })
  })
  describe('getApplicableModPath()', function () {
    it('returns mod name if no modsPath is given', function () {
      var mods = new Mods({ path: absoluteArmaPath })
      mods.getApplicableModPath('x').should.eql('x')
    })
    it('returns relative path if relative modsPath is given', function () {
      var mods = new Mods({ path: absoluteArmaPath, modsPath: relativeModsPath })
      mods.getApplicableModPath('x').should.eql(path.join(relativeModsPath, 'x'))
    })
    it('returns absolute path if modsPath is absolute', function () {
      var mods = new Mods({ path: absoluteArmaPath, modsPath: absoluteModsPath })
      mods.getApplicableModPath('x').should.eql(path.join(absoluteModsPath, 'x'))
    })
  })

  describe('updateMods()', function () {
    it('finds mods in arma dir', function (done) {
      var mods = new Mods({ path: path.join(__dirname, '..', 'resources', 'armaPath') })
      mods.on('mods', function (modList) {
        modList.should.eql([{ name: '@armaMod' }])
        done()
      })
      mods.updateMods()
    })
    it('finds mods in modsPath dir', function (done) {
      var mods = new Mods({ path: path.join(__dirname, '..', 'resources', 'armaPath'), modsPath: path.join(__dirname, '..', 'resources', 'modPath') })
      mods.on('mods', function (modList) {
        modList.should.eql([{ name: '@modPathMod' }])
        done()
      })
      mods.updateMods()
    })
    it('finds mods in relative modsPath dir', function (done) {
      var mods = new Mods({ path: path.join(__dirname, '..', 'resources', 'armaPath'), modsPath: path.join('..', 'modPath') })
      mods.on('mods', function (modList) {
        modList.should.eql([{ name: '@modPathMod' }])
        done()
      })
      mods.updateMods()
    })
  })
})
