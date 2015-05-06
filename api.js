var SDK = require('wunderlist')

var conf = {}
require('rc')('wunderlist-cli', conf)

var api = new SDK({
  'accessToken': conf.access_token,
  'clientID': conf.client_id
})

module.exports = api;
