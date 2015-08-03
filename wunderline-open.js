#!/usr/bin/env node

var app = require('commander')
var opn = require('opn')
var conf = require('./lib/config')

app
  .description('Opens Wunderlist')
  .parse(process.argv)

if (conf.platform === 'mac') {
  opn('wunderlist://')
  process.exit()
} else {
  opn('https://www.wunderlist.com/#/lists/inbox')
  process.exit()
}
