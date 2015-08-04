#!/usr/bin/env node

var app = require('commander')
var chalk = require('chalk')
var api = require('./lib/api')
var auth = require('./lib/auth')

app
  .description('Display effective user')
  .parse(process.argv)

function main () {
  api('/user', function (err, res, body) {
    if (err || body.error) {
      console.error(JSON.stringify(err || body.error, null, 2))
      process.exit(1)
    }
    console.log(body.name + ' <' + chalk.underline(body.email) + '>')
    process.exit()
  })
}

auth(main)
