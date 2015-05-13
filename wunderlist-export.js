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
    var tasks = []
    async.each(data.user.lists, function (list, complete) {
      api.get({url: '/tasks', qs: {list_id: list.id}}, function (err, res, body) {
        progress()
        tasks[list.id] = body
        complete()
      })
    }, function () {
      data.user.lists.forEach(function (list, index) {
        data.user.lists[index].tasks = tasks[list.id]
      })
      callback(null, data)
    })
  }
], function (err, data) {
  process.stdout.write(JSON.stringify({data: data}, null, 2))
});
