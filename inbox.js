var api = require('./api')
var fs = require('fs')

try {
  var cache = require('./cache.json')
} catch (e) {
  var cache = {}
}

module.exports = function getInbox (cb) {
  if (cache.inbox) {
    return cb(cache.inbox)
  }

  api.get('/lists', function (err, res, body) {
    if (err || body.error) {
      console.log(err || body.error)
      process.exit(1)
    }
    var lists = body.filter(function (item) {
      return item.title === 'inbox'
    })
    var inbox = lists[0]
    cache.inbox = inbox

    fs.writeFile(__dirname + '/cache.json', JSON.stringify(cache), function (err) {
      if (err) {
        //
      }
      cb(inbox)
    })
  })
}
