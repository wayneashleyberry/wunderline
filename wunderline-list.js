#!/usr/bin/env node

var app = require("commander");
var fuzzysearch = require("fuzzysearch");
var getLists = require("./lib/get-lists");
var printList = require("./lib/print-list");
var auth = require("./lib/auth");

app.description("Display a list").usage("[query]").parse(process.argv);

function main() {
  var terms = app.args;

  if (terms.length < 1) {
    process.exit();
  }

  getLists(function(err, data) {
    if (err) process.exit(1);

    var lists = data.filter(function(item) {
      var match = false;
      terms.forEach(function(term) {
        // Case sensitive matching if smartcase found.
        if (term.toLowerCase() !== term) {
          if (fuzzysearch(term, item.title)) {
            match = true;
          }
        } else if (fuzzysearch(term.toLowerCase(), item.title.toLowerCase())) {
          match = true;
        }
      });
      return match;
    });

    lists.forEach(printList);
  });
}

auth(main);
