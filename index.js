#!/usr/bin/env node

require('dotenv').load();

var sdk = require('wunderlist');
var cli = require('cli')
var fs = require('fs')

var packageJson = fs.readFileSync('./package.json', {encoding: 'utf-8'})
packageJson = JSON.parse(packageJson)

cli.setApp('wunderlist-cli', packageJson.version)
cli.enable('version')

var commands = {
  add: ['a', 'Add a new task to your inbox', 'task'],
}

cli.parse(commands, ['add'])

var api = new sdk({
  'accessToken': process.env.ACCESS_TOKEN,
  'clientID': process.env.CLIENT_ID
});

if (cli.command === 'add') {
  var title = cli.args.join(' ');
  var req = api.http.lists.all();
  req.done(function(res) {
    var list_id = res[0].id;
    var req = api.http.tasks.create({
      title: title,
      list_id: list_id
    });

    req.done(function() {
      process.exit();
    });
  });
}
