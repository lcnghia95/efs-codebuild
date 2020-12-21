const app = require('@server/server')
const getDate = require('date-fns/get_date')
const format = require('date-fns/format')
const lastDayOfMonth = require('date-fns/last_day_of_month')
const blogModel = app.models.Blogs
const postModel = app.models.Posts
const commentModel = app.models.Comments
const userModel = app.models.Users
const userBlockModel = app.models.UserBlock
const userSelfIntroModel = app.models.UserSelfIntroduction

// Utils
const model = require('@@server/utils/model')
const stringUtils = require('@ggj/utils/utils/string')
const arrayUtils = require('@ggj/utils/utils/array')
const objectUtil = require('@ggj/utils/utils/object')
const queryUtil = require('@ggj/utils/utils/query')
const timeUtil = require('@ggj/utils/utils/time')

/**
 * Get blogs data for index page
 *
 * @param input
 * @param meta
 * @returns {Promise<Object>}
 * @public
 */
async function index(input, meta) {
  const userId = meta.userId
  const [blogs, lastComment] = await Promise.all([
    blogModel.find({
      include: [
        {
          posts: ['comments', 'postAccess'],
        },
      ],
      where: {
        userId: userId,
      },
      order: 'createdAt DESC',
      fields: {content: false},
    }),
    _lastComment(userId),
  ])

  if (!blogs.length) {
    return {}
  }

  const ranking = arrayUtils.index(await _ranking(blogs.map(blog => blog.id)), 'id')
  const res = []    
  
  for(let i = 0; i < blogs.length; i++) {
    const blog = blogs[i]
    const posts = await blog.posts.find()
    let totalComment = 0
    if(posts.length) {
      for(let j = 0; j < posts.length; j++) {
        const post = posts[j]
        const commentCount = await post.comments.count()
        totalComment += commentCount
      }
    }
    res.push({
      id: blog.id,
      title: blog.title,
      publishedDate: blog.createdAt,
      category: blog.categoryId,
      totalArticle: posts.length,
      totalComment: totalComment,
      slug: blog.slug,
      ranking: ranking[blog.id] ? ranking[blog.id] : {},
    })
  }

  return {
    blogs: res,
    lastComment,
  }
}

/**
 *  Get last comment of current user's blog
 *
 * @param userId
 * @returns {Promise<Object>}
 * @private
 */
async function _lastComment(userId) {
  const data = await postModel.find({
    include: [
      {
        relation: 'blogs',
        scope: {
          where: {
            userId,
          },
          fields: {id: true, slug: true},
        },
      },
    ],
    fields: {id: true, blogId: true, title: true, slug: true},
  })

  let posts = data.reduce((arr, post) => {
    if (post.blogs()) {
      arr.push(post)
    }
    return arr
  }, [])

  const postIds = arrayUtils.column(posts, 'id')
  const comment = await commentModel.findOne({
    where: {
      postId: {inq: postIds},
    },
    order: 'createdAt DESC',
  })

  const user = !comment ? {} : await userModel.findOne({
    where: {
      id: comment.userId,
    },
  })

  posts = arrayUtils.index(posts, 'id')

  return !comment || !user ? {} : {
    id: comment.id,
    userId: user.id,
    userName: user.nickName,
    postId: posts[comment.postId].id,
    postTitle: posts[comment.postId].title,
    postSlug: posts[comment.postId].slug,
    blog: posts[comment.postId].blogs(),
    publishedDate: comment.createdAt,
    content: comment.content,
  }
}

/**
 * Get ranking for given blogs
 *
 * @param {Array} blogIds
 * @returns {Promise<Object>}
 * @private
 */
async function _ranking(blogIds) {
  const sql =
    'Select a.id, b.totalView, b.rank, c.totalBlogs\n' +
    'From blogs a, \n' +
    '  (\n' +
    '    Select count(c.id) As totalView, a.id, @curRank := @curRank + 1 As rank\n' +
    '    From blogs a \n' +
    '      Left Join posts b On a.id = b.blog_id\n' +
    '      Left Join post_access c On b.id = c.post_id,\n' +
    '      (SELECT @curRank := 0) As r  \n' +
    '    Group by a.id \n' +
    '    Order by count(c.id) DESC\n' +
    '    Limit 20\n' +
    '  ) b,\n' +
    '  (\n' +
    '    Select count(*) As totalBlogs\n' +
    '    From blogs\n' +
    '  ) As c\n' +
    'Where a.id In (?) And a.id = b.id'

  return await model.excuteQuery('blog', sql, [blogIds])
}

