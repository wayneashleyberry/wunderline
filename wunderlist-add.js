#!/usr/bin/env node

var app = require('commander')
var async = require('async')
var dirty = require('dirty')
var stdin = require('stdin')
var db = dirty('./cache.db')
var api = require('./api')

app
  .description('Add a task to your inbox')
  .usage('[task]')
  .option('-s, --stdin', 'Create tasks from stdin')
  .parse(process.argv)

function getInboxId(cb) {
  var cached = db.get('inbox_id');

  if (cached) {
    cb(cached)
  } else {
    var req = api.http.lists.all()

    req.then(function (res) {
      db.set('inbox_id', res[0].id)
      cb(res[0].id);
    })
  }
}

function createTask(task, cb) {
  var req = api.http.tasks.create(task)
  req.then(function (res) {
    cb(res)
  })
}

if (typeof app.stdin === 'undefined') {
  var title = app.args.join(' ')

  if (! title) {
    process.exit()
  }

  async.waterfall([
    function (cb) {
      getInboxId(function(inbox_id) {
        cb(null, inbox_id)
      })
    },
    function(inbox_id, cb) {
      cb(null, {
        title: title,
        list_id: inbox_id
      })
    },
    function(task, cb) {
      var req = api.http.tasks.create(task)
      req.then(function (res) {
        cb(null, res)
      })
    }
  ], function (err, res) {
    console.log('Created task ' + res.id)
    process.exit()
  })
}

if (app.stdin === true) {
  async.waterfall([
    function(cb) {
      stdin(function(data) {
        var sep = data.indexOf('\r\n') !== -1 ? '\r\n' : '\n'
        var lines = data.trim().split(sep)
        cb(null, lines)
      })
    },
    function(lines, cb) {
      getInboxId(function(inbox_id) {
        cb(null, inbox_id, lines)
      })
    },
    function(inbox_id, lines, cb) {
      cb(null, lines.map(function (line) {
        return {
          title: line,
          list_id: inbox_id
        }
      }))
    },
  ], function(err, tasks) {
    async.eachLimit(tasks, 6, function (task, finished) {
      var req = api.http.tasks.create(task)
      req.then(function (res) {
        console.log('Created task ' + res.id)
        finished()
      })
    }, function() {
      process.exit()
    })
  })
}
