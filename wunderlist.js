#!/usr/bin/env node

var app = require('commander')
var pkg = require('./package.json')

app.version(pkg.version)
  .command('add [task]', 'Add a task to your inbox')
  .command('inbox', 'View your inbox')
  .command('starred', 'View your starred tasks')
  .command('today', 'View tasks due today')
  .command('week', 'View tasks due this week')
  .command('all', 'View all of your tasks')
  .command('open', 'Open Wunderlist')
  .command('whoami', 'Display effective user')
  .command('flush', 'Flush the application cache')

app.parse(process.argv)
