#!/usr/bin/env node

var app = require('commander')
var chalk = require('chalk')
var api = require('./api')

app
  .description('Display effective user')
  .parse(process.argv)

var req = api.http.user.all()

req.then(function (user) {
  console.log(user.name + ' <' + chalk.underline(user.email) + '>')
  process.exit()
})
