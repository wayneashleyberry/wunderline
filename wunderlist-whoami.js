#!/usr/bin/env node

var app = require('commander')
var chalk = require('chalk')
var api = require('./api')

app
  .description('Display effective user')
  .parse(process.argv)

api.get('/user', function(err, res, body) {
  console.log(body.name + ' <' + chalk.underline(body.email) + '>')
  process.exit()
});
