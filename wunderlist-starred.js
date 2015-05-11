#!/usr/bin/env node

var app = require('commander')
var lists = require('./lists')
var print = require('./print')

app
  .description('View your starred tasks')
  .parse(process.argv)

lists(function (err, data) {
  if (err) process.exit(-1)

  data.forEach(function (list) {
    list.tasks = list.tasks.filter(function (item) {
      return item.starred
    })
    print(list)
  })
})
