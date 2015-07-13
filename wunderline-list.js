#!/usr/bin/env node

var app = require('commander')
var getLists = require('./util/get-lists')
var printList = require('./util/print-list')

app
  .description('Display a list')
  .usage('[query]')
  .parse(process.argv)

var terms = app.args

if (terms.length < 1) {
  process.exit()
}

getLists(function (err, data) {
  if (err) process.exit(1)

  var list = null
  var query =  terms.join(' ')

  data.every(function(item) {
    var found = item.title.toLowerCase().search(query) >= 0
    if (found)
      list = item

    return !found
  })

  if (list) printList(list)
})
