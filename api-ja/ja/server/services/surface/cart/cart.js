const helper = require('@services/cart/helper')

/**
 * Get total item in cart of current user
 *
 * @param meta
 * @returns {Promise<Object>}
 */
async function count(meta) {
  let count = await helper.countProductInCart(null, meta.userId, meta.cartSessionId)
  return {
    count
  }
}

module.exports = {
  count
}
