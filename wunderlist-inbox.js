#!/usr/bin/env node

var app = require('commander')
var async = require('async')
var api = require('./api')
var print = require('./print')
var getInbox = require('./inbox')

app
  .description('View your inbox')
  .parse(process.argv)

async.waterfall([
  function (callback) {
    getInbox(function (inbox) {
      callback(null, inbox)
    })
  },
  function (inbox, callback) {
    api.get({url: '/tasks', qs: {list_id: inbox.id}}, function (err, res, body) {
      if (err) process.exit(1)
      inbox.tasks = body
      callback(null, inbox)
    })
  }
], function (err, inbox) {
  if (err) {
    process.exit(1)
  }
  print(inbox)
})
