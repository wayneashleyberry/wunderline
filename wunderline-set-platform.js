#!/usr/bin/env node

var app = require('commander')
var Configstore = require('configstore');
var conf = new Configstore('wunderline');

app
  .description('Set your preferred application platform')
  .usage('[platform]')
  .parse(process.argv)

if (app.args.length === 0) {
  return
}

var platform = app.args[0]

if (platform !== 'web' && platform !== 'mac') {
  console.log('Invalid platform')
  return
}

conf.set('platform', platform)
