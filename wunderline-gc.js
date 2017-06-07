#!/usr/bin/env node

var app = require("commander");
var async = require("async");
var api = require("./lib/api");
var auth = require("./lib/auth");

app.description("Delete completed tasks").parse(process.argv);

function main() {
  async.waterfall([
    function(callback) {
      api("/lists", function(err, res, body) {
        if (err || body.error) {
          console.error(JSON.stringify(err || body.error, null, 2));
          process.exit(1);
        }
        callback(err, body);
      });
    },
    function(results, callback) {
      var tasks = [];
      async.eachLimit(
        results,
        10,
        function(list, done) {
          api(
            { url: "/tasks", qs: { completed: true, list_id: list.id } },
            function(err, res, body) {
              if (err) process.exit(1);
              body
                .filter(function(task) {
                  return task.completed === true;
                })
                .forEach(function(task) {
                  tasks.push(task);
                });
              done();
            }
          );
        },
        function() {
          callback(null, tasks);
        }
      );
    },
    function(results, callback) {
      async.eachLimit(results, 10, function(task, done) {
        api.del(
          { url: "/tasks/" + task.id, qs: { revision: task.revision } },
          function(err, res, body) {
            if (err) {
              //
            }
            done();
          }
        );
      });
    }
  ]);
}

auth(main);
