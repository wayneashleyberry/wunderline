#!/usr/bin/env node

var app = require('commander')
var moment = require('moment')
var lists = require('./lists')
var print = require('./print')

app
  .description('View tasks due this week')
  .parse(process.argv)

lists(function (err, data) {
  if (err) process.exit(1)

  var week = moment().format('w')

  data.forEach(function (list) {
    list.tasks = list.tasks.filter(function (item) {
      if (!item.due_date) return false
      return moment(item.due_date).format('w') === week
    })

    print(list)
  })
})
