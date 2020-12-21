const userSubscribe = require('@services/mypage/user/subscribe')

/**
 * Get subscribed salons of current user (only isFinished == 0)
 *
 * @param input
 * @param meta
 * @return {Promise<array>}
 */
async function subscribe(input, meta) {
  return await userSubscribe.subscribe(meta.userId, [4])
}

/**
 * Unsubscribe a salon of current user
 *
 * @param input
 * @param meta
 * @return {Promise<void>}
 */
async function unsubscribe(input, meta) {
  return await userSubscribe.unsubscribe(input, meta.userId, [4])
}

module.exports = {
  subscribe,
  unsubscribe,
}
