#!/usr/bin/env node

var app = require('commander')
var lists = require('./lists')

app
  .description('Export your data')
  .parse(process.argv)

lists(function (err, data) {
  if (err) process.exit(-1)

  var ex = {
    data: {
      exported_at: new Date,
      lists: data
    }
  }

  console.log(JSON.stringify(ex, null, 2))
})
