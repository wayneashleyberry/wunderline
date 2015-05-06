## 1.3.0

- Adds the `open` command, can be configured to open the native mac app but
  defaults to opening the web app.

```sh
wunderlist open
```

## 1.2.0

- Added stdin support for adding tasks, note that it requires the `--stdin`
  option to be set.

```sh
cat todo.txt | wunderlist add --stdin
```

## 1.1.0

- Added binary file to package.json
