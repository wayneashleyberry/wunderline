#!/usr/bin/env node

var app = require('commander')
var api = require('./lib/api')
var auth = require('./lib/auth')
var Configstore = require('configstore');
var conf = new Configstore('wunderline');
var chalk = require('chalk')

app
  .description('Display effective user')
  .parse(process.argv)

function main () {
  api('/user', function (err, res, body) {
    if (err || body.error) {
      console.error(JSON.stringify(err || body.error, null, 2))
      process.exit(1)
    }
    console.log(body.name + ' <' + body.email + '>')
    console.log(chalk.dim('Authenticated at ' + conf.get('authenticated_at')))
    process.exit()
  })
}

auth(main)
