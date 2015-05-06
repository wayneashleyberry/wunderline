# wunderlist-cli
Wunderlist for your command line!

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
configuration options so there are many more options as to how you can store
your config variables.

## Usage

```sh
wunderlist add Hello, World!
```

```sh
Usage:
  wunderlist-cli [OPTIONS] <command> [ARGS]

Options:
      --add TASK         Add a new task to your inbox
      --whoami           Display effective user
      --flush            Flush the application cache
  -v, --version          Display the current version
  -h, --help             Display help and usage details

Commands:
  add, flush, whoami
```
