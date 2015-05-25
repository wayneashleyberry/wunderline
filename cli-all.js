#!/usr/bin/env node

var app = require('commander')
var printList = require('./util/print-list')
var getLists = require('./util/get-lists')

app
  .description('View all of your tasks')
  .parse(process.argv)

getLists(function (err, data) {
  if (err) process.exit(1)

  data.forEach(printList)
})
