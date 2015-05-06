#!/usr/bin/env node

var cli = require('cli')
var fs = require('fs')

var conf = {}
require('rc')('wunderlist-cli', conf)

var packageJson = fs.readFileSync(__dirname + '/package.json', {encoding: 'utf-8'})
packageJson = JSON.parse(packageJson)

cli.setApp('wunderlist-cli', packageJson.version)
cli.enable('version')

cli.parse(null, ['add', 'whoami', 'flush'])

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
  var command = require('./commands/flush')
  command()
}
