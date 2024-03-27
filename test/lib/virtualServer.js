var async = require('async')
var fs = require('fs')
var fsExtra = require('fs.extra')
var path = require('path')
var os = require('os')
var should = require('should')

var virtualServer = require('../../lib/virtualServer.js')

var basicServerFiles = [
  '@mod/addons/addon.pbo',
  '@mod/keys/mod.bikey',
  '@mod/optionals/@nested_mod/addons/nested_addon.pbo',
  '@mod/optionals/@nested_mod/keys/nested_mod.bikey',
  'addons/data_f.pbo',
  'arma3server',
  'arma3server.exe',
  'arma3server_x64',
  'arma3server_x64.exe',
  'dta/product.bin',
  'keys/a3.bikey',
  'libsteam.so',
  'mpmissions/test.vr.pbo',
  'steam.dll',
  'steam_appid.txt'
]

function createEmptyFile (file, cb) {
  fs.open(file, 'w', function (err, fd) {
    if (err) {
      return cb(err)
    }

    fs.close(fd, cb)
  })
}

function createTempServerFolder (files, cb) {
  fs.mkdtemp(path.join(os.tmpdir(), 'arma-server-test-'), function (err, serverFolder) {
    if (err) {
      return cb(err)
    }

    async.forEach(files, function (file, cb) {
      var fileFolder = path.dirname(file)
      if (fileFolder) {
        fsExtra.mkdirp(path.join(serverFolder, fileFolder), function (err) {
          if (err) {
            return cb(err)
          }

          createEmptyFile(path.join(serverFolder, file), cb)
        })
      } else {
        createEmptyFile(path.join(serverFolder, file), cb)
      }
    }, function (err, files) {
      cb(err, serverFolder)
    })
  })
}

describe('VirtualServer', function () {
  var serverFolder
  var tempServerFolder

  function createVirtualServer (mods, done) {
    createTempServerFolder(basicServerFiles, function (err, folder) {
      if (err) {
        return done(err)
      }

      serverFolder = folder

      return virtualServer.create({
        path: serverFolder
      }, mods)
        .then(function (serverFolder) {
          tempServerFolder = serverFolder
          done()
        })
        .catch(done)
    })
  }

  function removeVirtualServer (done) {
    if (tempServerFolder) {
      virtualServer.remove(tempServerFolder, function (err) {
        if (err) {
          return done(err)
        }

        fsExtra.rmrf(serverFolder, done)
      })
    } else if (serverFolder) {
      fsExtra.rmrf(serverFolder, done)
    } else {
      done()
    }
  }

  function checkForFile (file, cb) {
    fs.access(path.join(tempServerFolder, file), function (err) {
      should.not.exist(err)
      cb(err)
    })
  }

  function checkForLink (file, cb) {
    fs.lstat(path.join(tempServerFolder, file), function (err, stats) {
      if (err) {
        return cb(err)
      }

      should(stats.isSymbolicLink()).be.exactly(true)
      cb()
    })
  }

  describe('basic server', function () {
    before(function (done) {
      var mods = []
      createVirtualServer(mods, done)
    })

    after(function (done) {
      removeVirtualServer(done)
    })

    it('should copy Linux binary', function (done) {
      checkForFile('arma3server.exe', done)
    })

    it('should copy Linux x64 binary', function (done) {
      checkForFile('arma3server_x64.exe', done)
    })

    it('should copy Linux libsteam.so', function (done) {
      checkForFile('libsteam.so', done)
    })

    it('should copy Windows binary', function (done) {
      checkForFile('arma3server.exe', done)
    })

    it('should copy Windows x64 binary', function (done) {
      checkForFile('arma3server_x64.exe', done)
    })

    it('should copy Windows steam.dll', function (done) {
      checkForFile('steam.dll', done)
    })

    it('should link addons folder', function (done) {
      checkForLink('addons', done)
    })

    it('should have addons folder with data_f.pbo', function (done) {
      checkForFile('addons/data_f.pbo', done)
    })

    it('should link dta folder', function (done) {
      checkForLink('dta', done)
    })

    it('should have dta folder with product.bin', function (done) {
      checkForFile('dta/product.bin', done)
    })

    it('should have keys folder with a3.bikey', function (done) {
      checkForFile('keys/a3.bikey', done)
    })

    it('should link mpmissions folder', function (done) {
      checkForLink('mpmissions', done)
    })

    it('should have mpmissions folder with test.vr.pbo', function (done) {
      checkForFile('mpmissions/test.vr.pbo', done)
    })
  })

  describe('mod', function () {
    before(function (done) {
      var mods = [
        '@mod'
      ]
      createVirtualServer(mods, done)
    })

    after(function (done) {
      removeVirtualServer(done)
    })

    it('should link @mod folder', function (done) {
      checkForLink('@mod', done)
    })

    it('should have @mod folder with addons folder containing addon.pbo', function (done) {
      checkForFile('@mod/addons/addon.pbo', done)
    })

    it('should have keys folder with mod.bikey', function (done) {
      checkForFile('keys/mod.bikey', done)
    })
  })

  describe('nested mod', function () {
    before(function (done) {
      var mods = [
        path.join('@mod', 'optionals', '@nested_mod')
      ]
      createVirtualServer(mods, done)
    })

    after(function (done) {
      removeVirtualServer(done)
    })

    it('should link @mod', function (done) {
      checkForLink('@mod', done)
    })

    it('should have @mod folder with optionals @nested_mod folder with addons folder containing nested_addon.pbo', function (done) {
      checkForFile('@mod/optionals/@nested_mod/addons/nested_addon.pbo', done)
    })

    it('should not have mod.bikey in keys', function (done) {
      fs.access(path.join(tempServerFolder, 'keys', 'mod.bikey'), function (err) {
        should.exist(err)
        done()
      })
    })

    it('should have keys folder with nested_mod.bikey', function (done) {
      checkForFile('keys/nested_mod.bikey', done)
    })
  })

  describe('multiple mods', function () {
    before(function (done) {
      var mods = [
        '@mod',
        path.join('@mod', 'optionals', '@nested_mod')
      ]
      createVirtualServer(mods, done)
    })

    after(function (done) {
      removeVirtualServer(done)
    })

    it('should link @mod', function (done) {
      checkForLink('@mod', done)
    })

    it('should have @mod folder with addons folder containing addon.pbo', function (done) {
      checkForFile('@mod/addons/addon.pbo', done)
    })

    it('should have @mod folder with optionals @nested_mod folder with addons folder containing nested_addon.pbo', function (done) {
      checkForFile('@mod/optionals/@nested_mod/addons/nested_addon.pbo', done)
    })

    it('should have keys folder with nested_mod.bikey', function (done) {
      checkForFile('keys/mod.bikey', done)
    })

    it('should have keys folder with nested_mod.bikey', function (done) {
      checkForFile('keys/nested_mod.bikey', done)
    })
  })
})
