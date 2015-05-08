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
Usage: wunderlist [options] [command]

Commands:

  ls          List all of your tasks
  add [task]  Add a task to your inbox
  open        Open Wunderlist
  whoami      Display effective user
  flush       Flush the application cache
  help [cmd]  display help for [cmd]

Options:

  -h, --help     output usage information
  -V, --version  output the version number
```

### ls

List all of your tasks. You can optionally limit how many tasks are printed per
list. Empty lists will not be displayed.

```sh
wunderlist ls
wunderlist ls --limit 3
```

You can also show only starred tasks.

```sh
wunderlist ls --starred
```

### add

Add tasks to your inbox.

```sh
wunderlist add Hello, World!
```

```sh
cat todo.txt | wunderlist add --stdin
```

### open

Open Wunderlist, defaults to opening the web app.

```sh
wunderlist open
```

If you specify `mac` as the platform in your `.wunderlist-clirc` wunderlist-cli
will open the native app for you.

```json
{
  "platform": "mac"
}
```

### whoami

```sh
wunderlist whoami
```

Displays the currently authenticated user.

### flush

```sh
wunderlist flush
```

Clears the application cache.

## Bonus Points

### Autocomplete

All commands get autocomplete from [cli](https://www.npmjs.com/package/cli) for
free. If you combine this with aliasing `wunderlist` to something shorter like
`wl` you can get pretty fast...

```sh
wl a Hello, World!
```

```sh
wl o
```
