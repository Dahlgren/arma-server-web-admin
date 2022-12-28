for (var environmentVariable of ['GAME_TYPE', 'GAME_PATH']) {
  if (!process.env[environmentVariable]) {
    console.log('Missing required environment variable "' + environmentVariable + '"')
    process.exit(1)
  }
}

module.exports = {
  game: process.env.GAME_TYPE,
  path: process.env.GAME_PATH,
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  type: 'linux',
  additionalConfigurationOptions: process.env.SERVER_ADDITIONAL_CONFIG,
  parameters: (process.env.SERVER_PARAMETERS || '').split(','),
  serverMods: (process.env.SERVER_MODS || '').split(','),
  admins: (process.env.SERVER_ADMINS || '').split(','),
  auth: {
    username: process.env.AUTH_USERNAME,
    password: process.env.AUTH_PROCESS
  },
  prefix: process.env.SERVER_PREFIX,
  suffix: process.env.SERVER_SUFFIX,
  logFormat: process.env.LOG_FORMAT || 'dev'
}
