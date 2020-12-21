const app = require('@server/server')
const postModel = app.models.Posts
const blogModel = app.models.Blogs
const blogRankingModel = app.models.BlogRanking
const userModel = app.models.Users

// Utils
const arrayUtils = require('@ggj/utils/utils/array')
const objectUtils = require('@ggj/utils/utils/object')
const pagingUtils = require('@ggj/utils/utils/paging')
const stringUtils = require('@ggj/utils/utils/string')
const timeUtils = require('@ggj/utils/utils/time')

/**
 * Get total ranking of all blogs
 *
 * @param input
 * @returns {Promise<Object>}
 */
async function ranking(input) {
  const page = input.page || 1
  const limit = input.limit || 20
  const isGetImage = parseInt(input.isGetImage || 0)
  const categoryId = parseInt(input.categoryId)
  const pagingInfo = pagingUtils.getOffsetCondition(page, limit)
  const where = objectUtils.deepFilter({
    isValid: 1,
    categoryId: categoryId ? categoryId : null,
  })
  const [total, rankData] = await Promise.all([
    blogRankingModel.count(where),
    blogRankingModel.find({
      include: {
        relation: 'blogs',
        scope: {
          include: [
            isGetImage ? {
              relation: 'StyleBackgroundHeader',
              scope: {
                isValid: 1,
              },
            } : {},
          ],
        },
      },
      where,
      fields: {id: true, blogId: true, rank: true, prevRank: true},
      order: 'rank ASC',
      skip: pagingInfo.skip,
      limit: pagingInfo.limit,
    }),
  ])

  // Get rank data by paging info and then get blog data base on it
  const res = await _rankingTotalObject(rankData, isGetImage)

  return pagingUtils.addPagingInformation(res, page, total, limit)
}

/**
 * Convert given ranking data into response object
 *
 * @param rankData
 * @param isGetImage
 * @returns {Promise<Array>}
 * @private
 */
async function _rankingTotalObject(rankData, isGetImage = 0) {
  const blogs = rankData.reduce((arr, record) => {
    const blog = record.blogs()
    if (blog) {
      arr.push(blog)
    }
    return arr
  }, [])
  const userIds = arrayUtils.column(blogs, 'userId')
  const blogIds = arrayUtils.column(blogs, 'id')

  let [postsGroup, users] = await Promise.all([
    postModel.find({
      include: {
        relation: 'postTags',
        scope: {
          include: 'tags',
        },
      },
      where: {
        blogId: {inq: blogIds},
        isDraft: 0,
      },
      fields: {id: true, blogId: true},
    }),
    userModel.find({
      where: {
        isValid: 1,
        id: {inq: userIds},
      },
      fields: {id: true, nickName: true},
    }),
  ])

  postsGroup = arrayUtils.groupArray(postsGroup, 'blogId')
  users = arrayUtils.index(users)

  return rankData.reduce((arr, record) => {
    const blog = record.blogs()
    if (!blog) {
      return arr
    }

    const user = !blog ? {} : users[blog.userId] || {}
    const posts = postsGroup[blog.id] || []
    const backgroundHeader = isGetImage
      ? blog.StyleBackgroundHeader()
      : {}
    const tags = posts.reduce((arr, post) => {
      const postTags = post.postTags()
      if (postTags) {
        postTags.forEach(postTag => {
          const tag = postTag.tags()

          tag && arr.push(tag)
        })
      }
      return arr
    }, [])

    if (blog && user) {
      arr.push(objectUtils.nullFilter({
        id: record.blogId,
        title: blog.title,
        rank: record.rank,
        status: record.rank < record.prevRank
          ? 1 : (record.rank === record.prevRank ? 2 : 3),
        user: {
          id: user.id,
          name: user.nickName,
        },
        imageId: isGetImage
          ? (backgroundHeader ? backgroundHeader.imageId || 0 : 0)
          : null,
        tags: tags.slice(0, 8), // Get maximum 8 tags
        slug: blog.slug,
      }))
    }

    return arr
  }, [])
}

/**
 * Ranking new blog
 *
 * @param input
 * @return {Promise<{object}>}
 */
