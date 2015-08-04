#!/usr/bin/env node

var app = require('commander')
var opn = require('opn')
var Configstore = require('configstore');
var conf = new Configstore('wunderline', {platform: 'web'});

app
  .description('Opens Wunderlist')
  .parse(process.argv)

if (conf.get('platform') === 'mac') {
  opn('wunderlist://')
  process.exit()
} else {
  opn('https://www.wunderlist.com/#/lists/inbox')
  process.exit()
}
