var cli = require('cli')
var dirty = require('dirty')
var db = dirty(__dirname + '/../cache.db')
var async = require('async')
var add = exports
var api = require('../api')

add.single = function (task, cb) {
  if (!task.title.trim()) {
    return cb()
  }
  task.list_id = db.get('inbox_id')
  if (task.list_id) {
    var req = api.http.tasks.create(task)
    req.then(function (res) {
      cli.ok('Created task ' + res.id)
      cb(res)
    })
  } else {
    var req = api.http.lists.all()
    req.then(function (res) {
      task.list_id = res[0].id
      db.set('inbox_id', task.list_id)

      var req = api.http.tasks.create(task)
      req.then(function (res) {
        cli.ok('Created task ' + res.id)
        cb(res)
      })
    })
  }
}

add.multiple = function (tasks, cb) {
  async.eachLimit(tasks, 4, function (task, finished) {
    add.single(task, function () {
      finished()
    })
  }, function (err) {
    cb(err)
  })
}
