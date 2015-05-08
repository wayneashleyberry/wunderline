## 1.6.0

Adds the `ls` command which shows you all of your (incomplete) tasks.

```sh
wunderlist ls
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
wunderlist open
```

## 1.2.0

Added stdin support for adding tasks, note that it requires the `--stdin`
option to be set.

```sh
cat todo.txt | wunderlist add --stdin
```

## 1.1.0

Added the binary file to package.json
