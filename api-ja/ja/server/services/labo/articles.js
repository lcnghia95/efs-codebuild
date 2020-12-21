const app = require('@server/server')

const articlesModel = app.models.LaboArticles
const answersModel = app.models.Answers
const subCategoryModel = app.models.SubCategories
const utils = require('./utils')
const model = require('@server/utils/model')
const autoCatch = require('@server/utils/promise')

const fileUtils = app.utils.file
const pagingUtil = app.utils.paging
const spliter = '*'

const innerFields = [
  'subCategory',
  'publishedAt',
  'viewCount',
]
const outerFields = [
  'answersCount',
  'bookmarksCount',
  'likesCount',
]
const tableMap = {
  'answersCount': 'answers',
  'bookmarksCount': 'bookmarks',
  'likesCount': 'likes',
}
const fnSort = function(input) {
  return (a, b) => {
    return input.sortOrder === 'DESC'
      ? b[input.sortBy] - a[input.sortBy]
      : a[input.sortBy] - b[input.sortBy]
  }
}

// TODO: REFACTOR group duplicated codes, only query conditions are differents
/**
 * List all articles under a category
 * @param {*} input
 * @param {*} catId
 */
// TODO: optimize use one sql query only
async function listTopArticle(req) {
  const limit = parseInt(req.query.limit) || 24
    const query = {
      fields: {
        id: true,
        title: true,
        content: true,
        categoryId: true,
        subCategory: true,
      },
      include: [
        {
          relation: 'ofCategory',
          scope: {
            fields: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        {
          relation: 'ofSubCategory',
          scope: {
            fields: {
              id: true,
              shortName: true,
              color: true,
            },
          },
        },
      ],
      limit: limit,
      order: 'publishedAt ASC',
    }
    const articles = await articlesModel.find(query)
  articles.forEach(item => {
    item.content = item.content.slice(0, 180)
  })
  return articles
}
async function listByCategory(input, catId) {
  const limit = input.limit || 10
    const page = input.page || 1
    const offset = pagingUtil.getOffsetCondition(page, limit)
    const ofSubCategory = [{
      relation: 'ofSubCategory',
      scope: {
        fields: {
          id: true,
          shortName: true,
          color: true,
        },
      },
    }]
    const query = {
      fields: {
        id: true,
        title: true,
        userId: true,
        publishedAt: true,
        subCategory: true,
        isLocked: true,
        isCommentEnabled: true,
        viewCount: true,
        content: true,
      },
      include: utils.statsRelationString({
        isIncludedAnswers: true,
      }).concat(ofSubCategory),
    }
  if (outerFields.includes(input.sortBy)) {
    const sql =
        `SELECT A.id, A.category_id, COUNT(C.id) AS ${tableMap[input.sortBy]}Count ` +
        'FROM ' +
        '  articles A ' +
        '  LEFT JOIN ' +
        '  ( ' +
        `    SELECT id, article_id FROM ${tableMap[input.sortBy]} ` +
        '  ) C ' +
        '  ON A.id = C.article_id ' +
        `WHERE A.category_id = ${catId} ` +
        'GROUP BY A.id ' +
        `ORDER BY ${tableMap[input.sortBy]}Count ${input.sortOrder};`
      const res = await autoCatch(model.excuteQuery('labo', sql))
      const articlesIds = res[1].map(item => {
        return item.id
      })
    query.where = {
      id: { inq: articlesIds },
    }
  } else {
    query.where = { categoryId: catId }
    query.order = innerFields.includes(input.sortBy)
      ? `${input.sortBy} ${input.sortOrder}`
      : 'publishedAt DESC'
  }
  query.limit = offset.limit
  query.skip = offset.skip
  let [total, dataArticles] = await Promise.all([
    articlesModel.count({
      categoryId: catId,
    }),
    articlesModel.find(query),
  ])
  dataArticles = utils.getStats(dataArticles, { isIncludeAnswers: true})
  dataArticles.sort(fnSort(input))
  await utils.addUserInfo(dataArticles)
  return pagingUtil.addPagingInformation(
    dataArticles,
    parseInt(page),
    total,
    offset.limit,
  )
}

/**
 * List all articles under some subcategories
 * @param {*} input
 * @param {*} arrSubCateIds
 */
async function getArticlesInSubCategories(input, arrSubCateIds) {
  const limit = input.limit || 10
  const page = input.page || 1
  const offset = pagingUtil.getOffsetCondition(page, limit)
  const query = {
      subCategory: {
        inq: arrSubCateIds || [],
      },
    }
  let [total, dataArticles] = await Promise.all([
      articlesModel.count(query),
      articlesModel.find({
        where: query,
        order: ['publishedAt DESC'],
        limit: offset.limit,
        skip: offset.skip,
        fields: {
          id: true,
          title: true,
          userId: true,
          publishedAt: true,
          subCategory: true,
          isLocked: true,
          isCommentEnabled: true,
          viewCount: true,
        },
        include: utils.statsRelationString({
          isIncludedAnswers: true,
          // isIncludedUser: true,
        }),
      }),
    ])

  dataArticles = utils.getStats(dataArticles, { isIncludeAnswers: true})
  await utils.addUserInfo(dataArticles)
  return pagingUtil.addPagingInformation(
    dataArticles,
    parseInt(page),
    total,
    offset.limit,
  )
}

/**
 * List all articles under subcategory
 * @param {*} input
 * @param {Number} subcatId
 */
// TODO: optimize use one sql query only
async function listBySubCategory(categoryId, input, subcatId) {
  const limit = input.limit || 10
    const page = input.page || 1
    const offset = pagingUtil.getOffsetCondition(page, limit)
    const ofSubCategory = [{
      relation: 'ofSubCategory',
      scope: {
        fields: {
          id: true,
          shortName: true,
          color: true,
        },
      },
    }]
    const query = {
      fields: {
        id: true,
        title: true,
        userId: true,
        publishedAt: true,
        subCategory: true,
        isLocked: true,
        isCommentEnabled: true,
        viewCount: true,
        content: true,
      },
      include: utils.statsRelationString({
        isIncludedAnswers: true,
      }).concat(ofSubCategory),
    }

  if (outerFields.includes(input.sortBy)) {
    const sql =
        `SELECT A.id, A.category_id, COUNT(C.id) AS ${tableMap[input.sortBy]}Count ` +
        'FROM ' +
        '  articles A ' +
        '  LEFT JOIN ' +
        '  ( ' +
        `    SELECT id, article_id FROM ${tableMap[input.sortBy]} ` +
        '  ) C ' +
        '  ON A.id = C.article_id ' +
        `WHERE A.sub_category = ${subcatId} AND A.category_id = ${categoryId} ` +
    'GROUP BY A.id ' +
        `ORDER BY ${tableMap[input.sortBy]}Count ${input.sortOrder};`
      const res = await autoCatch(model.excuteQuery('labo', sql))
      const articlesIds = (res[1] || []).map(item => {
        return item.id
      })
    query.where = {
      id: { inq: articlesIds },
    }
  } else {
    query.where = { subCategory: subcatId }
    query.order = innerFields.includes(input.sortBy)
      ? `${input.sortBy} ${input.sortOrder}`
      : 'publishedAt DESC'
  }
  query.limit = offset.limit
  query.skip = offset.skip
  const [total, dataSubCate, dataArticles] = await Promise.all([
      articlesModel.count({ subCategory: subcatId, categoryId }),
      subCategoryModel.findOne({
        include: [
          {
            relation: 'ofCategory',
            scope: {
              fields: {
                id: true,
                icon: true,
                name: true,
              },
            },
          },
        ],
        fields: {
          id: true,
          name: true,
          shortName: true,
          categoryId: true,
        },
        where: {
          id: subcatId,
          isAccepted: 1,
          categoryId,
        },
      }),
      articlesModel.find(query),
    ])

    const dataResult = pagingUtil.addPagingInformation(
      utils.getStats(dataArticles, { isIncludeAnswers: true}),
      parseInt(page),
      total,
      offset.limit,
    )
  if (!dataSubCate) {
    return {}
  }
  dataResult.data.sort(fnSort(input))
  await utils.addUserInfo(dataResult.data)
  dataResult.subCategoryId = dataSubCate.id
  dataResult.subCategoryName = dataSubCate.name
  dataResult.subCategoryShortName = dataSubCate.shortName
  dataResult.subCategoryIcon = dataSubCate.ofCategory().icon
  dataResult.categoryId = dataSubCate.ofCategory().id
  dataResult.categoryName = dataSubCate.ofCategory().name
  return dataResult
}

/**
 * list related article (same sub category) to display inside article detail
 * @param {*} input
 * @param {*} articleId
 */
async function getRelatedArticles(input, articleId) {
  const limit = input.limit || 3
    const query = {
      where: {
        id: {
          neq: articleId,
        },
      },
      order: ['publishedAt DESC'],
      limit: limit,
      fields: {
        id: true,
        title: true,
        userId: true,
        publishedAt: true,
        subCategory: true,
        isLocked: true,
        isCommentEnabled: true,
        viewCount: true,
        content: true,
      },
      include: [{
        relation: 'ofSubCategory',
        scope: {
          id: true,
          shortName: true,
        },
      }].concat(
        utils.statsRelationString({
          isIncludedAnswers: true,
          // isIncludedUser: true,
        }),
      ),
    }
  if (input.subCateId) {
    query.where.subCategory = input.subCateId
  }

  let dataArticles = await articlesModel.find(query)
  dataArticles = utils.getStats(dataArticles, { isIncludeAnswers: true})
  await utils.addUserInfo(dataArticles)
  return dataArticles
}

/**
 * Search articles's title by keyword
 * @param {*} input
 */
// TODO: optimize use one sql query only
async function search(input) {
  const limit = input.limit || 10
    const keyword = input.keyword
    const page = input.page || 1
    const offset = pagingUtil.getOffsetCondition(page, limit)
    const query = {
      fields: {
        id: true,
        title: true,
        userId: true,
        publishedAt: true,
        subCategory: true,
        isLocked: true,
        isCommentEnabled: true,
        viewCount: true,
        content: true,
      },
      include: [{
        relation: 'ofSubCategory',
        scope: {
          id: true,
          shortName: true,
        },
      }].concat(
        utils.statsRelationString({
          isIncludedAnswers: true,
          // isIncludedUser: true,
        }),
      ),
    }
  if (outerFields.includes(input.sortBy)) {
    const sql =
        `SELECT A.id, A.category_id, COUNT(C.id) AS ${tableMap[input.sortBy]}Count ` +
        'FROM ' +
        '  articles A ' +
        '  LEFT JOIN ' +
        '  ( ' +
        `    SELECT id, article_id FROM ${tableMap[input.sortBy]} ` +
        '  ) C ' +
        '  ON A.id = C.article_id ' + (
          keyword ? `WHERE A.title LIKE '%${keyword}%' ` : ''
        ) +
        'GROUP BY A.id ' +
        `ORDER BY ${tableMap[input.sortBy]}Count ${input.sortOrder};`
      const res = await autoCatch(model.excuteQuery('labo', sql))
      const articlesIds = res[1].map(item => {
        return item.id
      })
    query.where = {
      id: { inq: articlesIds },
    }
  } else {
    query.where = { title: { like: `%${keyword || ''}%` } }
    query.order = innerFields.includes(input.sortBy)
      ? `${input.sortBy} ${input.sortOrder}`
      : 'publishedAt DESC'
  }
  query.limit = offset.limit
  query.skip = offset.skip
  let [total, dataArticles] = await Promise.all([
    articlesModel.count({ title: { like: `%${keyword || ''}%` } }),
    articlesModel.find(query),
  ])

  dataArticles = utils.getStats(dataArticles, { isIncludeAnswers: true}).sort(fnSort(input))
  await utils.addUserInfo(dataArticles)
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
async function getDetail(articleId, meta) {
  if(!articleId) {
    return {}
  }

  const currentUserId = meta.userId || null
  const query = {
      where: {
        id: articleId,
      },
      include: [
        {
          relation: 'ofCategory',
          scope: {
            fields: {
              id: true,
              name: true,
              icon: true,
            },
          },
        },
        {
          relation: 'ofSubCategory',
          scope: {
            fields: {
              id: true,
              name: true,
            },
          },
        },
      ].concat(
        utils.statsRelationString({
          isIncludedAnswers: false,
          // isIncludedUser: true,
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
  dataArticle.attachment = (dataArticle.attachment || '').split(spliter)
  dataArticle.attachmentName = (dataArticle.attachmentName || '').split(spliter)
  return dataArticle
}

/**
 * Save/create new article
 * @param {*} input
 * @param {*} meta
 */
async function store(input, file, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId ||
    !input.subCategoryId
  ) {
    console.log('Missing input:\n- userId: ', meta.userId, '\n- Input: ', input)
    return {}
  }
  // TODO: validate userId
  const subCat = await subCategoryModel.count({
    id: input.articleId,
  })
  if (subCat == 0) {
    console.log('subcategory not exist: ', input.subCategoryId)
    return {}
  }

  // TODO: performance
  const newArticle = await articlesModel.create({
    title: input.title,
    content: input.content,
    userId: meta.userId,
    subCategory: input.subCategoryId,
    categoryId: input.categoryId,
    publishedAt: Date.now(),
    isNotifEnabled: (
      input.enableNotification == undefined ||
          input.enableNotification == null
    ) ? 1 : input.enableNotification,
    isCommentEnabled: !parseInt(input.isLocked),
    isBestAnswerEnabled: parseInt(input.isEnabledBestAnswer),
  })
  if (file && file.length) {
    try {
      const att = []; const attName = []
      for (let i = 0, l = file.length; i < l; i++) {
        const a = await fileUtils.upload(file[i], `labo/article/${newArticle.id}`,
          file[i].mimetype.includes('image'))
        att.push(a.url)
        attName.push(file[i].originalname)
      }
      newArticle.attachment = att.join(spliter)
      newArticle.attachmentName = attName.join(spliter)
      await newArticle.save()
    } catch (e) {
      console.log('Upload file error: ', e)
      return newArticle
    }
  }

  return newArticle
}

/**
 * Edit article's title or content
 * @param {*} input
 * @param {*} meta
 */
async function update(id, input, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId ||
    !id
  ) {
    return {}
  }
  // TODO: validate userId

  const article = await articlesModel.findOne({
    where: {
      id: id,
      userId: meta.userId,
    },
  })
  if (!article) {
    return {}
  }
  article.title = input.title || article.title
  article.content = input.content || article.content
  await article.save()
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

/**
 * Set best answer of an article
 * @param {*} articleId
 * @param {*} answerId
 * @param {*} meta
 * @returns {Promise<Number>}
 */
async function setBestAnswer(articleId, answerId, meta) {
  if (!articleId || !meta.userId) {
    return 0
  }

  // TODO: check performance
  const [article, bestAnswerCount] = await Promise.all([
    articlesModel.findById(articleId),
    answersModel.count({
      id: answerId,
      articleId: articleId,
    }),
  ])

  if (article && bestAnswerCount > 0) {
    if (meta.userId != article.userId) {
      console.log('You are not owner of this article, can not set best answer')
      return 0
    }
    let result = 0
    if (article.bestAnswer == answerId) {
      // already best -> unset best
      console.log('unset best')
      article.bestAnswer = null
      result = -1
    } else {
      article.bestAnswer = answerId
      result = 1
    }
    await article.save()
    return result
  }
  console.log('Article do not contain this answer')
  return 0
}

async function getRelatedUsers(articleId, excludedUserId) {
  if (!articleId) {
    console.log('Missing articleId!')
    return []
  }
  const objArticle = await articlesModel.findById(articleId, {
      include: [
        {
          relation: 'hasAnswers',
          scope: {
            fields: {
              id: true,
              userId: true,
            },
          },
        },
      ],
      fields: {
        id: true,
        userId: true,
      },
    })
    const usersList = [ objArticle.userId ]
    const answersList = objArticle.hasAnswers()
  for (let i = 0; i < answersList.length; i++) {
    if (!usersList.includes(answersList[i].userId)) {
      if (excludedUserId && answersList[i].userId === excludedUserId)
        {continue}
      usersList.push(answersList[i].userId)
    }
  }
  return usersList
}

module.exports = {
  listByCategory,
  getArticlesInSubCategories,
  listBySubCategory,
  getRelatedArticles,
  search,
  getDetail,
  store,
  update,
  increaseView,
  setBestAnswer,
  getRelatedUsers,
  listTopArticle,
}
