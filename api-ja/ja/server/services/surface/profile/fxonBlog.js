const app = require('@server/server')
const commonUser = require('@services/common/user')
const sprintf = require('sprintf-js').sprintf

const BLOG_LIMIT = 5
const BLOG_URL = process.env.FXON_HOST_URL
const FXON_BLOG = 'fxon_blog'
const FXON_BLOG_LIST = 'fxon_blog_list'

// Utils
const objectUtil = app.utils.object
const timeUtil = app.utils.time
const pagingUtil = app.utils.paging
const stringUtil = app.utils.string
const modelUtils = require('@server/utils/model')

/**
 * Get fxon blogs (articles) of given user
 *
 * @param userId
 * @param input
 * @return {Promise<array>}
 */
async function fxonBlog(userId, input) {
  let type = !input.type ? 0 : 1,
    page = input.page || 1,
    blogList = await _getFxonBlog(userId, 'Id,CategoryId,IsRss,UserId,ModeId')

  if (blogList.length == 0) {
    return []
  }

  let limit = type == 1 ? 0 : BLOG_LIMIT,
    fields = type == 1 ? 'Id,Title,Content,PublishedDate' :
      'Id,Title,PublishedDate',
    res = {}

  for (let i = 0; i < blogList.length; i++) {
    let blogListItem = blogList[i],
      blogs = await _getFxonBlogList(blogList[i], fields, limit, page)
    if (!blogs || blogs.length === 0) {
      continue
    }

    blogs.map(blog => {
      let published = timeUtil.toUnix(blog.PublishedDate)

      if (!res[published]) {
        res[published] = _fxonBlogObject(blog, blogListItem)
      }
    })
  }

  if (Object.keys(res).length === 0) {
    return []
  }

  let data = Object.values(res).sort((a, b) => {
    return b.publishedDate - a.publishedDate
  })

  return type == 1 ? data : (data.length > BLOG_LIMIT ? data.slice(0,
    BLOG_LIMIT) : data)
}

/**
 * Check given user has fxon blogs
 *
 * @param userId
 * @return {Promise<boolean|number>}
 */
async function hasFxonBlog(userId) {
  let blogList = await _getFxonBlog(userId, 'Id,IsRss')

  if (blogList.length == 0) {
    return 0
  }

  for (let i = 0; i < blogList.length; i++) {
    let hasBlog = !!(await modelUtils.findOne(
      FXON_BLOG_LIST,
      `blog_${sprintf('%06d', blogList[i].Id)}`, {
        where: {
          isValid: 1
        }
      }
    ))
    if (hasBlog) {
      return true
    }
  }
  return false
}

/**
 * Get user blog list data
 *
 * @param {Number} userId
 * @param {String} fields
 * @return {Promise<Array>}
 * @private
 */
async function _getFxonBlog(userId, fields) {
  let supOldUId = await commonUser.oldUIdAndModeId(userId),
    oldUIdKeys = Object.keys(supOldUId)

  if (oldUIdKeys.length === 0) {
    return []
  }

  let or = oldUIdKeys.map(
    ModeId => {
      return {
        UserId: supOldUId[ModeId],
        ModeId: ModeId,
      }
    }
  )

  return await modelUtils.find(FXON_BLOG, 'blog_list', {
    where: {
      and: [{
        or
      }, {
        IsValid: 1,
      }]
    },
    fields: app.utils.query.fields(fields),
    order: 'Id DESC'
  })
}

/**
 * Get fx on blog list data
 *
 * @param {Object} blogList
 * @param {String} fields
 * @param {Number} limit
 * @param {Number} page
 * @return {Promise<Array>}
 * @private
 */
async function _getFxonBlogList(blogList, fields, limit, page) {
  let offset = pagingUtil.getOffsetCondition(page, limit)
  return await modelUtils.find(
    FXON_BLOG_LIST,
    `blog_${sprintf('%06d', blogList.Id)}`, objectUtil.nullFilter({
      where: {
        IsValid: 1
      },
      order: 'PublishedDate DESC',
      limit: !limit ? null : offset.limit,
      skip: !limit ? null : offset.skip,
      fields: app.utils.query.fields(fields)
    })
  )
}

/**
 * User profile blog object
 *
 * @param {Object} blogList
 * @param {Object} blog
 * @return {Object}
 * @private
 */
function _fxonBlogObject(blog, blogList) {
  return objectUtil.filter({
    publishedDate: app.utils.time.toUnix(blog.PublishedDate),
    isExternal: blogList.IsRss == 1,
    title: blog.Title,
    content: stringUtil.stripTags(stringUtil.stringShorten(blog.Content ||
      '', 250)),
    detailUrl: _fxonBlogUrl(blogList, blog),
    categoryId: blogList.CategoryId,
  })
}

/**
 * Generate blog url
 *
 * @param {Object} blogList
 * @param {Object} blog
 * @return {String}
 * @private
 */
function _fxonBlogUrl(blogList, blog) {
  if (blogList['IsRss'] == 1) {
    return BLOG_URL + 'ac/blog/?blid=' + blogList['Id'] + '&id=' + blog['Id']
  } else {
    return BLOG_URL + 'blog/detail/?u=' + blogList['UserId'] + '&t=' + blogList['ModeId'] +
      '&blid=' + blogList['Id'] + '&id=' + blog['Id']
  }
}

module.exports = {
  fxonBlog,
  hasFxonBlog,
}
