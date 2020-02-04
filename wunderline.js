#!/usr/bin/env node

var app = require("commander");
var pkg = require("./package.json");

app
  .version(pkg.version)
  .command("auth", "Authenticate Wunderline")
  .command("add [task]", "Add a task to your inbox")
  .command("done", "Mark a task as done")
  .command("inbox", "View your inbox")
  .command("starred", "View starred tasks")
  .command("today", "View tasks due today")
  .command("week", "View tasks due this week")
  .command("all", "View all of your tasks")
  .command("overdue", "View overdue tasks")
  .command("search [query]", "Search your tasks")
  .command("list [query]", "Search your lists")
  .command("lists", "List your lists")
  .command("open", "Open Wunderlist")
  .command("export", "Export your data")
  .command("whoami", "Display effective user")
  .command("gc", "Delete completed tasks")
  .command("set-platform", "Set your preferred application platform")
  .command("flush", "Flush the application cache")
  .command("users", "Display users related to the current account");

app.parse(process.argv);
