# wunderlist-cli

Wunderlist for your command line!

This is a simple little command line utility for working with Wunderlist. The
current feature set is pretty minimal but watch out for future updates :)

[![npm](http://img.shields.io/npm/v/wunderlist-cli.svg?style=flat)](https://www.npmjs.com/package/wunderlist-cli)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Build Status](https://travis-ci.org/wayneashleyberry/wunderlist-cli.svg)](https://travis-ci.org/wayneashleyberry/wunderlist-cli)
[![Dependency Status](https://david-dm.org/wayneashleyberry/wunderlist-cli.svg)](https://david-dm.org/wayneashleyberry/wunderlist-cli)
[![devDependency Status](https://david-dm.org/wayneashleyberry/wunderlist-cli/dev-status.svg)](https://david-dm.org/wayneashleyberry/wunderlist-cli#info=devDependencies)

## Installation

```sh
npm install -g wunderlist-cli
```

## Authentication

wunderlist-cli requires you to create your own Wunderlist application and store
the client id and an access token locally. You can create a new application
[here](https://developer.wunderlist.com/apps/new).

When creating an application you will be asked for an app url and an auth
callback url, you can just use dummy values for these.

Once that's done, create a `.wunderlist-clirc` in your home directory that
looks like so:

```json
{
  "client_id": "...",
  "access_token": "..."
}
```

wunderlist-cli uses [rc](https://www.npmjs.com/package/rc) to load
configuration options so there are [many more
options](https://www.npmjs.com/package/rc#standards) as to how you can store
your config variables.

## Usage

```sh
❯ wunderlist --help

Commands:

    add [task]  Add a task to your inbox
    inbox       View your inbox
    starred     View starred tasks
    today       View tasks due today
    week        View tasks due this week
    all         View all of your tasks
    open        Open Wunderlist
    export      Export your data
    whoami      Display effective user
    flush       Flush the application cache
    help [cmd]  display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

### Adding Tasks

Add tasks to your inbox.

```sh
❯ wunderlist add Hello, World!
```

The add command also supports creating tasks from `stdin`.

```sh
❯ cat todo.txt | wunderlist add --stdin
```

### Viewing Lists

All of Wunderlists smart lists are supported, so there are various ways to see
what tasks you have to do.

```sh
❯ wunderlist inbox
❯ wunderlist starred
❯ wunderlist today
❯ wunderlist week
❯ wunderlist all
```

### Open

Open Wunderlist, defaults to opening the web app.

```sh
❯ wunderlist open
```

If you specify `mac` as the platform in your `.wunderlist-clirc` wunderlist-cli
will open the native app for you.

```json
{
  "platform": "mac"
}
```

## Bonus Points

### Ack / Ag

You could search for the word "todo" in a project and pipe the input into
wunderlist-cli. Each line will be parsed and turned into a task, be careful
because this could result in a **lot** of tasks!

This might be a terrible idea, even useless at best, but hopefully it will get
you thinking.

```sh
❯ ag todo --nocolor --nofilename | wunderlist add -s
```
