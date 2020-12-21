'use strict'

const log4js = require('log4js')
const path = require('path')

log4js.configure('server/configs/log4js.json')
let logger4js = log4js.getLogger("app")

setUserIdLogCtx('-')
_setFunctionNameCtx('-')
_setLineNumberCtx('-')
let archivingFileName = ''

async function trace(fileName, logMessage, ...params) {
  if (_isValid(fileName, logMessage)) {
    await _setAttributes(fileName)
    logger4js.trace(logMessage, ...params)
  }
}

async function debug(fileName, logMessage, ...params) {
  if (_isValid(fileName, logMessage)) {
    await _setAttributes(fileName)
    logger4js.debug(logMessage, ...params)
  }
}

async function info(fileName, logMessage, ...params) {
  if (_isValid(fileName, logMessage)) {
    await _setAttributes(fileName)
    logger4js.info(logMessage, ...params)
  }
}

async function warn(fileName, logMessage, ...params) {
  if (_isValid(fileName, logMessage)) {
    await _setAttributes(fileName)
    logger4js.warn(logMessage, ...params)
  }
}

async function error(fileName, logMessage, ...params) {
  if (_isValid(fileName, logMessage)) {
    await _setAttributes(fileName)
    logger4js.error(logMessage, ...params)
  }
}

async function fatal(fileName, logMessage, ...params) {
  if (_isValid(fileName, logMessage)) {
    await _setAttributes(fileName)
    logger4js.fatal(logMessage, ...params)
  }
}

function _isValid(fileName, logMessage) {
  if (typeof(fileName) != 'string' || typeof(logMessage) != 'string') {
    return false
  }
  return true
}

function _setAttributes(fileName) {
  _setFileNameCtx(fileName)
  _checkAndSetFunctionNameAndLineNumCtx()
}

/**
 * Set file name for log4js context
 */
function _setFileNameCtx(fileName) {
  let baseName = path.basename(fileName)
  if (archivingFileName != baseName) {
    archivingFileName = baseName
    logger4js.addContext('fileName', archivingFileName)
  }
}

/**
 * Set function name and line number for log4js context.
 * Be noted that it's ONLY for debug mode due to bad performance when running
 */
async function _checkAndSetFunctionNameAndLineNumCtx() {
  if(logger4js.isDebugEnabled()) {
    let e = await new Error(),
      frame = e.stack.split('\n')[4]
    _setFunctionNameCtx(frame.split(' ')[5].replace('Object.', ''))
    let frameSplit = frame.split(':')
    _setLineNumberCtx(frameSplit[frameSplit.length - 2])
  }
}

/**
 * Set user id for log4js context
 */
function setUserIdLogCtx(userId) {
  logger4js.addContext('userId', userId)
}

/**
 * Set function name for log4js context
 */
function _setFunctionNameCtx(functionName) {
  logger4js.addContext('functionName', functionName)
}

/**
 * Set line number for log4js context
 */
function _setLineNumberCtx(lineNumber) {
  logger4js.addContext('lineNumber', lineNumber)
}

let logger = {
  trace,
  debug,
  info,
  warn,
  error,
  fatal
}

global.logger = logger
global.setUserIdLogCtx = setUserIdLogCtx
