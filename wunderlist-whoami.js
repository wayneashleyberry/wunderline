#!/usr/bin/env node

var app = require('commander')
var chalk = require('chalk')
var api = require('./api')

app
  .description('Display effective user')
  .parse(process.argv)

api.get('/user', function (err, res, body) {
  if (body.error) {
    console.log(body)
    process.exit(-1)
  }
  console.log(body.name + ' <' + chalk.underline(body.email) + '>')
  process.exit()
})
