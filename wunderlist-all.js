#!/usr/bin/env node

var app = require('commander')
var async = require('async')
var api = require('./api')
var print = require('./print')

app
  .description('View all of your tasks')
  .parse(process.argv)

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
