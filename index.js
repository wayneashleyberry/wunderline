#!/usr/bin/env node

var cli = require('cli')
var fs = require('fs')

var packageJson = fs.readFileSync(__dirname + '/package.json', {encoding: 'utf-8'})
packageJson = JSON.parse(packageJson)

cli.setApp('wunderlist-cli', packageJson.version)
cli.enable('version')

var commands = {
  add: ['a', 'Add a new task to your inbox', 'task']
}

cli.parse(commands, ['add'])

if (cli.command === 'add') {
  //
}
