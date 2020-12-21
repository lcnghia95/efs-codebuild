const app = require('@server/server')
const {
  find,
} = require('@server/utils/model')

// models
const commonPickupContentModel = app.models.CommonPickupContents

//
const ArticleTypeId = 3
const VideoTypeId = 5

/**
 * Get index content
 *
 * @param {Void}
 * @return {Object}
 * @public
 */
async function index() {
  const [data, fxVideo] = await Promise.all([
    _data(),
    _fxVideo(),
  ])

  return data.reduce((result, item) => {
    if (result.articles.length < 2 && item.typeId == ArticleTypeId) {
      result.articles.push(_object(item))
    } else if (item.typeId == VideoTypeId) {
      result.video.push(_object(item))
    }
    return result
  }, {
    video: [],
    articles: [],
    fxVideo,
  })
}

/**
 * get contents data
 *
 * @param {Void}
 * @return {Array}
 * @private
 */
async function _data() {
  return await commonPickupContentModel.find({
    where: {
      isValid: 1,
      typeId: {
        inq: [ArticleTypeId, VideoTypeId],
      },
    },
    fields: {
      typeId: true,
      title: true,
      imageUrl: true,
      linkUrl: true,
    },
  })
}

/**
 * get fx videos data
 *
 * @param {Void}
 * @return {Array}
 * @private
 */
async function _fxVideo() {
  return await find('asp', '_info_top_video', {
    where: {
      IsValid: 1,
      StatusId: 1,
    },
    fields: {
      Url: true,
    },
    order: ['Type ASC'],
  })
}

/**
 * Object item
 *
 * @param {Object} item
 * @return {Object}
 * @private
 */
function _object(item) {
  return {
    title: item.title,
    imageUrl: item.imageUrl,
    linkUrl: item.linkUrl,
  }
}

module.exports = {
  index,
}
