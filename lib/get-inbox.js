var api = require("./api");
var fs = require("fs");
var path = require("path");
var cacheFile = path.dirname(require.main.filename) + "/cache.json";
var request = require("request");
var cache = {};

try {
  cache = require(cacheFile);
} catch (e) {
  //
}

module.exports = function getInbox(cb) {
  if (cache.inbox) {
    return cb(cache.inbox);
  }

  api("/lists", function(err, res, body) {
    if (request.debug) {
      console.log("REQUEST", "response", "body", body);
    }

    if (err || body.error) {
      console.error(JSON.stringify(err || body.error, null, 2));
      process.exit(1);
    }

    var lists = body.filter(function(item) {
      return item.list_type === "inbox";
    });

    var inbox = lists[0];

    cache.inbox = inbox;

    fs.writeFile(cacheFile, JSON.stringify(cache), function(err) {
      if (err) {
        //
      }
      cb(inbox);
    });
  });
};
