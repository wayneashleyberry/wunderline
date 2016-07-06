var app = require('commander')
var inquirer = require('inquirer')
var request = require('request')
var Configstore = require('configstore')
var conf = new Configstore('wunderline')
var wrap = require('wordwrap')(80)

app
  .description('Authenticate Wunderline')
  .parse(process.argv)

var questions = [
  {
    name: 'client_id',
    message: 'CLIENT ID',
    validate: function (input) {
      return input.length > 0
    }
  },
  {
    name: 'access_token',
    message: 'ACCESS TOKEN',
    validate: function (input) {
      return input.length > 0
    }
  }
]

console.log(wrap('Please create a Wunderlist Application before you proceed, you can do so over here: https://developer.wunderlist.com/apps/new, once that is done please enter your access token and client id below.'))

inquirer.prompt(questions).then(function (answers) {
  request.get({
    json: true,
    url: 'https://a.wunderlist.com/api/v1/user',
    headers: {
      'X-Access-Token': answers.access_token,
      'X-Client-ID': answers.client_id
    }
  }, function (err, res, body) {
    if (err || body.error) {
      console.error(JSON.stringify(err || body.error, null, 2))
      process.exit(1)
    } else if (body.invalid_request || body.unauthorized) {
      console.error('Authentication failed (wrong CLIENT ID and/or ACCESS TOKEN)!')
      process.exit(1)
    }
    conf.set('authenticated_at', new Date())
    conf.set('client_id', answers.client_id)
    conf.set('access_token', answers.access_token)
    console.log('Thanks ' + body.name.split(' ')[0] + ', Wunderline has been authenticated.')
  })
})
