var Configstore = require('configstore')
var conf = new Configstore('wunderline')
var wrap = require('wordwrap')(80);

module.exports = function (callback) {
  if (conf.get('authenticated_at')) {
    return callback()
  }
  console.log(wrap('Wunderline needs application credentials before continuing... please run `wunderline auth` and follow the instructions. More info: http://git.io/vOzAn'))
}
