const { slack } = require('@ggj/utils')
const DEFAULT_WEB_HOOK = process.env.DEFAULT_SLACK_WEBHOOK

/**
 * Send specific text/attachment to slack
 * If webHookUrl wasn't given, default web hook will be use
 *
 * @param {string} text
 * @param {object | null} attachment
 * @param {string | null} webHookUrl
 * @return {Promise<IncomingWebhookResult>}
 */
async function send(text, preContent = null, webHookUrl = null) {
  const webHook = webHookUrl || DEFAULT_WEB_HOOK
  if (!webHook) {
    return
  }

  const slackObj = {
    message: text || '',
    preContent: preContent || '',
  }

  return await slack.send(
    slackObj,
    webHook,
  )
}

/**
 * Common send slack
 * @param text
 * @param preContent
 * @param channelName
 */
function sendV2(text, preContent = null, channelName = null) {
  if (!channelName) {
    console.log('============ Slack sendV2 no channelName')
    return
  }
  slack.sendV2(preContent, text, channelName)
}

module.exports = {
  send,
  sendV2,
}
