var api = require('./api')

function getRevision (id, body, callback) {
  if (body.revision) {
    return callback(null, body.revision)
  }
  api.get('/tasks/' + id, function (error, response, body) {
    if (error) {
      return callback(error)
    }
    callback(null, body.revision)
  })
}

module.exports = function updateTask (id, body, callback) {
  getRevision(id, body, function (error, revision) {
    if (error) {
      return callback(error)
    }

    body.revision = revision

    api.patch('/tasks/' + id, {
      json: true,
      body: body
    }, function (error, response, body) {
      if (error) {
        return callback(error)
      }

      return callback(null, body)
    })
  })
}
