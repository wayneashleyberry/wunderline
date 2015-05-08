#!/usr/bin/env node

var app = require('commander')
var pckg = require('./package.json')

app
  .version(pckg.version)
  .command('ls', 'List all of your tasks')
  .command('add [task]', 'Add a task to your inbox')
  .command('open', 'Open Wunderlist')
  .command('whoami', 'Display effective user')
  .command('flush', 'Flush the application cache')
  .parse(process.argv)
