var cli = require('cli')
var SDK = require('wunderlist')
var conf = require('./config')

if (cli.options.debug) {
  SDK.prototype.setupLogging({
    'logLevel': 'debug',
    'logPattern': '*'
  })
}

var api = new SDK({
  'accessToken': conf.access_token,
  'clientID': conf.client_id
})

module.exports = api
