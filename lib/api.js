var request = require('request')
var Configstore = require('configstore');
var conf = new Configstore('wunderline');

module.exports = request.defaults({
  method: 'get',
  json: true,
  baseUrl: 'https://a.wunderlist.com/api/v1',
  headers: {
    'X-Access-Token': conf.get('access_token'),
    'X-Client-ID': conf.get('client_id')
  }
})
