#!/usr/bin/env node

var app = require('commander')
var moment = require('moment')
var getLists = require('./lib/get-lists')
var printList = require('./lib/print-list')

app
  .description('View tasks due today')
  .parse(process.argv)

getLists(function (err, data) {
  if (err) process.exit(1)

  var today = moment().format('YYYY-MM-DD')

  data.forEach(function (list) {
    list.tasks = list.tasks.filter(function (item) {
      if (!item.due_date) return false
      return item.due_date === today
    })

    printList(list)
  })
})
