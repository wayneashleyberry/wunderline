var async = require('async')
var api = require('./api')

module.exports = function (cb) {
  async.waterfall([
    function (callback) {
      api('/lists', function (err, res, body) {
        if (body.error) {
          console.error(JSON.stringify(body.error, null, 2))
          process.exit(1)
        }
        callback(err, body)
      })
    },
    function (lists, callback) {
      var listsWithTasks = []

      async.eachLimit(lists, 10, function (list, done) {
        async.parallel([
          function (cb) {
            api({url: '/tasks', qs: {list_id: list.id}}, function (err, res, body) {
              if (err) process.exit(1)
              list.tasks = body
              cb()
            })
          },
          function (cb) {
            api({url: '/subtasks', qs: {list_id: list.id}}, function (err, res, body) {
              if (err) process.exit(1)
              list.subtasks = body
              cb()
            })
          }
        ], function (err, results) {
          if (err) process.exit(1)
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
