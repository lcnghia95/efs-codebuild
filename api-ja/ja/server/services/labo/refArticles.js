const app = require('@server/server')

const fs = require('fs')
const formData = require('form-data')
const path = require('path')
const parseUrl = require('url').parse

const categoryModel = app.models.RefCategories
const articlesModel = app.models.RefArticles
const subjectModel = app.models.RefSubjects
const utils = require('./utils')
const model = require('@server/utils/model')
const autoCatch = require('@server/utils/promise')

const pagingUtil = app.utils.paging

const SPLITER = '*'

const REF_KEY = process.env.REF_KEY

const innerFields = [
  'refCategory',
  'publishedAt',
  'viewCount',
]
const outerFields = [
  'commentsCount',
  'bookmarksCount',
  'likesCount',
]
const tableMap = {
  'commentsCount': 'ref_comments',
  'bookmarksCount': 'bookmarks',
  'likesCount': 'likes',
}
const fnSort = function(input) {
  return (a, b) => {
    return input.sortOrder === 'DESC' ?
      b[input.sortBy] - a[input.sortBy] :
      a[input.sortBy] - b[input.sortBy]
  }
}

/**
 * List latest reference article to show in reference index page
 * @param {*} input
 * @returns {Promise<Object>}
 */
async function getCategories() {
  const query = {
      fields: {
        id: true,
        name: true,
        shortName: true,
      },
      where: {
        isValid: 1,
      },
    }
    const data = categoryModel.find(query)
  return data
}

/**
 * List latest reference article to show in reference index page
 * @param {*} input
 * @returns {Promise<Object>}
 */
async function listLatest(input) {
  const limit = input.limit || 10
    const page = input.page || 1
    const offset = pagingUtil.getOffsetCondition(page, limit)
    const query = {
      fields: {
        id: true,
        title: true,
        userId: true,
        publishedAt: true,
        subjectId: true,
        isCommentEnabled: true,
        content: true,
        isLocked: true,
        viewCount: true,
        refCategoryId: true,
      },
      include: [{
        relation: 'ofRefCategory',
        scope: {
          fields: {
            id: true,
            name: true,
            shortName: true,
          },
        },
      } ].concat(
        utils.statsRelationString({
          isIncludedComments: true,
        }),
      ),
    }
  if (outerFields.includes(input.sortBy)) {
    const sql =
      `SELECT A.id, A.ref_category_id, COUNT(C.id) AS ${tableMap[input.sortBy]}Count ` +
      'FROM ' +
      '  ref_articles A ' +
      '  LEFT JOIN ' +
      '  ( ' +
      `    SELECT id, ref_article_id FROM ${tableMap[input.sortBy]} ` +
      '  ) C ' +
      '  ON A.id = C.ref_article_id ' +
      'GROUP BY A.id ' +
      `ORDER BY ${tableMap[input.sortBy]}Count ${input.sortOrder};`
      const res = await autoCatch(model.excuteQuery('labo', sql))
      const articlesIds = res[1].map(item => {
        return item.id
      })
    query.where = {
      id: {
        inq: articlesIds,
      },
    }
  } else {
    query.order = innerFields.includes(input.sortBy) ?
      `${input.sortBy} ${input.sortOrder}` :
      'viewCount DESC'
  }
  query.limit = offset.limit
  query.skip = offset.skip
  query.where = Object.assign({}, query.where || {}, {
    isValid: 1,
  })
  let [total, dataArticles] = await Promise.all([
    articlesModel.count({}),
    articlesModel.find(query),
  ])

  dataArticles = utils.getStats(dataArticles, {
    isIncludeComments: true,
  })
  dataArticles.sort(fnSort(input))
  return pagingUtil.addPagingInformation(
    dataArticles,
    parseInt(page),
    total,
    offset.limit,
  )
}

// TODO: REFACTOR group duplicated codes, only query conditions are differents
/**
 * List all ref_articles under a category
 * @param {*} input
 * @param {*} catId
 */
