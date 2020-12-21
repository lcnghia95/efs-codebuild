'use strict'
const Slack = require('slack-node')
const slackChannel = process.env.SLACK_CHANNEL
const slack = new Slack()
slack.setWebhook(process.env.SLACK_HOOK_URL)

module.exports = function(envType, error, url, referer = '') {
  let n = new Date(),
    ct = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-\
${String(n.getDate()).padStart(2, '0')} \
${String(n.getHours()).padStart(2, '0')}:\
${String(n.getMinutes()).padStart(2, '0')}:\
${String(n.getSeconds()).padStart(2, '0')}:\
${String(n.getMilliseconds()).padStart(2, '0')}`,
    errMsg = `:boom: \`${ct}\`
Env: \`Surface ${envType}\`
Url: \`${url}\`
Referer: \`${referer}\`
\`\`\`
${error.stack}
\`\`\`
`
  slack.webhook(
    {
      channel: `#${slackChannel}`,
      username: 'log-bot',
      text: errMsg,
    },
    function(err) {
      if (err) {
        console.log('Slack err: ', err)
      }
    }
  )
}
