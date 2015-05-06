#!/usr/bin/env node

var cli = require('cli')
var fs = require('fs')

var conf = {}
require('rc')('wunderlist-cli', conf)

var packageJson = fs.readFileSync(__dirname + '/package.json', {encoding: 'utf-8'})
packageJson = JSON.parse(packageJson)

cli.setApp('wunderlist-cli', packageJson.version)
cli.enable('version')

var commands = {
  add: [null, 'Add a new task to your inbox', 'task'],
  whoami: [null, 'Display effective user'],
  flush: [null, 'Flush the application cache']
}

cli.parse(commands, ['add', 'whoami', 'flush'])

if (cli.command === 'add') {
  var command = require('./commands/add')
  command({
    title: cli.args.join(' ')
  })
}

if (cli.command === 'whoami') {
  var command = require('./commands/whoami')
  command()
}

if (cli.command === 'flush') {
  try {
    fs.unlinkSync(__dirname + '/cache.db')
  } catch (e) {
    //
  }
  process.exit()
}