// TODO: optimize use one sql query only
async function listByCategory(input, catId) {
  const limit = input.limit || 10
    const page = input.page || 1
    const offset = pagingUtil.getOffsetCondition(page, limit)
    const query = {
      fields: {
        id: true,
        title: true,
        userId: true,
        publishedAt: true,
        subjectId: true,
        content: true,
        isCommentEnabled: true,
        isLocked: true,
        viewCount: true,
        refCategoryId: true,
      },
      include: [{
        relation: 'ofRefCategory',
        scope: {
          fields: {
            id: true,
            name: true,
            shortName: true,
          },
        },
      }, {
        relation: 'ofRefSubject',
        scope: {
          fields: {
            id: true,
            name: true,
          },
        },
      } ].concat(
        utils.statsRelationString({
          isIncludedComments: true,
        }),
      ),
    }
  if (outerFields.includes(input.sortBy)) {
    const sql =
      `SELECT A.id, A.ref_category_id, COUNT(C.id) AS ${tableMap[input.sortBy]}Count ` +
      'FROM ' +
      '  ref_articles A ' +
      '  LEFT JOIN ' +
      '  ( ' +
      `    SELECT id, ref_article_id FROM ${tableMap[input.sortBy]} ` +
      '  ) C ' +
      '  ON A.id = C.ref_article_id ' +
      `WHERE A.ref_category_id = ${catId} ` +
      'GROUP BY A.id ' +
      `ORDER BY ${tableMap[input.sortBy]}Count ${input.sortOrder};`
      const res = await autoCatch(model.excuteQuery('labo', sql))
      const articlesIds = res[1].map(item => {
        return item.id
      })
    query.where = {
      id: {
        inq: articlesIds,
      },
    }
  } else {
    query.where = {
      refCategoryId: catId,
    }
    query.order = innerFields.includes(input.sortBy) ?
      `${input.sortBy} ${input.sortOrder}` :
      'publishedAt DESC'
  }
  query.limit = offset.limit
  query.skip = offset.skip
  let [total, dataArticles] = await Promise.all([
    articlesModel.count({
      refCategoryId: catId,
    }),
    articlesModel.find(query),
  ])

  dataArticles = utils.getStats(dataArticles, {
    isIncludeComments: true,
  })
  dataArticles.sort(fnSort(input))
  return pagingUtil.addPagingInformation(
    dataArticles,
    parseInt(page),
    total,
    offset.limit,
  )
}

/**
 * List all ref_articles under subcategory
 * @param {*} input
 * @param {Number} subjectId
 */
