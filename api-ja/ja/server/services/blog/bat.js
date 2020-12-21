const app = require('@server/server')
const format = require('date-fns/format')
const blogRankingModel = app.models.BlogRanking
const blogModel = app.models.Blogs
const postModel = app.models.Posts
const postAccessModel = app.models.PostAccess

// Utils
const model = require('@@server/utils/model')
const arrayUtils = require('@ggj/utils/utils/array')
const timeUtils = require('@ggj/utils/utils/time')

async function countPostAccess() {
  let postAccess = await postAccessModel.find({
    fields: { id: true, postId: true },
  })

  postAccess = arrayUtils.groupArray(postAccess, 'postId')

  const postIds = Object.keys(postAccess).map(key => key)
  const posts = await postModel.find({
    where: {
      id: { inq: postIds },
    },
    fields: { id: true, accessCount: true },
  })
  const res = await Promise.all(posts.map(async post => {
    post.accessCount = postAccess[post['id']] ? postAccess[post['id']].length : 0
    await post.save()
  }))

  return { count: res.length }
}

async function countPostAccessDaily() {
  const dateCondition = _dateCondition(1)
  const from = dateCondition.from
  const to = dateCondition.to

  let postAccess = await postAccessModel.find({
    where: {
      and: [
        {createdAt: {gte: from}},
        {createdAt: {lte: to}},
      ],
    },
    fields: { id: true, postId: true },
  })
  
  postAccess = arrayUtils.groupArray(postAccess, 'postId')

  const postIds = Object.keys(postAccess).map(key => key)
  const posts = await postModel.find({
    where: {
      id: { inq: postIds },
    },
    fields: { id: true, accessCount: true },
  })
  const res = await Promise.all(posts.map(async post => {
    post.accessCountDaily = postAccess[post['id']] ? postAccess[post['id']].length : 0
    await post.save()
  }))

  return { count: res.length }
}

async function countPostAccessMonthly() {
  const dateCondition = _dateCondition(30)
  const from = dateCondition.from
  const to = dateCondition.to

  let postAccess = await postAccessModel.find({
    where: {
      and: [
        {createdAt: {gte: from}},
        {createdAt: {lte: to}},
      ],
    },
    fields: { id: true, postId: true },
  })

  postAccess = arrayUtils.groupArray(postAccess, 'postId')

  const postIds = Object.keys(postAccess).map(key => key)
  const posts = await postModel.find({
    where: {
      id: { inq: postIds },
    },
    fields: { id: true, accessCount: true },
  })
  const res = await Promise.all(posts.map(async post => {
    post.accessCountMonthly = postAccess[post['id']] ? postAccess[post['id']].length : 0
    await post.save()
  }))

  return { count: res.length }
}

async function countPostAccessWeekly() {
  const dateCondition = _dateCondition(7)
  const from = dateCondition.from
  const to = dateCondition.to

  let postAccess = await postAccessModel.find({
    where: {
      and: [
        {createdAt: {gte: from}},
        {createdAt: {lte: to}},
      ],
    },
    fields: { id: true, postId: true },
  })

  postAccess = arrayUtils.groupArray(postAccess, 'postId')

  const postIds = Object.keys(postAccess).map(key => key)
  const posts = await postModel.find({
    where: {
      id: { inq: postIds },
    },
    fields: { id: true, accessCount: true },
  })
  const res = await Promise.all(posts.map(async post => {
    post.accessCountWeekly = postAccess[post['id']] ? postAccess[post['id']].length : 0
    await post.save()
  }))

  return { count: res.length }
}

/**
 * Get total ranking of all blogs
 *
 * @returns {Promise<Object>}
 */
async function ranking() {
  const [total, rankingTotal, rankingCategories] = await Promise.all([
    blogModel.count(),
    _rankingTotal(),
    _rankingCategory(),
  ])
  const insertData = []
  const updateData = []

  Object.keys(rankingTotal).forEach(key => {
    const rankTotalRecord = rankingTotal[key]
    const rankCategoryRecord = rankingCategories[key]
    const blogObj = {
      id: rankTotalRecord.id,
      categoryId: rankCategoryRecord.categoryId,
      rankId: rankTotalRecord.rankId,
      rank: rankTotalRecord.rank,
      prevRank: rankTotalRecord.prevRank,
      catRank: rankCategoryRecord ? rankCategoryRecord.rank : null,
      catPrevRank: rankCategoryRecord ? rankCategoryRecord.prevRank : null,
      catTotal: rankCategoryRecord ? rankCategoryRecord.total : null,
    }

    if (blogObj.rankId) {
      updateData.push(blogObj)
    } else {
      insertData.push(blogObj)
    }
  })

  const rankIds = arrayUtils.column(updateData, 'rankId')
  await Promise.all([
    blogRankingModel.destroyAll({
      id: { nin: rankIds },
    }),
    _updateData(updateData, total),
    _insertData(insertData, total),
  ])

  return {
    total,
    updateTotal: updateData.length,
    insertTotal: insertData.length,
  }
}

/**
 * Get ranking total data (all categories)
 *
 * @return {Promise<object>}
 * @private
 */
