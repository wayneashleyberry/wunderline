var request = require('request')
var config = require('./config')

var r = request.defaults({
  json: true,
  baseUrl: 'https://a.wunderlist.com/api/v1',
  headers: {
    'X-Access-Token': config.access_token,
    'X-Client-ID': config.client_id
  }
})

module.exports = r
