#!/usr/bin/env node

var app = require("commander");
var printList = require("./lib/print-list");
var getLists = require("./lib/get-lists");
var auth = require("./lib/auth");

app.description("View all of your tasks").parse(process.argv);

function main() {
  getLists(function (err, data) {
    if (err) process.exit(1);

    data.forEach(printList);
  });
}

auth(main);
