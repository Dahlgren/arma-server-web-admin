var express = require('express')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var path = require('path')
var serveStatic = require('serve-static')
var webpack = require('webpack')
var webpackMiddleware = require('webpack-dev-middleware')

var config = require('./config')
var webpackConfig = require('./webpack.config')
var setupBasicAuth = require('./lib/setup-basic-auth')
var Manager = require('./lib/manager')
var Missions = require('./lib/missions')
var Mods = require('./lib/mods')
var Logs = require('./lib/logs')
var Settings = require('./lib/settings')

var app = express()
var server = require('http').Server(app)

setupBasicAuth(config, app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

morgan.token('user', function (req) { return req.auth ? req.auth.user : 'anon' })
app.use(morgan(config.logFormat || 'dev'))

var logs = new Logs(config)

var manager = new Manager(config, logs)
manager.load()

var missions = new Missions(config)
var mods = new Mods(config)
mods.updateMods()

var settings = new Settings(config)

var baseUrl = config.baseUrl || '/'
var router = express.Router()

router.use('/api/logs', require('./routes/logs')(logs))
router.use('/api/missions', require('./routes/missions')(missions))
router.use('/api/mods', require('./routes/mods')(mods))
router.use('/api/servers', require('./routes/servers')(manager, mods))
router.use('/api/settings', require('./routes/settings')(settings))
router.use('/', require('./routes/main')(baseUrl))
router.use(serveStatic(path.join(__dirname, 'public')))

app.use(baseUrl, router)

var io = require('socket.io')(server, {
  path: baseUrl + 'socket.io'
})

io.on('connection', function (socket) {
  socket.emit('missions', missions.missions)
  socket.emit('mods', mods.mods)
  socket.emit('servers', manager.getServers())
  socket.emit('settings', settings.getPublicSettings())
})

missions.on('missions', function (missions) {
  io.emit('missions', missions)
})

mods.on('mods', function (mods) {
  io.emit('mods', mods)
})

manager.on('servers', function () {
  io.emit('servers', manager.getServers())
})

if (require.main === module) {
  var webpackCompiler = webpack(webpackConfig)

  app.use(webpackMiddleware(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath
  }))

  server.listen(config.port, config.host)
}

module.exports = app
