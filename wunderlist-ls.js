#!/usr/bin/env node

var app = require('commander')
var chalk = require('chalk')
var async = require('async')
var columnify = require('columnify')
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
  })

  print.tasks(list.tasks)

  console.log('')
}

print.tasks = function(tasks) {
  var options = {
    showHeaders: false,
    truncate: true,
    config: {
      title: {
        minWidth: 40,
        maxWidth: 40
      },
      due: {
        minWidth: 12
      }
    }
  }
  var columns = columnify(tasks.map(print.formatTask), options)
  console.log(columns)
}

print.formatTask = function(task) {
  var star = task.starred ? chalk.red('★') : chalk.dim('☆');
  var due  = task.due_date ? chalk.blue(moment(task.due_date).format('ddd D MMMM')) : '';
  return {
    title: task.title,
    due: due,
    starred: star
  }
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
