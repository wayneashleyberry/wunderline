#!/usr/bin/env node

var app = require('commander')
var fs = require('fs')

app
  .description('Flush the application cache')
  .parse(process.argv)

try {
  fs.unlinkSync('./cache.db')
} catch (e) {
  //
}

process.exit()
