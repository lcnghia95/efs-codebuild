'use strict'

function isLocal() {
  return !['production', 'staging'].includes(process.env.ENV)
}

function hasSourceMap() {
  return ['staging', 'local'].includes(process.env.ENV) || isLocal()
}

function isAnalyze() {
  return 'true' === process.env.ANALYZE
}

module.exports = {
  isLocal,
  hasSourceMap,
  isAnalyze,
}
