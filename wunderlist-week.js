#!/usr/bin/env node

var app = require('commander')

app
  .description('View tasks due this week')
  .parse(process.argv)
