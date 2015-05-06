#!/usr/bin/env node

var cli = require('cli')
var fs = require('fs')
var sdk = require('wunderlist');
var dirty = require('dirty');
var db = dirty(__dirname + '/cache.db');

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
  db.on('load', function() {
    var title = cli.args.join(' ');
    var list_id = db.get('inbox_id');
    var task = {
      title: title,
      list_id: list_id
    }
    if (task.list_id) {
      addTask(task, function(task) {
        console.log('Created task ' + task.id);
        process.exit();
      });
    } else {
      var req = api.http.lists.all();
      req.then(function(res) {
        task.list_id = res[0].id;
        db.set('inbox_id', list_id);
        addTask(task, function(task) {
          console.log('Created task ' + task.id);
          process.exit();
        });
      });
    }

  });
}

function addTask(task, cb) {
  var req = api.http.tasks.create(task);
  req.then(function(res) {
    cb(res);
  });
}

if (cli.command === 'whoami') {
  var req = api.http.user.all();

  req.then(function(user) {
    console.log(user.name + ' <' + user.email + '>');
    process.exit();
  });
}