async function _rankingTotal() {
  const sql =
    'Select b.id, c.id As rankId, c.rank As prevRank, @curRank := @curRank + 1 As rank\n' +
    'From\n' +
    '    (\n' +
    '        Select a.id, count(c.id) As access_count\n' +
    '        From blogs a\n' +
    '            Left Join posts b On a.id = b.blog_id\n' +
    '            Left Join post_access c On b.id = c.post_id\n' +
    '        Group by a.id\n' +
    '        Order by count(c.id) DESC, a.id ASC\n' +
    '    ) As rank Left Join blogs As b on rank.id = b.id\n' +
    '    Left Join blog_ranking As c on c.blog_id = b.id,\n' +
    '    (Select @curRank := 0) As r'
    const blogs = await model.excuteQuery('blog', sql)

  return arrayUtils.index(blogs, 'id')
}

/**
 * Get ranking based on category id
 *
 * @return {Promise<object>}
 * @private
 */
async function _rankingCategory() {
  let blogs = await blogModel.find({
      where: {
        isValid: 1,
      },
      fields: { id: true, categoryId: true },
    })

  const blogIds = arrayUtils.column(blogs, 'id')

  let [posts, blogRanking] = await Promise.all([
    postModel.find({
      where: {
        blogId: { inq: blogIds },
      },
      fields: {id: true, blogId: true},
    }),
    blogRankingModel.find({
      where: {
        blogId: { inq: blogIds },
      },
      fields: {id: true, blogId: true, categoryRank: true},
    }),
  ]),
  postIds = arrayUtils.column(posts, 'id'),
  postAccess = await postAccessModel.find({
    where: {
      postId: { inq: postIds },
    },
    fields: {id: true, postId: true},
  })

  // Group posts & postAccess by foreign key
  posts = arrayUtils.groupArray(posts, 'blogId')
  postAccess = arrayUtils.groupArray(postAccess, 'postId')

  // Count access for each blog
  blogs = blogs.map(blog => {
    const postGroup = posts[blog['id']]
    let accessCount = 0

    accessCount += !postGroup ? 0 : postGroup.reduce((sum, post) => {
      return sum + (postAccess[post['id']] || {length: 0}).length
    }, 0)

    return {
      id: blog.id,
      count: accessCount,
      categoryId: blog.categoryId,
    }
  })

  blogs = arrayUtils.groupArray(blogs, 'categoryId')

  Object.keys(blogs).forEach(categoryId => {
    blogs[categoryId].sort((a, b)=> {
      if (a.count === b.count)
        {return b.id - a.id}
      return b.count - a.count
    })
  })

  // Indexes old blog ranking data
  blogRanking = arrayUtils.index(blogRanking, 'blogId')

  return Object.keys(blogs).reduce((res, categoryId) => {
    const blogGroup = blogs[categoryId]

    blogGroup.forEach((blog, index) => {
      const rankRecord = blogRanking[blog['id']]
      res[blog['id']] = {
        categoryId,
        total: blogGroup.length,
        rank: index + 1,
        prevRank: rankRecord ? rankRecord.categoryRank : null,
      }
    })

    return res
  }, {})
}

/**
 * Update all given blogs data
 *
 * @param blogs
 * @param total
 * @return {Promise<*>}
 * @private
 */
async function _updateData(blogs, total) {
  blogs = blogs.map(blog => {
    return {
      id: blog.rankId,
      categoryId: blog.categoryId,
      isValid: 1,
      blogId: blog.id,
      total: total,
      categoryTotal: blog.catTotal,
      rank: blog.rank,
      prevRank: blog.prevRank || 0,
      categoryRank: blog.catRank,
      categoryPrevRank: blog.catPrevRank || 0,
    }
  })

  if (!blogs.length) {
    return []
  }

  const ids = arrayUtils.column(blogs, 'id')
  // Get old instances
  const rankData = await blogRankingModel.find({
    where: {
      id: {inq: ids},
    },
    fields: {id: true},
  })

  // Convert update data to key objects
  blogs = arrayUtils.index(blogs, 'id')

  // Bulk update
  return await Promise.all(rankData.map(async record => {
    return await record.updateAttributes(blogs[record.id])
  }))
}

/**
 * Create new ranking data for given blogs
 *
 * @param blogs
 * @param total
 * @return {Promise<Array>}
 * @private
 */
async function _insertData(blogs, total) {
  blogs = blogs.map(blog => {
    return {
      isValid: 1,
      categoryId: blog.categoryId,
      blogId: blog.id,
      total: total,
      categoryTotal: blog.catTotal,
      rank: blog.rank,
      prevRank: blog.prevRank || 0,
      categoryRank: blog.catRank,
      categoryPrevRank: blog.catPrevRank || 0,
    }
  })

  return !blogs.length ? [] : await blogRankingModel.create(blogs)
}

/**
 * Get date condition: 1 day, 7 days, 30 days 
 * @param {Number} days
 * @returns {Object}
 * @private
 */
function _dateCondition(days) {
  const today = format(new Date(), 'YYYY-MM-DD 23:59:59')
  const oldDay = format(timeUtils.addDays(-days, today), 'YYYY-MM-DD 00:00:00')
  
  return {
    from: timeUtils.utcDate(new Date(oldDay)),
    to: timeUtils.utcDate(new Date(today)),
  }
}

module.exports = {
  countPostAccess,
  countPostAccessDaily,
  countPostAccessWeekly,
  countPostAccessMonthly,
  ranking,
}
