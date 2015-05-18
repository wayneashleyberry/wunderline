#!/usr/bin/env node

var app = require('commander')
var async = require('async')
var api = require('./util/api')

app
  .description('Export your data')
  .parse(process.argv)

function showProgress () {
  process.stderr.write('.')
}

function getUser(callback) {
  api('/user', function (err, res, body) {
    if (err) process.exit(1)

    showProgress()
    callback(null, {user: body})
  })
}

function getLists(data, callback) {
  api('/lists', function (err, res, body) {
    if (err) process.exit(1)

    showProgress()
    data.user.lists = body
    callback(null, data)
  })
}

function embedLists(data, callback) {
  var lists = []
  async.each(data.user.lists, function (list, complete) {
    async.parallel([
      function getTasks (cb) {
        api({url: '/tasks', qs: {list_id: list.id}}, function (err, res, body) {
          showProgress()
          cb(err, body)
        })
      },
      function getSubtasks (cb) {
        api({url: '/subtasks', qs: {list_id: list.id}}, function (err, res, body) {
          showProgress()
          cb(err, body)
        })
      },
      function getNotes (cb) {
        api({url: '/notes', qs: {list_id: list.id}}, function (err, res, body) {
          if (err) process.exit(1)

          showProgress()
          cb(err, body)
        })
      },
      function getFiles (cb) {
        api({url: '/files', qs: {list_id: list.id}}, function (err, res, body) {
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

    data.user.lists = lists
    callback(err, data)
  })
}

async.waterfall([
  getUser,
  getLists,
  embedLists
], function (err, data) {
  if (err) process.exit(1)

  process.stdout.write(JSON.stringify({data: data}, null, 2))
})
