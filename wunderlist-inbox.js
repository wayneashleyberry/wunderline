#!/usr/bin/env node

var app = require('commander')
var lists = require('./lists')
var print = require('./print')

app
  .description('View your inbox')
  .parse(process.argv)

lists(function (err, data) {
  if (err) process.exit(-1)

  data.filter(function(list) {
    return list.title.toLowerCase() === 'inbox'
  }).forEach(function (list) {
    print(list)
  })
})
