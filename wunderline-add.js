#!/usr/bin/env node

var app = require("commander");
var async = require("async");
var stdin = require("get-stdin");
var trunc = require("lodash.trunc");
var moment = require("moment");
var opn = require("opn");
var api = require("./lib/api");
var getInbox = require("./lib/get-inbox");
var Configstore = require("configstore");
var conf = new Configstore("wunderline", { platform: "web" });
var auth = require("./lib/auth");

function openTask(task) {
  var web = "https://www.wunderlist.com/#/tasks/" + task.id;
  var mac = "wunderlist://tasks/" + task.id;
  if (conf.get("platform") === "mac") return opn(mac);
  opn(web);
}

function openList(list) {
  var web = "https://www.wunderlist.com/#/lists/" + list.id;
  var mac = "wunderlist://lists/" + list.id;
  if (conf.get("platform") === "mac") return opn(mac);
  opn(web);
}

app
  .description("Add a task to your inbox")
  .usage("[task]")
  .option("-l, --list [name]", "Specify a list other than your inbox")
  .option("--starred", "Set the new task as starred")
  .option("--today", "Set the due date to today")
  .option("--tomorrow", "Set the due date to tomorrow")
  .option("--due [date]", "Set a specific due date")
  .option("--note [note]", "Attach a note to the new task")
  .option("--subtask [task]", "Add a subtask to the new task", collect, [])
  .option("-o, --open", "Open Wunderlist on completion")
  .option("-s, --stdin", "Create tasks from stdin")
  .parse(process.argv);

function truncateTitle(title) {
  return trunc(title.trim(), 254);
}

function collect(value, memo) {
  memo.push(value);
  return memo;
}

function getListId(callback) {
  if (!app.list) {
    return getInbox(function(inbox) {
      callback(inbox.id);
    });
  }

  var list = {
    title: app.list.trim()
  };

  api("/lists", function(error, response, body) {
    if (error) process.exit(1);

    var existing = body.filter(function(item) {
      return item.title.toLowerCase().trim() === list.title.toLowerCase();
    });
    if (existing.length > 0) {
      return callback(existing[0].id);
    }
    api.post({ url: "/lists", body: list }, function(error, response, body) {
      if (error) process.exit(1);

      callback(body.id);
    });
  });
}

function main() {
  var dueDate;
  var starred = false;

  if (app.today) {
    dueDate = moment();
  }

  if (app.tomorrow) {
    dueDate = moment().add(1, "day");
  }

  if (app.due) {
    if (moment(app.due, "YYYY-MM-DD", true).isValid()) {
      dueDate = moment(app.due);
    } else {
      console.error("Invalid due date!");
      process.exit(1);
    }
  }

  if (dueDate != null) {
    dueDate = dueDate.format("YYYY-MM-DD");
  }

  if (app.starred) {
    starred = true;
  }

  if (typeof app.stdin === "undefined") {
    var title = app.args.join(" ");

    if (!title) {
      process.exit(1);
    }

    async.waterfall(
      [
        function(callback) {
          getListId(function(inboxId) {
            callback(null, inboxId);
          });
        },
        function(inboxId, callback) {
          callback(null, {
            title: truncateTitle(title),
            list_id: inboxId,
            due_date: dueDate,
            starred: starred
          });
        },
        function(task, callback) {
          api.post({ url: "/tasks", body: task }, function(
            error,
            response,
            body
          ) {
            if (error || body.error) {
              callback(error || body.error, null);
            } else {
              callback(null, body);
            }
          });
        },
        function(task, callback) {
          if (app.note) {
            app.note = app.note.replace(/\\n/g, "\n");
            api.post(
              { url: "/notes", body: { task_id: task.id, content: app.note } },
              function(error, response, body) {
                if (error || body.error) {
                  callback(error || body.error, null);
                } else {
                  callback(null, task);
                }
              }
            );
          } else {
            callback(null, task);
          }
        },
        function(task, callback) {
          if (app.subtask.length > 0) {
            async.eachSeries(
              app.subtask,
              function(subtask, subtask_callback) {
                api.post(
                  {
                    url: "/subtasks",
                    body: {
                      task_id: task.id,
                      title: subtask,
                      completed: false
                    }
                  },
                  function(error, response, body) {
                    if (error || body.error) {
                      subtask_callback(error || body.error);
                    } else {
                      subtask_callback();
                    }
                  }
                );
              },
              function(error) {
                if (error) {
                  callback(error, null);
                } else {
                  callback(null, task);
                }
              }
            );
          } else {
            callback(null, task);
          }
        }
      ],
      function(error, response) {
        if (error) {
          console.error(JSON.stringify(error));
          process.exit(1);
        }
        if (app.open) {
          openTask(response);
        }
        process.exit();
      }
    );
  }

  if (app.stdin === true) {
    async.waterfall(
      [
        function(callback) {
          stdin().then(data => {
            var sep = data.indexOf("\r\n") !== -1 ? "\r\n" : "\n";
            var lines = data.trim().split(sep);
            callback(null, lines);
          });
        },
        function(lines, callback) {
          getListId(function(listId) {
            callback(null, listId, lines);
          });
        },
        function(listId, lines, callback) {
          var tasks = lines
            .filter(function(line) {
              return line.trim().length > 0;
            })
            .map(function(line) {
              return {
                title: truncateTitle(line),
                due_date: dueDate,
                list_id: listId,
                starred: starred
              };
            });
          callback(null, tasks);
        }
      ],
      function(error, tasks) {
        if (error) {
          process.exit(1);
        }

        async.each(
          tasks,
          function(task, finished) {
            api.post({ url: "/tasks", body: task }, function(
              error,
              response,
              body
            ) {
              if (error || body.error) {
                console.error(JSON.stringify(error || body.error, null, 2));
                process.exit(1);
              }
              process.stderr.write(".");
              finished();
            });
          },
          function() {
            if (app.open && tasks.length > 0) {
              openList({ id: tasks[0].list_id });
            }

            process.exit();
          }
        );
      }
    );
  }
}

auth(main);