// TODO: optimize use one sql query only
async function listBySubject(input, subjectId) {
  const limit = input.limit
    const page = input.page || 1
    const offset = pagingUtil.getOffsetCondition(page, limit)
    const query = {
      fields: {
        id: true,
        title: true,
        userId: true,
        publishedAt: true,
        subjectId: true,
        content: true,
        isLocked: true,
        isCommentEnabled: true,
        viewCount: true,
        refCategoryId: true,
      },
      include: [{
        relation: 'ofRefCategory',
        scope: {
          fields: {
            id: true,
            name: true,
            shortName: true,
          },
        },
      }].concat(
        utils.statsRelationString({
          isIncludedComments: true,
        }),
      ),
    }

  if (outerFields.includes(input.sortBy)) {
    const sql =
      `SELECT A.id, A.ref_category_id, COUNT(C.id) AS ${tableMap[input.sortBy]}Count ` +
      'FROM ' +
      '  ref_articles A ' +
      '  LEFT JOIN ' +
      '  ( ' +
      `    SELECT id, ref_article_id FROM ${tableMap[input.sortBy]} ` +
      '  ) C ' +
      '  ON A.id = C.ref_article_id ' +
      `WHERE A.subject_id = ${subjectId} ` +
      'GROUP BY A.id ' +
      `ORDER BY ${tableMap[input.sortBy]}Count ${input.sortOrder};`
      const res = await autoCatch(model.excuteQuery('labo', sql))
      const articlesIds = res[1].map(item => {
        return item.id
      })
    query.where = {
      id: {
        inq: articlesIds,
      },
    }
  } else {
    query.where = {
      subjectId: subjectId,
    }
    query.order = innerFields.includes(input.sortBy) ?
      `${input.sortBy} ${input.sortOrder}` :
      'publishedAt DESC'
  }
  query.limit = offset.limit
  query.skip = offset.skip
  const [total, dataSubCate, dataArticles] = await Promise.all([
      articlesModel.count({
        subjectId: subjectId,
      }),
      subjectModel.findById(subjectId, {
        include: [{
          relation: 'ofRefCategory',
          scope: {
            fields: {
              id: true,
              icon: true,
              name: true,
            },
          },
        }],
        fields: {
          id: true,
          name: true,
          shortName: true,
          refCategoryId: true,
        },
      }),
      articlesModel.find(query),
    ])
  const dataResult = pagingUtil.addPagingInformation(
      utils.getStats(dataArticles, {
        isIncludeComments: true,
      }),
      parseInt(page),
      total,
      offset.limit,
    )
  if (!total || !dataSubCate) {
    return dataResult
  }
  dataResult.data.sort(fnSort(input))
  dataResult.subjectId = dataSubCate.id
  dataResult.subjectName = dataSubCate.name
  dataResult.subCategoryIcon = dataSubCate.ofRefCategory().icon
  dataResult.categoryId = dataSubCate.ofRefCategory().id
  dataResult.categoryName = dataSubCate.ofRefCategory().name
  dataResult.categoryShortName = dataSubCate.ofRefCategory().shortName
  return dataResult
}

/**
 * No Search here
 * Search ref_articles's title by keyword
 * @param {*} input
 */
async function search(input) {
  const limit = input.limit || 10
    const page = input.page || 1
    const keyword = input.keyword
    const offset = pagingUtil.getOffsetCondition(page, limit)
    const query = {
      fields: {
        id: true,
        title: true,
        userId: true,
        publishedAt: true,
        subjectId: true,
        isLocked: true,
        isCommentEnabled: true,
        viewCount: true,
        refCategoryId: true,
        content: true,
      },
      include: [{
        relation: 'ofRefCategory',
        scope: {
          fields: {
            id: true,
            name: true,
            shortName: true,
          },
        },
      }].concat(
        utils.statsRelationString({
          isIncludedComments: true,
          // isIncludedUser: true,
        }),
      ),
    }
  if (outerFields.includes(input.sortBy)) {
    const sql =
      `SELECT A.id, A.ref_category_id, COUNT(C.id) AS ${tableMap[input.sortBy]}Count ` +
      'FROM ' +
      '  ref_articles A ' +
      '  LEFT JOIN ' +
      '  ( ' +
      `    SELECT id, ref_article_id FROM ${tableMap[input.sortBy]} ` +
      '  ) C ' +
      '  ON A.id = C.ref_article_id ' + (
        keyword ? `WHERE A.title LIKE '%${keyword}%' ` : ''
      ) +

      'GROUP BY A.id ' +
      `ORDER BY ${tableMap[input.sortBy]}Count ${ input.sortOrder ? input.sortOrder : ''} `
      const res = await autoCatch(model.excuteQuery('labo', sql))
      const articlesIds = res[1].map(item => {
        return item.id
      })
    query.where = {
      id: {
        inq: articlesIds,
      },
    }
  } else {
    query.where = {
      title: {
        like: `%${keyword || ''}%`,
      },
    }
    query.order = innerFields.includes(input.sortBy) ?
      `${input.sortBy} ${input.sortOrder}` :
      'publishedAt DESC'
  }
  query.limit = offset.limit
  query.skip = offset.skip
  let [total, dataArticles] = await Promise.all([
    articlesModel.count({
      title: {
        like: `%${keyword || ''}%`,
      },
      content: {
        like: `%${keyword || ''}%`,
      },
    }),
    articlesModel.find(query),
  ])
  dataArticles = utils.getStats(dataArticles, true).sort(fnSort(input))
  return pagingUtil.addPagingInformation(
    dataArticles,
    parseInt(page),
    total,
    offset.limit,
  )
}

