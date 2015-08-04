#!/usr/bin/env node

var app = require('commander')
var moment = require('moment')
var getLists = require('./lib/get-lists')
var printList = require('./lib/print-list')
var auth = require('./lib/auth')

app
  .description('View overdue tasks')
  .parse(process.argv)

function main () {
  getLists(function (err, data) {
    if (err) process.exit(1)

    var today = moment()

    data.forEach(function (list) {
      list.tasks = list.tasks.filter(function (item) {
        if (!item.due_date) return false
        return moment(item.due_date).isBefore(today, 'day')
      })

      printList(list)
    })
  })
}

auth(main)
