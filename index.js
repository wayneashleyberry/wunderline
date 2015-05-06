#!/usr/bin/env node

var cli = require('cli')
var stdin = require('stdin')
var conf = require('./config')

cli.parsePackageJson(__dirname + '/package.json')
cli.enable('version')

cli.parse(null, ['add', 'open', 'whoami', 'flush'])

if (cli.command === 'add') {
  var add = require('./commands/add')

  if (!cli.options.stdin) {
    add.single({
      title: cli.args.join(' ')
    }, function () {
      process.exit()
    })
  }

  if (cli.options.stdin) {
    stdin(function (data) {
      var sep = data.indexOf('\r\n') !== -1 ? '\r\n' : '\n'
      var lines = data.trim().split(sep)
      var tasks = lines.map(function (line) {
        return {title: line}
      })
      add.multiple(tasks, function () {
        process.exit()
      })
    })
  }
}

if (cli.command === 'whoami') {
  var command = require('./commands/whoami')
  command()
}

if (cli.command === 'flush') {
  var command = require('./commands/flush')
  command()
}

if (cli.command === 'open') {
  require('./commands/open')()
}