/**
 * Get article's detail
 * @param {*} articleId
 */
async function getDetail(refCategoryId, subjectId, articleId, meta) {
  if (!refCategoryId || !subjectId || !articleId) {
    return {}
  }

  const currentUserId = meta.userId || null
  const query = {
      where: {
        id: articleId,
        refCategoryId,
        subjectId,
      },
      include: [{
        relation: 'ofRefCategory',
        scope: {
          fields: {
            id: true,
            name: true,
            shortName: true,
          },
        },
      }, {
        relation: 'ofRefSubject',
        scope: {
          fields: {
            id: true,
            name: true,
          },
        },
      }].concat(
        utils.statsRelationString({
          isIncludedComments: false,
        }),
      ),
    }
  let dataArticle = {}

  dataArticle = await articlesModel.findOne(query)
  if (!dataArticle) {
    return {}
  }
  if (currentUserId) {
    [dataArticle.isBookmarked, dataArticle.isLiked] = await Promise.all([
      dataArticle.hasBookmarks.count({
        userId: currentUserId,
      }),
      dataArticle.hasLikes.count({
        userId: currentUserId,
      }),
    ])
  }
  dataArticle = utils.getStats(dataArticle)
  await utils.addUserInfo(dataArticle)
  dataArticle.isOwner = dataArticle.userId === currentUserId
  dataArticle.attachment = (dataArticle.attachment || '').split(SPLITER)
  dataArticle.attachmentName = (dataArticle.attachmentName || '').split(SPLITER)

  return dataArticle
}

/**
 * Save/create new article
 * @param {*} input
 * @param {array} files
 * @param {*} refKey
 */
async function store(input, files = [], refKey) {
  if (!_validateRefKey(refKey)) {
    console.log('Key invalid: \n- refKey: ', refKey)
    return {}
  }

  if (!Object.keys(input).length ||
    !input.subCategoryId ||
    !input.categoryId
  ) {
    console.log('Missing input:\n- Input: ', input)
    return {}
  }

  // TODO: performance
  let newArticle = await articlesModel.create({
    title: input.title,
    content: input.content || '',
    subjectId: input.subCategoryId,
    refCategoryId: input.categoryId,
    publishedAt: Date.now(),
    isCommentEnabled: !parseInt(input.isLocked),
  })

  if (files.length) {
    newArticle = await _uploadFile(newArticle, files)
  }

  return newArticle
}

/**
 * validate refKey when post ref_articles
 * @param {string} refKey
 *
 * return boolean
 */
function _validateRefKey(refKey) {
  if (!refKey || refKey != REF_KEY){
    return false
  }

  return true
}

/**
 * Edit article's title or content
 * @param {*} input
 * @param {*} meta
 */
async function update(id, input, meta) {
  if (!Object.keys(input).length ||
    !meta.userId ||
    !id
  ) {
    return {}
  }
  // TODO: validate userId

  const article = await articlesModel.findOne({
    where: {
      id: id,
      // userId: meta.userId,
    },
  })
  if (!article) {
    return {}
  }
  article.title = input.title || article.title
  article.content = input.content || article.content
  try {
    await article.save()
  } catch (e) {
    console.log('Update ref article failed: ', e)
  }
  return article
}

/**
 * Increase view count of article
 * @param {*} articleId
 * @param {*} meta
 */
async function increaseView(articleId) {
  if (!articleId) {
    return 0
  }

  // TODO: check performance
  const article = await articlesModel.findOne({
    where: {
      id: articleId,
    },
  })
  article.viewCount++
  await article.save()

  return 1
}

