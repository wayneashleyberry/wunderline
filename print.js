var chalk = require('chalk')
var columnify = require('columnify')
var moment = require('moment')

var print = {}
var skipEmptyLists = true

print.list = function (list) {
  var listTitle = list.title.toUpperCase()

  list.tasks.sort(function (a, b) {
    if (a.starred) return -1
    if (b.starred) return 1
    return 0
  })

  if (skipEmptyLists && list.tasks.length === 0) {
    return
  }

  console.log(chalk.underline(listTitle + ' (' + list.tasks.length + ')'))
  print.tasks(list.tasks)
  console.log('')
}

print.tasks = function (tasks) {
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

  var columns = tasks.map(print.formatTask)
  console.log(columnify(columns, options))
}

print.formatDate = function(date) {
  var text;
  var dt = moment(date)
  if (dt.format('L') === moment().format('L')) {
    text = 'Today'
  } else if (dt.format('L') === moment().add(1, 'day').format('L')) {
    text = 'Tomorrow'
  } else {
    text = dt.format('ddd D MMMM')
  }
  return chalk.blue(text)
}

print.formatTask = function (task) {
  var star = task.starred ? chalk.red('★') : chalk.dim('☆')
  var due = task.due_date ? print.formatDate(task.due_date) : ''
  return {
    title: task.title,
    due: due,
    starred: star
  }
}

module.exports = print
