const app = require('@server/server')
const topSliderModel = app.models.TopSliders

//
const IDS = [1, 2, 3, 4, 5, 6]

/**
 * Get Recent Products index
 *
 * @param {Void}
 * @return {Object}
 * @public
 */
async function index() {
  return await topSliderModel.find({
    where: {
      id: {
        inq: IDS
      },
      isValid: 1
    },
    fields: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
    }
  })
}

module.exports = {
  index,
}