async function rankingRecentBlog(input) {
  const page = input.page || 1
  const limit = input.limit || 20
  const pagingInfo = pagingUtils.getOffsetCondition(page, limit)
  const where = objectUtils.deepFilter({
    isValid: 1,
    categoryId: input.categoryId ? parseInt(input.categoryId) : null,
  })

  let [total, rankData] = await Promise.all([
    blogModel.count(where),
    blogModel.find({
      where,
      order: 'createdAt DESC',
      fields: {content: false},
      skip: pagingInfo.skip,
      limit: pagingInfo.limit,
    }),
  ])

  rankData = rankData.map(record => {
    return {
      id: record.id,
      title: record.title,
      userId: record.userId,
      createdDate: record.createdAt,
      slug: record.slug,
      isNew: (Date.now() / 1000) - record.createdAt > 259200 ? 0 : 1, // 3 Days - 3 * 24 * 60 * 60
    }
  })
  return pagingUtils.addPagingInformation(rankData, page, total, limit)
}

/**
 * Get ranking total of given blog
 *
 * @param id
 * @return {Promise<object>}
 */
async function rankingTotalById(id) {
  const rank = await blogRankingModel.findOne({
    where: {
      blogId: id,
    },
  })

  return !rank ? {} : {
    rank: rank.rank,
    total: rank.total,
  }
}

/**
 * Get ranking by category of given blog
 *
 * @param id
 * @return {Promise<object>}
 */
async function rankingCategoryById(id) {
  const blogRanking = await blogRankingModel.findOne({
    include: {
      relation: 'blogs',
      scope: {
        fields: { id: true, categoryId: true },
      },
    },
    where: {
      blogId: id,
    },
  })

  if (!blogRanking) {
    return null
  }

  const blog = blogRanking.blogs()
  return !blogRanking ? null : {
    blogId: blogRanking.blogId,
    total: blogRanking.categoryTotal,
    rank: blogRanking.categoryRank,
    id: blog.categoryId || 0,
  }
}

/**
 * Get recommend articles base on access count
 * Access count descending
 * Only get articles in given category (from input) or all categories
 *
 * @param {object} input
 * @returns {Promise<Object>} : paging object
 */
async function rankingRecommendArticles(input) {
  const page = input.page || 1
  const limit = input.limit || 20
  const category =  parseInt(input.categoryId) || null
  const skip = (page - 1) * limit
  const blogs = await blogModel.find({
    where: objectUtils.nullFilter({
      categoryId: category,
    }),
    fields: {id: true},
  })
  const blogIds = arrayUtils.column(blogs)
  const where = {
    blogId: {inq: blogIds},
    isDraft: 0,
  }
  const [total, posts] = await Promise.all([
    postModel.count(where),
    postModel.find({
      include: {
        relation: 'blogs',
        scope: {
          fields: {id: true, userId: true, slug: true},
        },
      },
      where,
      order: ['accessCount DESC', 'id DESC'],
      skip,
      limit,
    }),
  ])
  const filteredBlogs = posts.reduce((res, post) => {
    const blog = post.blogs()
    if (blog) {
      res.push(blog)
    }
    return res
  }, [])

  const users = arrayUtils.index(await userModel.find({
    where: {
      id: {inq: arrayUtils.column(filteredBlogs, 'userId')},
    },
    fields: {id: true, nickName: true},
  }))

  const res = _rankingArticleObjects(posts, users)

  return pagingUtils.addPagingInformation(res, page, total, limit)
}

/**
 * Get ranking articles based on created time
 * Only get articles in given category (from input) or all categories
 *
 * @param {object} input
 * @returns {Promise<object>}
 */
