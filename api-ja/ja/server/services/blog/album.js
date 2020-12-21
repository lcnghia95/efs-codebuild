const app = require('@server/server')
const fs = require('fs')
const imageModel = app.models.Images
const albumModel = app.models.Album
const getTime = require('date-fns/get_time')
const objectUtil = require('@ggj/utils/utils/object')
const utils = app.utils

/**
 * Get all images from album of current user
 *
 * @param input
 * @param meta
 * @returns {Promise<Array>}
 */
async function index(input, meta) {
  const year = parseInt(input.year)
  const month = parseInt(input.month || 0)
  const time = _getTimeRange(year, month)
  const images = await albumModel.find({
    where: objectUtil.deepFilter({
      isValid: 1,
      userId: meta.userId,
      and: !time ? null : [
        {
          createdAt: {gte: getTime(time.start)},
        },
        {
          createdAt: {lt: getTime(time.end)},
        },
      ],
    }),
  })

  return images.map(image => {
    return {
      isSelect: image.isSelect,
      name: image.name,
      size: image.size,
      number: image.number,
      createdDate: image.createdAt,
    }
  })
}

/**
 * Get time range of given year and month for get album images
 *
 * @param {Number} year
 * @param {Number} month
 * @returns {Object}
 * @private
 */
function _getTimeRange(year, month) {
  // If invalid year, return null
  if (!year) {
    return null
  }

  if (month === 0) {
    return {
      start: `${year}-01-01 00:00:00`,
      end: `${year + 1}-01-01 00:00:00`,
    }
  }
  return {
    start: `${year}-${month}-01 00:00:00`,
    end: `${year}-${month + 1}-01 00:00:00`,
  }
}

/**
 * Get all selected images of current user
 *
 * @param meta
 * @returns {Promise<Array>}
 */
async function selectedImages(meta) {
  const images = await albumModel.find({
    where: {
      isValid: 1,
      isSelect: 1,
      userId: meta.userId,
    },
  })

  return images.map(image => {
    return {
      name: image.name,
      size: image.size,
      number: image.number,
      createdDate: image.createdAt,
    }
  })
}

/**
 * Add/Remove given images into/out selected
 *
 * @param input
 * @returns {Promise<Object>}
 */
async function changeSelectStatus(input) {
  const images = await albumModel.find({
    where: {
      isValid: 1,
      number: {inq: input.number},
    },
  })

  let selected = 0, unselected = 0

  await Promise.all(images.map(async image => {
    if (image.isSelect) {
      image.isSelect = 0
      unselected++
    } else {
      image.isSelect = 1
      selected++
    }

    return await image.save()
  }))

  return {
    selected,
    unselected,
  }
}

/**
 * Upload a new image
 *
 * @param input
 * @param file
 * @param meta
 * @returns {Promise<Object>}
 */
async function upload(input, file, meta) {
  const userId = meta.userId
  if (userId === 0 || !_validate(file, userId)) {
    _deleteFile(file)
    return {}
  }

  // Upload image into image server
  const res = await utils.file.upload(file, 'blog/user/' + userId, true)

  // Add new record into album of current user
  await _addAlbumRecord(userId, res.number, file, input.isSelect || 0)

  return res
}

/**
 * Destroy given image of current user
 *
 * @param imageId
 * @param meta
 * @returns {Promise<*>}
 */
async function destroy(imageId, meta) {
  // Remove image db record in `images` and `album`
  const userId = meta.userId
  const [image, album] = await Promise.all([
    imageModel.destroyAll({
      imageCategoryId: 27,
      masterId: meta.userId,
      imageNumber: imageId,
    }),
    albumModel.destroyAll({
      userId,
      number: imageId,
    }),
  ])

  // Remove image source
  await utils.http.imgHttp(userId).delete(
    '/blog/user/' + userId + '/' + imageId,
    {
      headers: {
        [process.env.IMG_ACCESS_KEY]: process.env.IMG_ACCESS_VALUE,
      },
    },
  )

  return {
    count: image.count + album.count,
  }
}

/**
 * Validate given file
 *
 * @param file
 * @returns {boolean}
 * @private
 */
async function _validate(file) {
  const maxSize = 3e7 // 30 MB,
  const fileName = !file ? '' : file.originalname
  const fileSize = !file ? 0 : file.size
  const filtered = ['png', 'jpg', 'bmp', 'gif', 'jpeg', 'PNG']
    .filter(ext => (fileName.includes(ext) && fileSize <= maxSize))

  return filtered.length === 1
}

// /**
//  * Count total images in album of current user
//  *
//  * @param userId
//  * @returns {Promise<boolean>}
//  * @private
//  */
// async function _countImages(userId) {
//   let count = await albumModel.count({
//     userId,
//   })
//
//   return count <= 30
// }

/**
 * Delete given file if it was exist
 *
 * @param file
 * @returns {Promise<void>}
 * @private
 */
async function _deleteFile(file) {
  fs.unlink(file.path, error => {
    if (error) {
      console.log(
        `Error to delete file by path: ${file.path}. ${error.message}`,
      )
    }
  })
}

/**
 *
 * @param userId
 * @param number
 * @param file
 * @param isSelect
 * @returns {Promise<Object>}
 * @private
 */
async function _addAlbumRecord(userId, number, file, isSelect = 0) {
  return await albumModel.create({
    isValid: 1,
    isSelect,
    name: file.originalname,
    number: number,
    userId,
    size: file.size,
  })
}

module.exports = {
  index,
  selectedImages,
  changeSelectStatus,
  upload,
  destroy,
}
