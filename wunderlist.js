#!/usr/bin/env node

var app = require('commander')
var fs = require('fs')

var json = JSON.parse(fs.readFileSync(__dirname + '/package.json'))

app
  .version(json.version)
  .command('add [task]', 'Add a task to your inbox')
  .command('open', 'Open Wunderlist')
  .command('whoami', 'Display effective user')
  .command('flush', 'Flush the application cache')
  .parse(process.argv)
