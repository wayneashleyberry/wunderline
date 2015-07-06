var chalk = require('chalk')
var conf = {platform: 'web'}
require('rc')('wunderline', conf)

if (! conf.access_token) {
  console.log(chalk.red('Fatal error! An access token has not been configured.'))
  process.exit(1)
}

if (! conf.client_id) {
  console.log(chalk.red('Fatal error! A client id has not been configured.'))
  process.exit(1)
}

module.exports = conf
