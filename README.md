# Wunderline

> Wunderlist for your command line!

[![npm](http://img.shields.io/npm/v/wunderline.svg?style=flat)](https://www.npmjs.com/package/wunderline)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Build Status](https://travis-ci.org/we-are-next/wunderline.svg?branch=master)](https://travis-ci.org/we-are-next/wunderline)
[![Dependency Status](https://david-dm.org/we-are-next/wunderline.svg)](https://david-dm.org/we-are-next/wunderline)
[![devDependency Status](https://david-dm.org/we-are-next/wunderline/dev-status.svg)](https://david-dm.org/we-are-next/wunderline#info=devDependencies)

## Installation

```sh
npm install -g wunderline
```

## Authentication

Wunderline requires you to create your own Wunderlist application and store
the client id and an access token locally. You can create a new application
[here](https://developer.wunderlist.com/apps/new).

When creating an application you will be asked for an app url and an auth
callback url, you can just use dummy values for these.

Once that's done, click `CREATE ACCESS TOKEN` as highlighted here:

![access-token](http://i.imgur.com/TW3IH8P.png)

Now you can run `wunderline auth` and enter the values.

## Usage

```sh
$ wunderline --help

Commands:

    auth            Authenticate Wunderline
    add [task]      Add a task to your inbox
    inbox           View your inbox
    starred         View starred tasks
    today           View tasks due today
    week            View tasks due this week
    all             View all of your tasks
    overdue         View overdue tasks
    search [query]  Search your tasks
    list [query]    Search your lists
    open            Open Wunderlist
    export          Export your data
    whoami          Display effective user
    gc              Delete completed tasks
    set-platform    Set your preferred application platform
    flush           Flush the application cache
    help [cmd]      display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

### Adding Tasks

Add tasks to your inbox.

```sh
$ wunderline add Hello, World!
```

The add command also supports creating tasks from `stdin`.

```sh
$ cat todo.txt | wunderline add --stdin
```

You can also add tasks to a list, that list will be created if it doesn't
exist.

```sh
$ wunderline add Hello, World! --list Greetings
```

Due dates are now supported using one of the following options.

```sh
$ wunderline add Hello, World! --today --tomorrow --due 2015-12-25
```

### Viewing Lists

All of Wunderlists smart lists are supported, so there are various ways to see
what tasks you have to do.

```sh
$ wunderline inbox
$ wunderline starred
$ wunderline today
$ wunderline week
$ wunderline all
```

Alternatively, you can view any other list by using the `list` subcommand.

```sh
$ wunderline list shopping
```

### Open

Open Wunderlist, defaults to opening the web app.

```sh
$ wunderline open
```

The only other platform currently supported is `mac`, use the `set-platform`
command to change your settings.

```sh
$ wunderline set-platform mac
```

### Export

Exports your data to stdout.

```sh
$ wunderline export > export.json
```

## Bonus Points

### Ack / Ag

You could search for the word "todo" in a project and pipe the input into
wunderline. Each line will be parsed and turned into a task, be careful
because this could result in a **lot** of tasks!

This might be a terrible idea, even useless at best, but hopefully it will get
you thinking.

```sh
$ ag todo --nocolor --nofilename | wunderline add -s
```

### Debugging

wunderline uses [request](https://github.com/request/request) so if you
want to inspect api requests just set the `NODE_DEBUG` variable.

```sh
$ NODE_DEBUG=request wunderline inbox
```
