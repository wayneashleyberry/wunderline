#!/usr/bin/env node

var app = require('commander')

app
  .description('View tasks due today')
  .parse(process.argv)
