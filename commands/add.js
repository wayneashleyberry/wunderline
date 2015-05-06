var SDK = require('wunderlist')
var dirty = require('dirty')
var db = dirty(__dirname + '/../cache.db')
var async = require('async')
var add = exports

var conf = {}
require('rc')('wunderlist-cli', conf)

var api = new SDK({
  'accessToken': conf.access_token,
  'clientID': conf.client_id
})

function addHelper (task, cb) {
  var req = api.http.tasks.create(task)
  req.then(function (res) {
    cb(res)
  }, function (err) {
    console.log(err);
  })
}

add.single = function (task, cb) {
  if (!task.title.trim()) {
    return cb()
  }
  db.on('load', function () {
    task.list_id = db.get('inbox_id')
    if (task.list_id) {
      addHelper(task, function (res) {
        console.log('Created task ' + res.id)
        cb(res)
      })
    } else {
      var req = api.http.lists.all()
      req.then(function (res) {
        task.list_id = res[0].id
        db.set('inbox_id', task.list_id)
        addHelper(task, function (task) {
          console.log('Created task ' + task.id)
          cb(res)
        })
      })
    }
  })
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
