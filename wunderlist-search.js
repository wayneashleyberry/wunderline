#!/usr/bin/env node

var app = require('commander')
var getLists = require('./util/get-lists')
var printList = require('./util/print-list')

app
  .description('Search tasks')
  .usage('[query]')
  .parse(process.argv)

var terms = app.args

if (terms.length < 1) {
  process.exit()
}

getLists(function (err, data) {
  if (err) process.exit(1)

  data.forEach(function (list) {
    list.tasks = list.tasks.filter(function (item) {
      var found = false
      terms.forEach(function(term) {
        if (item.title.toLowerCase().search(term.toLowerCase()) !== -1) {
          found = true
        }
      })
      return found
    })

    printList(list)
  })
})