async function getRelatedUsers(articleId, excludedUserId) {
  if (!articleId) {
    console.log('Missing articleId!')
    return []
  }
  const objArticle = await articlesModel.findById(articleId, {
      include: [{
        relation: 'hasComments',
        scope: {
          fields: {
            id: true,
            userId: true,
          },
        },
      }],
      fields: {
        id: true,
        userId: true,
      },
    })
    const usersList = [objArticle.userId]
    const commentsList = objArticle.hasComments()
  for (let i = 0; i < commentsList.length; i++) {
    if (!usersList.includes(commentsList[i].userId)) {
      if (excludedUserId && commentsList[i].userId === excludedUserId)
        {continue}
      usersList.push(commentsList[i].userId)
    }
  }
  return usersList
}


/**
 * upload file and update article data
 * @param {object} article
 * @param {array} files
 */
async function _uploadFile(article = {}, files) {
  try {
    const att = []
      const attName = []
    for (let i = 0, l = files.length; i < l; i++) {
      const imgUrl = `labo/refs/article/${article.id}`
        const isImage = files[i].mimetype.includes('image')

        // fileUtil sometime cause error when send multiple file
        const res = await _upload(files[i], imgUrl, isImage)

      att.push(res.url)
      attName.push(files[i].originalname)
    }

    article.attachment = att.join(SPLITER)
    article.attachmentName = attName.join(SPLITER)
    await article.save()

    // delete files after uploaded
    files.map(file => {
      _deleteFile(file)
    })
  } catch (e) {
    console.log('Upload file error: ', e)
    return article
  }

  return article
}

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
 * Upload a file/image to storage server
 * @param {*} file
 * @param {*} uploadPath: 'path/to/file/'
 * @param {*} isImg
 * @returns {Promise<Object>}
 */
async function _upload(file, uploadPath, isImg = false) {
  if (!isImg || !_validate(file, isImg)) {
    return {}
  }

  const form = new formData()
    const destinationPath = (
      isImg ?
        process.env.IMG_HOST_URL :
        process.env.FILE_HOST_URL + 'upload/'
    ) + uploadPath
    const config = parseUrl(destinationPath)
    const options = {
      port: config.port,
      path: config.pathname,
      host: config.hostname,
      protocol: config.protocol,
      headers: !isImg ? {} : {
        [process.env.IMG_ACCESS_KEY]: process.env.IMG_ACCESS_VALUE,
      },
    }
  return new Promise((resolve, reject) => {
    form.append('file', fs.createReadStream(file.path), file.originalname)
    form.submit(options, function(err, res) {
      if (err) {
        console.log('Submit file to file server failed: ', err)
        return reject(err)
      }

      let body = ''
      res.on('data', function(chunk) {
        body += chunk
      })
      res.on('end', async function() {
        try {
          const responseData = JSON.parse(body)
          responseData.url = '/' + uploadPath + '/' + responseData.number
          resolve(responseData)
        } catch (e) {
          reject(e)
        }
      })
    })
  })
}

/**
 * Validate image/file
 *
 * @param file
 * @param isImg
 * @returns {boolean}
 * @private
 */
async function _validate(file, isImg) {
  const maxSize = isImg ? 3e7 : 5e6 // img: 30 MB, file: 5MB
    const fileName = !file ? '' : file.originalname
    const fileSize = !file ? 0 : file.size
    const filtered = (
      isImg ?
        ['.png', '.jpg', '.bmp', '.gif', '.jpeg'] :
        ['pdf', 'zip', 'rar']
    )
      .filter(
        ext => {
          path.extname(fileName).toLowerCase().includes(ext)
        })

  return filtered.length === 1 && fileSize <= maxSize
}

module.exports = {
  getCategories,
  listLatest,
  listByCategory,
  listBySubject,
  // getRelatedArticles,
  search,
  getDetail,
  store,
  update,
  increaseView,
  getRelatedUsers,
}
