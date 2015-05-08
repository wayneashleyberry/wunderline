#!/usr/bin/env node

var app = require('commander')
var chalk = require('chalk')
var async = require('async')
var moment = require('moment')
var api = require('./api')
var skipEmptyLists = true;

app
  .description('List all of your tasks')
  .parse(process.argv)

var print = {};

print.list = function(list) {
  var listTitle = list.title.toUpperCase();
  console.log(chalk.underline(listTitle + ' (' + list.tasks.length + ')'))

  list.tasks.sort(function (a, b) {
    if (a.starred) return -1;
    if (b.starred) return 1;
    return 0
  }).forEach(function(task) {
    print.task(task)
  })

  console.log('')
}

print.task = function(task) {
  var star = task.starred ? chalk.red('★ ') : '';
  var due  = task.due_date ? ' ' + chalk.blue(moment(task.due_date).format('ddd D MMMM')) : '';
  console.log(star + task.title + due);
}

async.waterfall([
  function(cb) {
    api.get('/lists', function(err, res, body) {
      cb(null, body)
    })
  },
], function (err, lists) {
  async.eachLimit(lists, 6, function(list, cb) {
    api.get({url: '/tasks', qs: {list_id: list.id}}, function(err, res, body) {
      if (skipEmptyLists && body.length > 0) {
        list.tasks = body;
        print.list(list)
      }
      cb()
    })
  })
})
