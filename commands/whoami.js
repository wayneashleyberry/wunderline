var api = require('../api')

module.exports = function () {
  var req = api.http.user.all()

  req.then(function (user) {
    console.log(user.name + ' <' + user.email + '>')
    process.exit()
  })
}
