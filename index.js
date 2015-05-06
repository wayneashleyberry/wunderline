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
  var add = require('./commands/add')

  var stdin = '';

  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      stdin += chunk;
    }
  });

  process.stdin.on('end', function() {
    var sep = stdin.indexOf('\r\n') !== -1 ? '\r\n' : '\n';
    var lines = stdin.trim().split(sep);

    var tasks = lines.map(function(line) {
      return {
        title: line
      };
    });

    if (cli.args.length > 0) {
      tasks.push({
        title: cli.args.join(' ')
      });
    }

    add.multiple(tasks, function() {
      process.exit();
    });
  });
}

if (cli.command === 'whoami') {
  var command = require('./commands/whoami')
  command()
}

if (cli.command === 'flush') {
  var command = require('./commands/flush')
  command()
}
