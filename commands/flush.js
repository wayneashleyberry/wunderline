var fs = require('fs')

try {
  fs.unlinkSync(__dirname + '/../cache.db')
} catch (e) {
  //
}

process.exit()
