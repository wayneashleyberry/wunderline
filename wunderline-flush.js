#!/usr/bin/env node

var app = require('commander')
var Configstore = require('configstore');
var conf = new Configstore('wunderline');

app
  .description('Clears the application storage')
  .parse(process.argv)

conf.clear()
