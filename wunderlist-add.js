#!/usr/bin/env node

var app = require('commander')
var async = require('async')
var stdin = require('get-stdin')
var api = require('./util/api')
var getInbox = require('./util/get-inbox')

app
  .description('Add a task to your inbox')
  .usage('[task]')
  .option('-s, --stdin', 'Create tasks from stdin')
  .option('-l, --list [name]', 'Specify a list other than your inbox')
  .parse(process.argv)

function getListId (cb) {
  if (!app.list) {
    return getInbox(function (inbox) {
      cb(inbox.id)
    })
  }

  var list = {
    title: app.list.trim()
  }

  api.get('/lists', function (err, res, body) {
    if (err) process.exit(1)

    var existing = body.filter(function (item) {
      return item.title.toLowerCase().trim() === list.title.toLowerCase()
    })
    if (existing.length > 0) {
      return cb(existing[0].id)
    }
    api.post({url: '/lists', body: list}, function (err, res, body) {
      if (err) process.exit(1)

      cb(body.id)
    })
  })
}

if (typeof app.stdin === 'undefined') {
  var title = app.args.join(' ')

  if (!title) {
    process.exit(1)
  }

  async.waterfall([
    function (cb) {
      getListId(function (inbox_id) {
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
          process.exit(1)
        }
        cb(null, body)
      })
    }
  ], function (err, res) {
    if (err) {
      process.exit(1)
    }
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
      getListId(function (list_id) {
        cb(null, list_id, lines)
      })
    },
    function (list_id, lines, cb) {
      var tasks = lines
        .filter(function (line) {
          return line.trim().length > 0
        })
        .map(function (line) {
          return {
            title: line,
            list_id: list_id
          }
        })
      cb(null, tasks)
    }
  ], function (err, tasks) {
    if (err) {
      process.exit(1)
    }

    async.eachLimit(tasks, 6, function (task, finished) {
      api.post({url: '/tasks', body: task}, function (err, res, body) {
        if (err || body.error) {
          console.log(err || body.error)
          process.exit(1)
        }
        process.stderr.write('.')
        finished()
      })
    }, function () {
      process.exit()
    })
  })
}
