#!/usr/bin/env node

var app = require('commander')
var lists = require('./lists')
var print = require('./print')

app
  .description('View all of your tasks')
  .parse(process.argv)

lists(function (err, data) {
  if (err) process.exit(-1)

  data.sort(function (a, b) {
    if (a.title === 'inbox') return -1
    if (b.title === 'inbox') return 1
    return a.title > b.title
  }).forEach(function (list) {
    print(list)
    console.log()
  })
})
