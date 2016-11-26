#!/usr/bin/env node

var app = require('commander')
var async = require('async')
var api = require('./lib/api')
var auth = require('./lib/auth')

app
  .description('Export your data')
  .option('--pretty', 'Pretty print output')
  .option('--completed', 'Export only completed tasks')
  .parse(process.argv)

function showProgress () {
  process.stderr.write('.')
}

function getUser (callback) {
  api('/user', function (err, res, body) {
    if (err) process.exit(1)

    showProgress()
    callback(null, {user: body})
  })
}

function getLists (callback) {
  api('/lists', function (err, res, body) {
    if (err) process.exit(1)

    showProgress()
    callback(null, {lists: body})
  })
}

function embedLists (data, callback) {
  var lists = []
  async.each(data.lists, function (list, complete) {
    var queryOptions = {
      list_id: list.id,
      completed: app.completed
    }
    async.parallel([
      function getTasks (cb) {
        api({url: '/tasks', qs: queryOptions}, function (err, res, body) {
          showProgress()
          cb(err, body)
        })
      },
      function getSubtasks (cb) {
        api({url: '/subtasks', qs: queryOptions}, function (err, res, body) {
          showProgress()
          cb(err, body)
        })
      },
      function getNotes (cb) {
        api({url: '/notes', qs: queryOptions}, function (err, res, body) {
          if (err) process.exit(1)
          showProgress()
          cb(err, body)
        })
      },
      function getFiles (cb) {
        api({url: '/files', qs: queryOptions}, function (err, res, body) {
          showProgress()
          cb(err, body)
        })
      }
    ], function (err, results) {
      if (err) process.exit(1)

      var tasks = results[0]
      var subtasks = results[1]
      var notes = results[2]
      var files = results[3]
      tasks.forEach(function (task, index) {
        tasks[index].subtasks = []
        tasks[index].notes = []
        tasks[index].files = []
      })
      subtasks.forEach(function (subtask) {
        tasks.forEach(function (task, index) {
          if (task.id === subtask.task_id) {
            tasks[index].subtasks.push(subtask)
          }
        })
      })
      notes.forEach(function (note) {
        tasks.forEach(function (task, index) {
          if (task.id === note.task_id) {
            tasks[index].notes.push(note)
          }
        })
      })
      files.forEach(function (file) {
        tasks.forEach(function (task, index) {
          if (task.id === file.task_id) {
            tasks[index].files.push(file)
          }
        })
      })
      list.tasks = tasks
      lists.push(list)
      complete()
    })
  }, function (err) {
    if (err) process.exit(1)

    data.lists = lists
    callback(err, data)
  })
}

function getEmbeddedLists (callback) {
  async.waterfall([
    getLists,
    embedLists
  ], function (err, data) {
    if (err) process.exit(1)

    callback(err, data)
  })
}

function main () {
  async.parallel([
    getUser,
    getEmbeddedLists
  ], function (err, results) {
    if (err) process.exit(1)

    var data = {
      exported_at: new Date(),
      data: {
        user: results[0].user,
        lists: results[1].lists
      }
    }

    var output

    if (app.pretty) {
      output = JSON.stringify(data, null, 2)
    } else {
      output = JSON.stringify(data)
    }

    process.stdout.write(output)
  })
}

auth(main)
