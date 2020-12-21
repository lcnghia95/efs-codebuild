const app = require('@server/server')
const rss = require('./rss')

const BLOG_LIMIT = 5
const BLOG_URL = process.env.BLOG_URL

// Models
const postModel = app.models.Posts
const blogModel = app.models.Blogs
const feedModel = app.models.Feeds

// Utils
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = app.utils.object
const stringUtil = app.utils.string
const timeUtil = app.utils.time

/**
 * Get all blog (articles) data for given user
 * Notice: this function will get data from posts table (not blogs table)
 *
 * @param {number} userId
 * @param {object} input
 * @param {number} type : 1-full, 0-shorten
 * @returns {Promise<array>}
 */
async function gogoBlog(userId, input, type) {
  const page = input.page || 1
  const limit = type ? 0 : BLOG_LIMIT

  const fields = type
    ? {id: true, blogId: true, title: true, content: true, publishedAt: true, slug: true}
    : {id: true, blogId: true, title: true, publishedAt: true, slug: true}

    // Get all blogs of given user, then get all articles based on blog id
  let blogs = await blogModel.find({
    where: {
      isValid: 1,
      isDraft: 0,
      userId,
    },
    fields: {id: true, slug: true, categoryId: true},
    limit: 0,
  })

  const posts = await _getPosts(blogs, fields, page, limit)

  blogs = arrayUtil.index(blogs)
  return posts.map(post => _blogObject(post, blogs[post.blogId] || {}))
}

/**
 * Get rss feeds of given user
 * Feed url will be get from feeds table
 *
 * @param {number} userId
 * @param {number} type : 1-full, 0-shorten
 * @returns {Promise<array>}
 */
async function newRssFeeds(userId, type) {
  const data = await _getRssFeedsByUserId(userId)

  return data.reduce((arr, feed) => {
    if (!feed) {
      return arr
    }
    arr.push(objectUtil.nullFilter({
      publishedDate: timeUtil.toUnix(feed.pubdate),
      isExternal: true,
      detailUrl: feed.link,
      title: feed.title,
      content: type
        ? stringUtil.stringShorten(stringUtil.stripTags(feed.description || ''), 250)
        : null,
    }))
    return arr
  }, [])
}

/**
 * Get rss feeds of given id
 * Firstly, we get rss url of that user
 * Then we fetch rss from these urls
 *
 * @param userId: number
 * @return {Promise<array>}
 * @private
 */
async function _getRssFeedsByUserId(userId) {
  const feeds = await feedModel.find({
    where: {
      userId: userId,
      feedUrl: {neq: ''},
    },
    fields: {feedUrl: true},
  })
  const data = await Promise.all(feeds.map(async feed => {
    try {
      return await rss.feedRss(feed.feedUrl)
    } catch (e) {
      return null
    }
  }))

  // TODO - Hung: investigate why Feedparser library return [[...]]
  return data[0] || []
}

/**
 * Check if given user has written blog on blog.gogojungle.co.jp
 *
 * @param {Number} userId
 * @return {Promise<boolean>}
 * @private
 */
async function hasGogoBlog(userId) {
  const blogs = await blogModel.find({
    include: {
      relation: 'posts',
      scope: {
        where: {
          isValid: 1,
          isDraft: 0,
        },
        fields: {id: true},
      },
    },
    where: {
      isValid: 1,
      isDraft: 0,
      userId,
    },
    fields: {id: true},
    limit: 0,
  })

  return !!(blogs.find(blog => blog.posts().length))
}

/**
 * Check if given user has written blog on external resources (rss)
 *
 * @param userId
 * @return {Promise<boolean>}
 * @private
 */
async function hasRssBlog(userId) {
  const data = await _getRssFeedsByUserId(userId)

  return !!(data.find(feed => feed))
}

/**
 * Get posts of each blogs
 *
 * @param {Object} blogs
 * @param {String} fields
 * @param {Number} page
 * @param {Number} limit
 * @return {Array}
 * @private
 */
async function _getPosts(blogs, fields, page, limit) {
  return await postModel.find({
    where: {
      isValid: 1,
      isDraft: 0,
      blogId: {inq: arrayUtil.column(blogs, 'id')},
    },
    fields,
    skip: (page - 1) * limit,
    limit,
    order: 'publishedAt DESC',
  })
}

/**
 * User profile blog object
 *
 * @param {Object} blogList
 * @param {Object} blog
 * @return {Object}
 * @private
 */
function _blogObject(article, blog) {
  return objectUtil.filter({
    publishedDate: article.publishedAt,
    title: article.title,
    content: stringUtil.stringShorten(stringUtil.stripTags(article.content|| ''), 250),
    detailUrl: _blogUrl(article, blog),
    categoryId: blog.categoryId,
  })
}

function _blogUrl(article, blog) {
  return  BLOG_URL + blog.slug + '/' + article.slug
}

module.exports = {
  gogoBlog,
  newRssFeeds,
  hasGogoBlog,
  hasRssBlog,
}
