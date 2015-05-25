#!/usr/bin/env node

var app = require('commander')
var fs = require('fs')

app
  .description('Flush the application cache')
  .parse(process.argv)

fs.unlink(__dirname + '/cache.json', function (err) {
  if (err) process.exit(1)
  process.exit()
})