/**
 * Get surface detail data of given blog
 *
 * @param slug
 * @param input
 * @returns {Promise<Object>}
 */
async function show(slug, input, meta) {
  if (!slug) {
    return {}
  }
  // Encode uri for slug because slug was stored by uri encode in db
  slug = encodeURIComponent(slug)

  const blog = await blogModel.findOne({
    where: {
      slug,
      isValid: 1,
    },
    fields: {content: false},
  })

  if (!blog) {
    return {}
  }

  const [userData, monthlyArchiveData, lastArticlesData, block] = await Promise.all([
    user(slug, input, blog),
    monthlyArchive(slug, input),
    lastArticles(slug, input),
    !meta.userId ? null : userBlockModel.findOne({
      where: {
        userId: blog.userId,
        blockedUserId: meta.userId,
      },
    }),
  ])

  return {
    id: blog.id,
    title: blog.title,
    blogDescription: blog.description,
    isBlock: !block ? 0 : 1,
    user: userData,
    monthlyArchive: monthlyArchiveData,
    lastArticles: lastArticlesData,
  }
}

/**
 * Store new blog
 *
 * @param input
 * @param meta
 * @returns {Promise<Object>}
 */
async function store(input, meta) {
  const userId = meta.userId || 0

  return !userId ? {} : await blogModel.create({
    isValid: 1,
    isDraft: input.isDraft || 0,
    userId: userId,
    categoryId: input.category,
    title: input.title,
    description: input.description,
    slug: encodeURIComponent(input.slug),
  })
}

/**
 * Validate blog data (title)
 * -> Unique title
 *
 * @param input
 * @returns {Promise<{title: boolean}>}
 */
async function validate(input) {
  if (!input.title && !input.slug) {
    return {title: false, slug: false}
  }

  const [isTitleExist, isSlugExist] = await Promise.all([
    !input.title ? null : blogModel.findOne({
      where: {
        title: input.title,
      },
      fields: {id: true},
    }),
    !input.slug ? null : blogModel.findOne({
      where: {
        slug: input.slug,
      },
      fields: {id: true},
    }),
  ])

  return {
    title: !isTitleExist,
    slug: !isSlugExist,
  }
}

/**
 * Destroy a blog
 *
 * @param id
 * @param meta
 * @returns {Promise<Object>}
 */
async function destroy(id, meta) {
  const blog = await blogModel.findOne({
    where: {
      id: id,
      userId: meta.userId || 0,
    },
  })

  return !blog ? {} : await blogModel.destroyById(id)
}

/**
 * Get user information
 *
 * @param slug
 * @param input
 * @param blog
 * @returns {Promise<Object>}
 */
async function user(slug, input, blog = null) {
  if (!slug) {
    return {}
  }
  // Encode uri for slug because slug was stored by uri encode in db
  slug = encodeURIComponent(slug)

  blog = blog ? blog : await blogModel.findOne({
    where: {
      slug,
      isValid: 1,
    },
    fields: {userId: true},
  })

  if (!blog || !blog.userId) {
    return {}
  }

  const [user, selfIntroduction] = await Promise.all([
    userModel.findOne({
      where: {
        id: blog.userId,
      },
      fields: queryUtil.fields('id,nickName'),
    }),
    userSelfIntroModel.findOne({
      where: {
        isValid: 1,
        userId: blog.userId,
      },
      fields: queryUtil.fields('id,content'),
    }),
  ])

  return !user ? {} : {
    id: user.id,
    name: user.nickName,
    selfIntroduction: selfIntroduction
      ? stringUtils.stripTags(selfIntroduction.content || '')
      : '',
  }
}

/**
 * Get calendar data in given time (get one month)
 * Default time is current time
 * Return array of date that have post
 * E.g. [1,5,23,29]
 *
 * @param id
 * @param input
 * @returns {Promise<Number[]>}
 */
async function calendar(id, input) {
  if (!id) {
    return []
  }

  // Get start and end range
  // Start is first date of month and End is last date of month
  const start = format(input.time || new Date(), 'YYYY-MM-01 00:00:00')
  const end = format(lastDayOfMonth(start), 'YYYY-MM-DD 23:59:59')
  const posts = await postModel.find({
    where: {
      isValid: 1,
      isDraft: 0,
      blogId: id,
      and: [
        {
          createdAt: {gte: timeUtil.utcDate(new Date(start))},
        },
        {
          createdAt: {lte: timeUtil.utcDate(new Date(end))},
        },
      ],
    },
    fields: {id: true, createdAt: true},
  })

  return posts.reduce((arr, post) => {
    const date = getDate(post.createdAt * 1000)
    if (!arr.includes(date)) {
      arr.push(date)
    }
    return arr
  }, [])
}

