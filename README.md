# Wunderline

> [Wunderlist](https://www.wunderlist.com/) for your command line!

<a href="https://enjoy.gitstore.app/repositories/wayneashleyberry/wunderline"><img src="https://enjoy.gitstore.app/repositories/badge-wayneashleyberry/wunderline.svg"></a>
[![npm](http://img.shields.io/npm/v/wunderline.svg?style=flat)](https://www.npmjs.com/package/wunderline)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/wayneashleyberry/wunderline.svg?branch=master)](https://travis-ci.org/wayneashleyberry/wunderline)

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

Your `ACCESS TOKEN` will show up above

![access-token modal](http://i.imgur.com/1urbelo.png)

Now you can run `wunderline auth` and enter the values.

## Usage

```sh
$ wunderline --help

Commands:

    auth            Authenticate Wunderline
    add [task]      Add a task to your inbox
    done            Mark a task as done
    inbox           View your inbox
    starred         View starred tasks
    today           View tasks due today
    week            View tasks due this week
    all             View all of your tasks
    overdue         View overdue tasks
    search [query]  Search your tasks
    list [query]    Search your lists
    lists           List your lists
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

You can add subtasks at task creation time.

```sh
$ wunderline add 'Run a marathon' --subtask 'Train for the marathon' --subtask 'Register for the marathon'
```

### Completing Tasks

Tasks can be completed using the `done` subcommand.

```sh
$ wunderline done
```

![completing tasks](https://cloud.githubusercontent.com/assets/4248851/16345815/3261e1a6-3a44-11e6-862a-798930424c14.gif "Completing Tasks")

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

#### Filtering with jq

The export command will give you all of your data, unfiltered, which can be
a lot. If you'd like to search, filter or manipulate your data then check out
[jq](https://stedolan.github.io/jq/).

Here are some examples, filtering out completed and starred tasks.

```sh
wunderline export | jq '.data.lists[].tasks[] | select(.completed == true)'
```

```sh
wunderline export | jq '.data.lists[].tasks[] | select(.starred == true)'
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

### License

MIT © [Wayne Ashley Berry](https://wayne.cloud)
