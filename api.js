var SDK = require('wunderlist')
var conf = require('./config')

var api = new SDK({
  'accessToken': conf.access_token,
  'clientID': conf.client_id
})

module.exports = api
