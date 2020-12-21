'use strict'

const fs = require('fs')
!fs.existsSync('logs') && fs.mkdirSync('logs')

const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()

app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(cookieParser())

process.gogo = {}

module.exports = app