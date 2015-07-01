#!/usr/bin/env node

var app = require('commander')
var async = require('async')
var api = require('./util/api')
var printList = require('./util/print-list')
var getInbox = require('./util/get-inbox')

app
  .description('View your inbox')
  .parse(process.argv)

async.waterfall([
  function (callback) {
    getInbox(function (list) {
      callback(null, list)
    })
  },
  function (list, callback) {
    async.parallel([
      function (cb) {
        api({url: '/tasks', qs: {list_id: list.id}}, function (err, res, body) {
          if (err) process.exit(1)
          cb(null, body)
        })
      },
      function (cb) {
        api({url: '/subtasks', qs: {list_id: list.id}}, function (err, res, body) {
          if (err) process.exit(1)
          cb(null, body)
        })
      }
    ], function (err, results) {
      if (err) process.exit(1)
      list.tasks = results[0]
      list.subtasks = results[1]
      callback(null, list)
    })
  }
], function (err, list) {
  if (err) {
    process.exit(1)
  }
  printList(list)
})

