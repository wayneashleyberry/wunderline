## 3.1.0

Adds subtasks :)

## 3.0.0

Renames project and cli to Wunderline. Sorry for the hassle.

The original project name (wunderlist-cli) was too close to the original
brand name and Wunderlist support requested that it be changed.

https://developer.wunderlist.com/branding#naming-conventions

## 2.5.0

Add search command

```sh
❯ wunderlist search #work
```

## 2.4.0

- Adds overdue command
- Displays due date in red if the task is overdue

```sh
❯ wunderlist overdue
```

## 2.3.0

Adds due date support when adding tasks

```sh
❯ wunderlist add Hello, World! --today
❯ wunderlist add Hello, World! --tomorrow
❯ wunderlist add Hello, World! --due 2015-12-25
```

Adds open option when adding tasks (supports mac and web platforms), this will
open Wunderlist once your task(s) have been created.

```sh
❯ wunderlist add Hello, World! --open
❯ wunderlist add Hello, World! -o
```

## 2.2.0

Export will now get your subtasks, notes and files as well!

## 2.1.5

Truncates task titles to respect the Wunderlist API limit of 255 characters.

## 2.1.3

Removes message when creating a task, unix principles are pretty clear on doing
nothing if a command was executed successfully.

## 2.1.2

Improves inbox caching

## 2.1.0

List support for adding tasks. The list will be created if it doesn't already
exist.

```sh
❯ wunderlist add Hello, World! --list Greetings
```

## 2.0.0

- Added `inbox` command
- Added `starred` command
- Added `today` command
- Added `week` command
- Renamed the `ls` command to `all`
- Added `export` command
- Better date formatting
- Internal improvements

## 1.7.0

Displays links to newly created tasks, supports the native mac app as well.

```sh
❯ wunderlist add Test
Added “Test” to your inbox
https://www.wunderlist.com/#/tasks/1137318052
```

## 1.6.1 - 1.6.3

- Sorts lists alphabetically, with the inbox always coming first
- Documenation updates

## 1.6.0

Adds the `ls` command which shows you all of your (incomplete) tasks.

```sh
❯ wunderlist ls
```

## 1.5.0

- Switches to commander
- Use request instead of the full wunderlist sdk
- Very simple API error logging

## 1.4.0

- Debug mode using `--debug`
- Nicer logging
- Lots of internal improvements

## 1.3.0

Adds the `open` command, can be configured to open the native mac app but
defaults to opening the web app.

```sh
❯ wunderlist open
```

## 1.2.0

Added stdin support for adding tasks, note that it requires the `--stdin`
option to be set.

```sh
❯ cat todo.txt | wunderlist add --stdin
```

## 1.1.0

Added the binary file to package.json
