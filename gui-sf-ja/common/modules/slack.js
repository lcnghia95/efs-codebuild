'use strict'
const { slack } = require('@ggj/utils')

module.exports = function(envType, error, url, referer = '') {
  const preContent = `:boom:
    Env: \`Surface ${envType}\`
    Request url: \`${url}\`
    Referer: \`${referer || 'empty'}\``

  const message = error.stack
  console.log('slackkkkkkkkkk', preContent, message)

  slack.send({message, preContent}, process.env.SLACK_HOOK_URL)
}
