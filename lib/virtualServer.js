var fs = require('fs')
var fsExtra = require('fs.extra')
var _ = require('lodash')
var glob = require('glob')
var os = require('os')
var path = require('path')

const requiredFileExtensions = [
  '.dll',
  '.exe',
  '.so',
  '.txt' // Steam app id
]

const serverFolders = [
  'addons',
  'aow',
  'argo',
  'battleye',
  'contact',
  'csla',
  'curator',
  'dll',
  'dta',
  'enoch',
  'expansion',
  'heli',
  'jets',
  'kart',
  'linux64',
  'mark',
  'mpmissions',
  'orange',
  'tacops',
  'tank'
]

function copyKeys (config, serverFolder, mods) {
  // Copy needed keys, file symlinks on Windows are sketchy
  const keysFolder = path.join(serverFolder, 'keys')
  return fs.promises.mkdir(keysFolder, { recursive: true })
    .then(() => {
      const defaultKeysPath = path.join(config.path, 'keys')
      const defaultKeysPromise = fs.promises.readdir(defaultKeysPath)
        .then((files) => files.filter((file) => path.extname(file) === '.bikey'))
        .then((files) => files.map((file) => path.join(defaultKeysPath, file)))

      const modKeysPromise = Promise.all(mods.map(mod => {
        return new Promise((resolve, reject) => {
          const modPath = path.resolve(config.path, mod)
          glob(`${modPath}/**/*.bikey`, function (err, files) {
            if (err) {
              return reject(err)
            }

            return resolve(files)
          })
        })
      })).then((modsFiles) => modsFiles.flat())

      return Promise.all([defaultKeysPromise, modKeysPromise].map((promise) => {
        return promise.then((keyFiles) => {
          return Promise.all(keyFiles.map((keyFile) => {
            return fs.promises.copyFile(keyFile, path.join(keysFolder, path.basename(keyFile)))
          }))
        })
      })).catch((err) => {
        console.error('Error copying keys:', err)
      })
    })
}

function copyFiles (config, serverFolder) {
  const configFileExtensions = (config.virtualServer && config.virtualServer.fileExtensions) || []
  const allowedFileExtensions = _.uniq(requiredFileExtensions.concat(configFileExtensions))

  return fs.promises.readdir(config.path)
    .then((files) => {
      // Copy needed files, file symlinks on Windows are sketchy
      const serverFiles = files.filter((file) => allowedFileExtensions.indexOf(path.extname(file)) >= 0 || path.basename(file) === 'arma3server' || path.basename(file) === 'arma3server_x64')
      return Promise.all(serverFiles.map((file) => {
        return fs.promises.copyFile(path.join(config.path, file), path.join(serverFolder, file))
      }))
    })
}

function createModFolders (config, serverFolder, mods) {
  // Create virtual folders from default Arma and mods
  const configFolders = (config.virtualServer && config.virtualServer.folders) || []
  const serverMods = config.serverMods || []
  const symlinkFolders = _.uniq(serverFolders
    .concat(configFolders)
    .concat(serverMods)
    .map(function (folder) {
      return folder.split(path.sep)[0]
    })
  )

  const symlinkedConfigFolders = Promise.all(symlinkFolders.map((symlink) => {
    return fs.promises.access(path.resolve(config.path, symlink))
      .then(() => {
        return fs.promises.symlink(path.resolve(config.path, symlink), path.resolve(serverFolder, symlink), 'junction')
          .catch((err) => {
            console.error('Could create symlink for', symlink, 'due to', err)
          })
      })
      .catch(() => {})
  }))

  const symlinkedWorkshopFolders = Promise.all(mods.map((mod) => {
    const id = mod.split(path.sep).pop()
    return fs.promises.symlink(mod, path.resolve(serverFolder, id), 'junction')
      .catch((err) => {
        console.error('Could create symlink for', symlink, 'due to', err)
      })
  }))

  return Promise.all(symlinkedConfigFolders + symlinkedWorkshopFolders)
}

module.exports.create = function (config, mods) {
  return fs.promises.mkdtemp(path.join(os.tmpdir(), 'arma-server-'))
    .then((serverFolder) => {
      console.log('Created virtual server folder:', serverFolder)

      return Promise.all([
        copyKeys(config, serverFolder, mods),
        copyFiles(config, serverFolder),
        createModFolders(config, serverFolder, mods)
      ]).then(() => {
        return serverFolder
      })
    })
}

module.exports.remove = function (folder, cb) {
  if (folder) {
    fsExtra.rmrf(folder, function (err) {
      if (err) {
        console.log('Error removing virtual server folder', err)
      }

      if (cb) {
        cb(err)
      }
    })
  }
}