/**
 * Get all monthly archive data
 * E.g.
 * [
 *    {
 *      month: 1544091352173,
 *      dates: [1, 3, 25, 30]
 *    },
 *    {
 *      month: 1544091352173,
 *      dates: [1, 2, 20],
 *    }
 * ]
 *
 * @param slug
 * @returns {Promise<Object>}
 */
async function monthlyArchive(slug) {
  // Get all posts that was published
  const blog = await blogModel.findOne({
    include: [
      {
        relation: 'posts',
        scope: {
          where: {
            isValid: 1,
            isDraft: 0,
            and: [
              {
                publishedAt: {gt: 0},
              },
              {
                publishedAt: {lte: Date.now()},
              },
            ],
          },
          fields: {id: true, publishedAt: true, slug: true},
          sort: 'publishedAt DESC',
        },
      },
    ],
    where: {
      slug,
    },
  })
  const posts = !blog ? [] : blog.posts()

  const monthlyArchive = posts.reduce((obj, post) => {
    const createdDate = post.publishedAt * 1000
    const date = getDate(createdDate)
    const key = format(createdDate, 'YYYY-MM')

    if (!obj[key]) {
      obj[key] = []
    }
    const i = obj[key].findIndex(el => el.date === date)
    i === -1
      ? obj[key].push({date: date, num: 1})
      : obj[key][i]['num']++
    return obj
  }, {})

  return Object.keys(monthlyArchive).map(key => {
    return {
      month: key,
      dates: monthlyArchive[key],
    }
  })
}

/**
 * Get last articles of given blog
 *
 * @param slug
 * @param input
 * @returns {Promise<Object[]>}
 */
async function lastArticles(slug, input) {
  // Get all posts that was published
  const blog = await blogModel.findOne({
    include: [
      {
        relation: 'posts',
        scope: {
          where: {
            isValid: 1,
            isDraft: 0,
            and: [
              {
                publishedAt: {neq: null},
              },
              {
                publishedAt: {lte: timeUtil.utcDate()},
              },
            ],
          },
          fields: {id: true, title: true, publishedAt: true, slug: true},
          limit: input.limit || 5,
          order: 'publishedAt DESC',
        },
      },
    ],
    where: {
      slug,
      isValid: 1,
    },
  })
  const posts = !blog ? [] : blog.posts()

  return posts.map(article => {
    return {
      id: article.id,
      title: article.title,
      publishedDate: article.publishedAt,
      slug: article.slug,
    }
  })
}

/**
 * Get blog title information
 *
 * @param id
 * @param input
 * @returns {Promise<Object>}
 */
async function getBlogEditIndex(meta) {
  const userId = meta.userId || 0

  if(! userId) {
    return {}
  }

  const data = await blogModel.find({
    include: {
      relation: 'posts',
      scope: {
        limit: 1,
        order: 'publishedAt DESC',
        fields: {id: true, slug: true},
      },
    },
    where: {
      isValid: 1,
      userId: userId,
    },
    fields: {id: true, title: true, categoryId: true, description: true, slug: true},
  })

  if (!data || data.length === 0) {
    return []
  }

  return data.map(blog => {
    const post = blog.posts()
    return {
      id: blog.id,
      title: blog.title || '',
      category: blog.categoryId || 0,
      description: blog.description || '',
      slug: blog.slug,
      lastPost: !post.length ? {} : post.pop(),
    }
  })

}

/**
 * Update blog
 *
 * @param id
 * @param input
 * @returns {Promise<Object>}
 */
async function update(id, input, meta) {
  const userId = meta.userId
  const data =  objectUtil.nullFilter({
    title: input.title || null,
    categoryId: input.category || null,
    description: input.description || null,
  })
  
  if (!userId || !Object.keys(data).length) {
    return {}
  }

  return !id ? {} : await blogModel.updateAll(
    {
      userId: userId,
      id : id,
    },
    data,
  )
}

/**
 * Get blog list of current user
 *
 * @param meta
 * @returns {Promise<Array>}
 */
async function blogList(meta) {
  return await blogModel.find({
    where: objectUtil.nullFilter({
      userId: meta.userId,
    }),
    fields: {id: true, title: true, slug: true},
  })
}

module.exports = {
  index,
  show,
  store,
  destroy,
  validate,
  user,
  calendar,
  monthlyArchive,
  lastArticles,
  getBlogEditIndex,
  update,
  blogList,
}
