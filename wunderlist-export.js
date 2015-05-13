#!/usr/bin/env node

var app = require('commander')
var async = require('async')
var api = require('./util/api')

app
  .description('Export your data')
  .parse(process.argv)

function progress() {
  process.stderr.write('.')
}

async.waterfall([
  function (callback) {
    api.get('/user', function (err, res, body) {
      progress()
      callback(null, {user: body})
    })
  },
  function (data, callback) {
    api.get('/lists', function (err, res, body) {
      progress()
      data.user.lists = body
      callback(null, data)
    })
  },
  function (data, callback) {
    var lists = []
    async.each(data.user.lists, function (list, complete) {
      async.parallel([
        function getTasks (cb) {
          api.get({url: '/tasks', qs: {list_id: list.id}}, function (err, res, body) {
            progress()
            cb(err, body)
          })
        },
        function getSubtasks (cb) {
          api.get({url: '/subtasks', qs: {list_id: list.id}}, function (err, res, body) {
            progress()
            cb(err, body)
          })
        },
        function getNotes (cb) {
          api.get({url: '/notes', qs: {list_id: list.id}}, function (err, res, body) {
            progress()
            cb(err, body)
          })
        },
        function getFiles (cb) {
          api.get({url: '/files', qs: {list_id: list.id}}, function (err, res, body) {
            progress()
            cb(err, body)
          })
        }
      ], function (err, results) {
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
              tasks[index].files.push(note)
            }
          })
        })
        list.tasks = tasks
        lists.push(list)
        complete()
      })
    }, function (err) {
      data.user.lists = lists
      callback(err, data)
    })
  }
], function (err, data) {
  process.stdout.write(JSON.stringify({data: data}, null, 2))
});
