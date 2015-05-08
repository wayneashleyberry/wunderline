#!/usr/bin/env node

var app = require('commander')
var chalk = require('chalk')
var async = require('async')
var columnify = require('columnify')
var moment = require('moment')
var api = require('./api')
var skipEmptyLists = true

app
  .description('List all of your tasks')
  .option('-l, --limit <n>', 'Limit the amount of tasks per list', parseInt, 0)
  .option('-s, --starred', 'Only show starred tasks')
  .parse(process.argv)

var print = {}

print.list = function (list) {
  var listTitle = list.title.toUpperCase()

  list.tasks.sort(function (a, b) {
    if (a.starred) return -1
    if (b.starred) return 1
    return 0
  })

  if (app.starred) {
    list.tasks = list.tasks.filter(function (task) {
      return task.starred
    })
  }

  if (skipEmptyLists && list.tasks.length === 0) {
    return
  }

  console.log(chalk.underline(listTitle + ' (' + list.tasks.length + ')'))
  print.tasks(list.tasks)
  console.log('')
}

print.tasks = function (tasks) {
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

  if (app.limit) {
    tasks.splice(app.limit)
  }

  var columns = tasks.map(print.formatTask)
  console.log(columnify(columns, options))
}

print.formatTask = function (task) {
  var star = task.starred ? chalk.red('★') : chalk.dim('☆')
  var due = task.due_date ? chalk.blue(moment(task.due_date).format('ddd D MMMM')) : ''
  return {
    title: task.title,
    due: due,
    starred: star
  }
}

async.waterfall([
  function (cb) {
    api.get('/lists', function (err, res, body) {
      if (err) process.exit(-1)
      cb(null, body)
    })
  },
  function (lists, cb) {
    var listsWithTasks = []

    async.eachLimit(lists, 10, function (list, done) {
      api.get({url: '/tasks', qs: {list_id: list.id}}, function (err, res, body) {
        if (err) process.exit(-1)
        list.tasks = body
        listsWithTasks.push(list)
        done()
      })
    }, function (err) {
      if (err) process.exit(-1)
      cb(null, listsWithTasks)
    })
  }
], function (err, lists) {
  if (err) process.exit(-1)

  lists.sort(function (a, b) {
    if (a.title === 'inbox') return -1
    if (b.title === 'inbox') return 1
    return a.title > b.title
  }).forEach(function (list) {
    print.list(list)
  })
})
