#!/usr/bin/env node

var app = require("commander");
var api = require("./lib/api");
var auth = require("./lib/auth");

app
  .description("Display users related to the current account")
  .parse(process.argv);

function main() {
  api("/users", function (err, res, body) {
    if (err || body.error) {
      console.error(JSON.stringify(err || body.error, null, 2));
      process.exit(1);
    }
    body.forEach(function (user) {
      console.log("— " + user.name + ", " + user.email + " (" + user.id + ")");
    });
  });
}

auth(main);
