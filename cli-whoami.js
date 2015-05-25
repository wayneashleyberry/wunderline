#!/usr/bin/env node

var app = require('commander')
var chalk = require('chalk')
var api = require('./util/api')

app
  .description('Display effective user')
  .parse(process.argv)

api('/user', function (err, res, body) {
  if (err || body.error) {
    console.log(err || body.error)
    process.exit(1)
  }
  console.log(body.name + ' <' + chalk.underline(body.email) + '>')
  process.exit()
})
