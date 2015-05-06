var opn = require('opn')
var conf = require('../config')

if (conf.platform === 'mac') {
  opn('wunderlist://')
  process.exit()
} else {
  opn('https://www.wunderlist.com/#/lists/inbox')
  process.exit()
}
