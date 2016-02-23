var test = require('tape')
var binCheck = require('bin-check')

test('check bin', function (t) {
  t.plan(1)

  binCheck('./wunderline.js').then((works) => {
    t.ok(works, './wunderline.js has a zero exit code')
  })
})
