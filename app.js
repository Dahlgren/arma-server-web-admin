var express = require('express')
var streams = require('stream')
var bodyParser = require('body-parser')
var expressRequestLogger = require('./lib/express-request-logger')
var path = require('path')
var serveStatic = require('serve-static')

var config = require('./config')
var log = require('./lib/logger')
var setupBasicAuth = require('./lib/setup-basic-auth')
var Manager = require('./lib/manager')
var Missions = require('./lib/missions')
var Mods = require('./lib/mods')
var Logs = require('./lib/server-log-paths')

var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

setupBasicAuth(config, app)

app.set('json replacer', function (key, value) {
  if (value && value instanceof streams.Stream) {
    return 'STREAM'
  }
  return value
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressRequestLogger)

app.use(serveStatic(path.join(__dirname, 'public')))

var logs = new Logs(config)

var manager = new Manager(config, logs)
manager.load()

var missions = new Missions(config)
var mods = new Mods(config)
mods.updateMods()

app.use('/api/logs', require('./routes/logs')(logs))
app.use('/api/missions', require('./routes/missions')(missions))
app.use('/api/mods', require('./routes/mods')(mods))
app.use('/api/servers', require('./routes/servers')(manager, mods))
app.use('/api/settings', require('./routes/settings')(config))

io.on('connection', function (socket) {
  socket.emit('mods', mods.mods)
  socket.emit('servers', manager.getServers())
})

mods.on('mods', function (mods) {
  io.emit('mods', mods)
})

manager.on('servers', function () {
  io.emit('servers', manager.getServers())
})

server.listen(config.port, config.host)
