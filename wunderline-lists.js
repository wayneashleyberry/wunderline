#!/usr/bin/env node

var app = require('commander')
var getLists = require('./lib/get-lists')
var auth = require('./lib/auth')

app
  .description('List your lists')
  .parse(process.argv)

function main () {
  getLists(function (err, data) {
    if (err) process.exit(1)
    data.forEach(function (val, index, array) {
      console.log('— ' + val.title + ' (' + val.tasks.length + ')')
    })
  })
}

auth(main)
