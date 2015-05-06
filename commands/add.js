var SDK = require('wunderlist')
var dirty = require('dirty')
var db = dirty(__dirname + '/../cache.db')

var conf = {}
require('rc')('wunderlist-cli', conf)

var api = new SDK({
  'accessToken': conf.access_token,
  'clientID': conf.client_id
})

function addTask (task, cb) {
  var req = api.http.tasks.create(task)
  req.then(function (res) {
    cb(res)
  })
}

module.exports = {

  single: function (task, cb) {
    if (task.title.trim().length < 1) {
      cb()
    }
    db.on('load', function () {
      task.list_id = db.get('inbox_id')
      if (task.list_id) {
        addTask(task, function (res) {
          console.log('Created task ' + res.id)
          cb(res)
        })
      } else {
        var req = api.http.lists.all()
        req.then(function (res) {
          task.list_id = res[0].id
          db.set('inbox_id', task.list_id)
          addTask(task, function (task) {
            console.log('Created task ' + task.id)
            cb(res)
          })
        })
      }
    })
  }

}
