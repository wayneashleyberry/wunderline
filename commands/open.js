var opn = require('opn');
var conf = {platform: 'web'}
require('rc')('wunderlist-cli', conf)

if (conf.platform === 'mac') {
  opn('wunderlist://');
  process.exit();
} else {
  opn('https://www.wunderlist.com/#/lists/inbox');
  process.exit();
}
