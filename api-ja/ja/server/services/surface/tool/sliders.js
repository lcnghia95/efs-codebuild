const app = require('@server/server')
const helper = require('@services/surface/tool/helper')
const topSiderModel = app.models.TopSliders

/**
 * Default fields name of recommend product
 * @var {string}
 */
const FIELDS = 'id,content'

/**
 * Get new products for index page
 *
 * @returns {Promise<Object>}
 */
async function index() {
  const data = await helper.data(topSiderModel, FIELDS, {
    where: {
      servicePath: '/tools',
    },
    limit: 0,
  })

  return data.map(record => record.content)
}

module.exports = {
  index,
}
