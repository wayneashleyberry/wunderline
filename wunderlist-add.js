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

function getInboxId (cb) {
  var cached = db.get('inbox_id')

  if (cached) {
    cb(cached)
  } else {
    api.get('/lists', function (err, res, body) {
      if (err || body.error) {
        console.log(err || body.error)
        process.exit(-1)
      }
      var id = body[0].id
      db.set('inbox_id', id)
      cb(id)
    })
  }
}

if (typeof app.stdin === 'undefined') {
  var title = app.args.join(' ')

  if (!title) {
    process.exit(-1)
  }

  async.waterfall([
    function (cb) {
      getInboxId(function (inbox_id) {
        cb(null, inbox_id)
      })
    },
    function (inbox_id, cb) {
      cb(null, {
        title: title,
        list_id: inbox_id
      })
    },
    function (task, cb) {
      api.post({url: '/tasks', body: task}, function (err, res, body) {
        if (err || body.error) {
          console.log(err || body.error)
          process.exit(-1)
        }
        cb(null, body)
      })
    }
  ], function (err, res) {
    if (err) {
      process.exit(-1)
    }
    console.log('Created task ' + res.id)
    process.exit()
  })
}

if (app.stdin === true) {
  async.waterfall([
    function (cb) {
      stdin(function (data) {
        var sep = data.indexOf('\r\n') !== -1 ? '\r\n' : '\n'
        var lines = data.trim().split(sep)
        cb(null, lines)
      })
    },
    function (lines, cb) {
      getInboxId(function (inbox_id) {
        cb(null, inbox_id, lines)
      })
    },
    function (inbox_id, lines, cb) {
      var tasks = lines
        .filter(function (line) {
          return line.trim().length > 0
        })
        .map(function (line) {
          return {
            title: line,
            list_id: inbox_id
          }
        })
      cb(null, tasks)
    }
  ], function (err, tasks) {
    if (err) {
      process.exit(-1)
    }

    async.eachLimit(tasks, 6, function (task, finished) {
      api.post({url: '/tasks', body: task}, function (err, res, body) {
        if (err || body.error) {
          console.log(err || body.error)
          process.exit(-1)
        }
        console.log('Created task ' + body.id)
        finished()
      })
    }, function () {
      process.exit()
    })
  })
}
