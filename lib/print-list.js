var chalk = require('chalk')
var columnify = require('columnify')
var moment = require('moment')

var skipEmpty = true

function printTasks (tasks) {
  var ttyMaxWidth = 60

  if (process.stdout.isTTY) {
    ttyMaxWidth = process.stdout.columns - 12
  }

  var options = {
    showHeaders: false,
    truncate: true,
    config: {
      title: {
        minWidth: 60,
        maxWidth: ttyMaxWidth
      },
      due: {
        minWidth: 12
      }
    }
  }

  var columns = tasks.map(formatTask)
  var lines = columnify(columns, options).split('\n')

  tasks.forEach(function (task, index) {
    console.log(lines[index])
    task.subtasks.filter(function (subtask) {
      return !subtask.completed
    }).forEach(function (subtask, subtaskIndex) {
      console.log('— ' + subtask.title)
    })
  })
}

function formatDate (date) {
  var dt = moment(date)
  var overdue = dt.isBefore(moment(), 'day')
  var text = dt.format('ddd D MMMM')
  if (dt.format('L') === moment().format('L')) {
    text = 'Today'
  }
  if (dt.format('L') === moment().add(1, 'day').format('L')) {
    text = 'Tomorrow'
  }
  if (overdue) {
    return chalk.red(text)
  }
  return chalk.blue(text)
}

function formatTask (task) {
  var star = task.starred ? chalk.red('★') : chalk.dim('☆')
  var due = task.due_date ? formatDate(task.due_date) : ''
  return {
    title: task.title,
    due: due,
    starred: star
  }
}

module.exports = function printList (list) {
  if (skipEmpty && list.tasks.length === 0) {
    return
  }

  var listTitle = list.title.toUpperCase()

  list.tasks.sort(function (a, b) {
    if (a.starred) return -1
    if (b.starred) return 1
    return 0
  })

  if (!list.subtasks) {
    list.subtasks = []
  }

  list.tasks.map(function (task) {
    task.subtasks = []
    return task
  })

  list.subtasks.forEach(function (subtask) {
    list.tasks.forEach(function (task, index) {
      if (task.id === subtask.task_id) {
        list.tasks[index].subtasks.push(subtask)
      }
    })
  })

  console.log(chalk.underline(listTitle + ' (' + list.tasks.length + ')'))
  printTasks(list.tasks)
  console.log()
}
