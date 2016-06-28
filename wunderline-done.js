#!/usr/bin/env node

var app = require('commander')
var async = require('async')
var fuzzysearch = require('fuzzysearch')
var inquirer = require('inquirer')

var getLists = require('./lib/get-lists')
var auth = require('./lib/auth')
var updateTask = require('./lib/update-task')

app
  .description('Mark a task as done')
  .usage('[task]')
  .parse(process.argv)

function complete (id, callback) {
  updateTask(id, {completed: true}, callback)
}

function match (terms, tasks) {
  return tasks.filter(function (task) {
    return terms.find(function (term) {
      return fuzzysearch(term.toLowerCase(), task.title.toLowerCase())
    })
  })
}

function main () {
  getLists(function (error, lists) {
    if (error) {
      process.exit(1)
    }

    var terms = app.args
    var term = terms.join(' ')

    var tasks = lists
      .reduce(function (registry, list) {
        return registry.concat(list.tasks)
      }, [])

    var matches = term.length > 0
      ? match([term], tasks)
      : tasks

    var choices = matches.map(function (match) {
      return {
        checked: match.completed,
        value: match.id,
        name: match.title
      }
    })

    inquirer.prompt([
      {
        type: 'checkbox',
        name: 'done',
        message: 'Select tasks to mark as done',
        choices: choices
      }
    ]).then(function (answers) {
      async.eachLimit(answers.done, 10, complete, function () {
        process.exit(0)
      })
    })
  })
}

auth(main)
