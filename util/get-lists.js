var async = require('async')
var api = require('./api')

module.exports = function (cb) {
  async.waterfall([
    function (callback) {
      api('/lists', function (err, res, body) {
        if (err) process.exit(1)
        callback(null, body)
      })
    },
    function (lists, callback) {
      var listsWithTasks = []

      async.eachLimit(lists, 10, function (list, done) {
        api({url: '/tasks', qs: {list_id: list.id}}, function (err, res, body) {
          if (err) process.exit(1)
          list.tasks = body
          listsWithTasks.push(list)
          done()
        })
      }, function (err) {
        if (err) process.exit(1)
        callback(null, listsWithTasks)
      })
    }
  ], function (err, lists) {
    lists.sort(function (a, b) {
      if (a.list_type === 'inbox') return -1
      if (b.list_type === 'inbox') return 1
      return a.title > b.title
    })

    cb(err, lists)
  })
}
