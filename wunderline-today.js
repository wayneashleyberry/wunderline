#!/usr/bin/env node

var app = require('commander')
var getLists = require('./lib/get-lists')
var printList = require('./lib/print-list')
var auth = require('./lib/auth')

app
  .description('View tasks due today')
  .parse(process.argv)

function main () {
  getLists(function (err, data) {
    if (err) process.exit(1)

    var today = new Date()

    data.forEach(function (list) {
      list.tasks = list.tasks.filter(function (item) {
        if (!item.due_date) return false
        var due = new Date(item.due_date)
        return due.getTime() <= today.getTime()
      })

      printList(list)
    })
  })
}

auth(main)