async function rankingRecentArticles(input) {
  const page = input.page || 1
  const limit = input.limit || 20
  const category =  parseInt(input.categoryId) || null
  const skip = (page - 1) * limit

  // Get all blogs in given category
  const blogs = await blogModel.find({
    where: objectUtils.nullFilter({
      categoryId: category,
    }),
    fields: {id: true},
  })
  
  const blogIds = arrayUtils.column(blogs)
  const where = {
    blogId: {inq: blogIds},
    isDraft: 0,
  }

  // Get all post of current page in given category
  // (Use blogId for determine category)
  const [total, posts] = await Promise.all([
    postModel.count(where),
    postModel.find({
      include: {
        relation: 'blogs',
        scope: {
          fields: {id: true, userId: true, slug: true},
        },
      },
      where,
      order: ['publishedAt DESC', 'accessCount DESC'],
      skip,
      limit,
    }),
  ])

  // Get blogs list from each post
  const filteredBlogs = posts.reduce((res, post) => {
    const blog = post.blogs()
    if (blog) {
      res.push(blog)
    }
    return res
  }, [])

  // Get user for all blogs in blog list above
  const users = arrayUtils.index(await userModel.find({
    where: {
      id: {inq: arrayUtils.column(filteredBlogs, 'userId')},
    },
    fields: {id: true, nickName: true},
  }))

  // Mapping response data
  const res = _rankingArticleObjects(posts, users)

  return pagingUtils.addPagingInformation(res, page, total, limit)
}

/**
 *
 * @param posts
 * @param users
 * @returns {*}
 * @private
 */
function _rankingArticleObjects(posts, users) {
  return posts.reduce((res, post) => {
    const blog = post.blogs()

    if (!blog) {
      return res
    }

    const user = users[blog.userId]
    res.push({
      id: post.id,
      title: post.title,
      content: stringUtils.stripTagsAndStyle(post.content).substr(0, 120),
      slug: post.slug,
      publishedAt: post.publishedAt,
      imageNumber: post.imageNumbers ? post.imageNumbers.split(',')[0] : 0,
      headImageUrl: post.headImageUrl ? post.headImageUrl.replace(/http:\/\//g, 'https://') : '',
      blogId: blog.id,
      blogSlug: blog.slug,
      user: !user ? {} : {
        id: user.id,
        name: user.nickName,  
      },
    })
    return res
  }, [])
}

/**
 * Get ranked blog articles by date, week, month, all times
 */
async function rankingArticle(input) {
  const limit = input.limit || 10
  const blogs = await blogModel.find({
    where: objectUtils.nullFilter({
      categoryId: input.category || null,
    }),
    fields: {id: true},
  })
  const blogIds = arrayUtils.column(blogs)
  const [access1Days, access7Days, access30Days, accessTotal] = await Promise.all(
  [
    _getArticles(limit, ['accessCountDaily DESC',
      'publishedAt DESC',
    ], blogIds),
    _getArticles(limit, ['accessCountWeekly DESC',
      'publishedAt DESC',
    ], blogIds),
    _getArticles(limit, ['accessCountMonthly DESC',
      'publishedAt DESC',
    ], blogIds),
    _getArticles(limit, ['accessCount DESC',
      'publishedAt DESC',
    ], blogIds),
  ])
    
  return [access1Days, access7Days, access30Days, accessTotal]
}

/**
 * Get (1 day, 7 days, 30 days, ...) articles sort by number of access
 * @param {Number} limit
 * @param {Number} period
 * @returns {Promise<Object>}
 * @private 
 */
async function _getArticles(limit, sort, blogIds) {
  const posts = await postModel.find({
    include: {
      relation: 'blogs',
      scope: {
        fields: {id: true, userId: true, slug: true},
      },
    },
    where: {
      isValid: 1,
      publishedAt: {
        lte: timeUtils.utcDate(),
      },
      blogId: {inq: blogIds},
      isDraft: 0,
    },
    limit: limit,
    order: sort,
  })

  // Get blogs list from each post
  const filteredBlogs = posts.reduce((res, post) => {
    const blog = post.blogs()
    if (blog) {
      res.push(blog)
    }
    return res
  }, [])

  // Get user for all blogs in blog list above
  const users = arrayUtils.index(await userModel.find({
    where: {
      id: {
        inq: arrayUtils.column(filteredBlogs, 'userId'),
      },
    },
    fields: {id: true, nickName: true},
  }))
  
  // Mapping response data
  return _rankingArticleObjects(posts, users)
}

module.exports = {
  ranking,
  rankingRecentBlog,
  rankingTotalById,
  rankingCategoryById,
  rankingRecommendArticles,
  rankingRecentArticles,
  rankingArticle,
}
