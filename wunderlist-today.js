#!/usr/bin/env node

var app = require('commander')
var moment = require('moment')
var lists = require('./lists')
var print = require('./print')

app
  .description('View tasks due today')
  .parse(process.argv)

lists(function (err, data) {
  if (err) process.exit(1)

  var today = moment().format('YYYY-MM-DD')

  data.forEach(function (list) {
    list.tasks = list.tasks.filter(function (item) {
      if (!item.due_date) return false
      return item.due_date === today
    })

    print(list)
  })
})
