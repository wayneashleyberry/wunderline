#!/usr/bin/env node

var app = require('commander')
var pkg = require('./package.json')

app
  .version(pkg.version)
  .command('ls', 'List all of your tasks')
  .command('add [task]', 'Add a task to your inbox')
  .command('open', 'Open Wunderlist')
  .command('whoami', 'Display effective user')
  .command('flush', 'Flush the application cache')
  .parse(process.argv)
