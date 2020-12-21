'use strict'

const {createLogger, format, transports} = require('winston')
require('winston-daily-rotate-file')
const {userId} = require('../utils/meta')
const cookie = require('cookie')
const util = require('util')

function _createTransport(logFile, info = {}) {
  let transport = new (transports.DailyRotateFile)({
    filename: info.filename || `${logFile}.log-%DATE%`,
    frequency: info.frequency || 'daily',
    datePattern: info.datePattern || 'YYYYMMDD',
    zippedArchive: info.zippedArchive || true,
    maxSize: info.maxSize || '500m',
    maxFiles: info.maxFiles || '30d',
    dirname: info.dirname || 'logs/log',
    level: info.level || 'info'
  })
  return transport
}

function _defaultFormat() {
  let defaultHeadFormat = format.printf(e => {
      return `[${e.level}] ${e.timestamp} ${e.metaInfo || ''} ${util.inspect(
        e.message)}`
    }),
    defaultReqFormat = format((info) => {
      let {req} = info.message
      if (req) {
        let ip = req.ip ||
          req._remoteAddress ||
          (req.connection && req.connection.remoteAddress) ||
          undefined,
          coo = cookie.parse(req.headers.cookie || ''),
          metaInfo = `${ip || ''} ${req.method} ${req.originalUrl ||
          req.url} ${coo['csid'] || ''} ${userId(coo)}`
        info.metaInfo = metaInfo
        delete info.message.req

        if (req.method != 'GET') {
          info.message.body = req.body
        }
      }
      return info
    }),
    defaultFormat = format.combine(
      defaultReqFormat(),
      format.splat(),
      format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:SSS'}),
      defaultHeadFormat,
    )
  return defaultFormat
}

function createWinstonLogger(logFile, transportInfo, formats = _defaultFormat()) {
  const transport = _createTransport(logFile,transportInfo)
  let logger = createLogger({
    format: formats,
    transports: transport,
    exitOnError: false,
  })
  return logger
}

module.exports = {
  createWinstonLogger,
}
