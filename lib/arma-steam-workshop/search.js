var filesize = require('filesize')
var SteamWorkshop = require('steam-workshop')
var steamWorkshop = new SteamWorkshop()

const BASE_URL = 'https://steamcommunity.com/sharedfiles/filedetails/'

function formatItem (item) {
  return {
    created: item.created,
    description: item.short_description,
    fileSize: item.file_size,
    fileSizeFormatted: item.file_size ? filesize(item.file_size) : undefined,
    id: item.publishedfileid,
    image: item.preview_url,
    link: BASE_URL + item.publishedfileid,
    subscriptions: item.subscriptions,
    title: item.title,
    updated: item.updated
  }
}

function createQuery (text, apiKey) {
  return {
    appid: 107410,
    key: apiKey,
    numperpage: 100,
    return_metadata: 1,
    return_short_description: 1,
    search_text: text
  }
}

module.exports = function (text, apiKey, callback) {
  if (!text) {
    return callback(new Error('Missing text parameter'))
  }

  steamWorkshop.queryFiles(createQuery(text, apiKey), function (err, mods) {
    if (err) {
      return callback(err)
    }

    // Remove missions from result, missions contains a filename, mods don't
    mods = mods.filter(function (item) {
      return item.result === 1 && !item.filename
    })

    return callback(null, mods.map(formatItem))
  })
}
