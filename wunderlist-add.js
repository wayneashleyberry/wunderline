#!/usr/bin/env node

var app = require('commander')
var async = require('async')
var stdin = require('get-stdin')
var truncate = require('truncate')
var moment = require('moment')
var api = require('./util/api')
var getInbox = require('./util/get-inbox')
var opn = require('opn')
var config = require('./util/config')

function openTask (task) {
  var web = 'https://www.wunderlist.com/#/tasks/' + task.id
  var mac = 'wunderlist://tasks/' + task.id
  if (config.platform === 'mac') return opn(mac)
  opn(web)
}

function openList (list) {
  var web = 'https://www.wunderlist.com/#/lists/' + list.id
  var mac = 'wunderlist://lists/' + list.id
  if (config.platform === 'mac') return opn(mac)
  opn(web)
}

app
  .description('Add a task to your inbox')
  .usage('[task]')
  .option('-l, --list [name]', 'Specify a list other than your inbox')
  .option('--today', 'Set the due date to today')
  .option('--tomorrow', 'Set the due date to tomorrow')
  .option('--due [date]', 'Set a specific due date')
  .option('-o, --open', 'Open Wunderlist on completion')
  .option('-s, --stdin', 'Create tasks from stdin')
  .parse(process.argv)

var due_date

if (app.today) {
  due_date = moment().format('YYYY-MM-DD')
}

if (app.tomorrow) {
  due_date = moment().add(1, 'day').format('YYYY-MM-DD')
}

if (app.due && /\d{4}\-\d{2}\-\d{2}/.test(app.due)) {
  due_date = app.due
}

function truncateTitle (title) {
  return truncate(title.trim(), 254, {ellipsis: '…'})
}

function getListId (cb) {
  if (!app.list) {
    return getInbox(function (inbox) {
      cb(inbox.id)
    })
  }

  var list = {
    title: app.list.trim()
  }

  api('/lists', function (err, res, body) {
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
        title: truncateTitle(title),
        list_id: inbox_id,
        due_date: due_date
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
    if (app.open) {
      openTask(res)
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
            title: truncateTitle(line),
            due_date: due_date,
            list_id: list_id
          }
        })
      cb(null, tasks)
    }
  ], function (err, tasks) {
    if (err) {
      process.exit(1)
    }

    async.each(tasks, function (task, finished) {
      api.post({url: '/tasks', body: task}, function (err, res, body) {
        if (err || body.error) {
          console.log(err || body.error)
          process.exit(1)
        }
        process.stderr.write('.')
        finished()
      })
    }, function () {
      if (app.open && tasks.length > 0) {
        openList({id: tasks[0].list_id})
      }

      process.exit()
    })
  })
}
