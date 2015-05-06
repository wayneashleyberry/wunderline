#!/usr/bin/env node

var cli = require('cli')
var fs = require('fs')
var sdk = require('wunderlist');

var conf = {};
require('rc')('wunderlist-cli', conf);

var packageJson = fs.readFileSync(__dirname + '/package.json', {encoding: 'utf-8'})
packageJson = JSON.parse(packageJson)

cli.setApp('wunderlist-cli', packageJson.version)
cli.enable('version')

var api = new sdk({
  'accessToken': conf.access_token,
  'clientID': conf.client_id
});

var commands = {
  add: ['a', 'Add a new task to your inbox', 'task'],
  whoami: [null, 'Display effective user'],
}

cli.parse(commands, ['add', 'whoami'])

if (cli.command === 'add') {
  var title = cli.args.join(' ');
  var req = api.http.lists.all();
  req.then(function(res) {
    var list_id = res[0].id;
    var req = api.http.tasks.create({
      list_id: list_id,
      title: title
    });
    req.then(function(res) {
      console.log('Created task ' + res.id);
      process.exit();
    });
  });
}

if (cli.command === 'whoami') {
  var req = api.http.user.all();

  req.then(function(user) {
    console.log(user.name + ' <' + user.email + '>');
    process.exit();
  });
}
