var chalk = require('chalk')
var columnify = require('columnify')
var moment = require('moment')

var skipEmpty = true

function printTasks (tasks) {
  var options = {
    showHeaders: false,
    truncate: true,
    config: {
      title: {
        minWidth: 40,
        maxWidth: 40
      },
      due: {
        minWidth: 12
      }
    }
  }

  var columns = tasks.map(formatTask)
  console.log(columnify(columns, options))
}

function formatDate (date) {
  var dt = moment(date)
  var text = dt.format('ddd D MMMM')
  if (dt.format('L') === moment().format('L')) {
    text = 'Today'
  }
  if (dt.format('L') === moment().add(1, 'day').format('L')) {
    text = 'Tomorrow'
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

module.exports = function (list) {
  var listTitle = list.title.toUpperCase()

  list.tasks.sort(function (a, b) {
    if (a.starred) return -1
    if (b.starred) return 1
    return 0
  })

  if (skipEmpty && list.tasks.length === 0) {
    return
  }

  console.log(chalk.underline(listTitle + ' (' + list.tasks.length + ')'))
  printTasks(list.tasks)
}
