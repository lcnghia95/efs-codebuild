const app = require('@server/server')

// models
const tagModel = app.models.BlogTags
const postTagModel = app.models.PostTags
const postModel = app.models.Posts
const blogModel = app.models.Blogs

// Utils
const pagingUtils = require('@ggj/utils/utils/paging')
const arrayUtils = require('@ggj/utils/utils/array')
const stringUtils = require('@ggj/utils/utils/string')

async function searchTags() {
  const tags = await tagModel.find({
    fields: {id: true, name: true, priority: true},
    order: 'priority ASC',
    limit: 2000, // TODO handler for many tags,
  })
  return tags.map(tag => tag.name)
}

/**
 * Get all tags for given blog
 * @param {<Number>} blogId
 * @param {<Object>} input
 * @return {Promise<array>}
 * @public
 */
async function searchTagsByBlog(blogId, input) {
  const id = blogId || 0
  const limit = input.limit || 0
  const blog = await blogModel.findOne({
    include: [
      {
        relation: 'posts',
        scope: {
          include: [
            {
              relation: 'postTags',
              scope: {
                fields: {
                  tagId: true,
                },
              },
            },
          ],
        },
      },
    ],
    where: {
      id: id,
      isValid: 1,
    },
    fields: {
      id: true,
    },
  })

  if(!blog) {
    return []
  }

  const tagIds = _getTagIds(blog)
  const res = await tagModel.find({
    where: {
      id: {
        inq: Object.keys(tagIds),
      },
    },
    order: 'priority ASC',
    fields: {
      id: true,
      name: true,
    },
    limit: limit,
  }).map(tag => {
    return {
      id: tag.id,
      name: tag.name,
      frequency: tagIds[tag.id],
    }
  })

  // return res.length ? res.sort((a, b) => b.frequency - a.frequency) : []
  return res.length ? res.sort((a, b) => {
    if (a.name < b.name) { return -1 }
    if (a.name > b.name) { return 1 }
    return 0
  }) : []
}

/**
 * Search all posts based on given blog and tag name
 * NOTE: has paging information
 *
 * @param blogSlug
 * @param tagName
 * @param input
 * @returns {Promise<object>}
 */
async function searchPostsByTagName(blogSlug, tagName, input) {
  const [posts, tag]= await Promise.all([
    _getPostsByBlogSlug(blogSlug),
    _getTagByName(tagName),
  ])

  if (!posts.length || !tag) {
    return []
  }

  const page = input.page || 1
  const limit = 20
  const skip = pagingUtils.getOffsetCondition(page, limit).skip
  const postIds = arrayUtils.column(posts, 'id', true)
  const postTags = await _getPostTagsByPostIdsAndTagId(postIds, tag.id)
  const filterPostIds = arrayUtils.column(postTags, 'postId', true)

  let result = await _getPostsByIds(filterPostIds, { limit, skip })

  result = result.map(post => {
    const tags = post.postTags().map(postTag => postTag.tags())
    return {
      id: post.id,
      title: post.title,
      content: stringUtils.stripTagsAndStyle(post.content || '').substr(0, 200),
      slug: post.slug,
      tags: tags,
      totalComment: post.comments().length,
      publishedDate: post.publishedAt,
    }
  })

  return pagingUtils.addPagingInformation(result, page, result.length, limit)
}

/**
 * Get posts based on blog slug
 *
 * @param slug
 * @returns {Promise<array>}
 * @private
 */
async function _getPostsByBlogSlug(slug) {
  const blog = await blogModel.findOne({
    include: {
      relation: 'posts',
      scope: {
        fields: {
          id: true,
        },
      },
    },
    where: {
      slug: encodeURIComponent(slug),
      isValid: 1,
      isDraft: 0,
    },
    fields: {
      id: true,
    },
  })

  return blog ? blog.posts() : []
}

/**
 *
 * @param tagName
 * @returns {Promise<Object>}
 * @private
 */
async function _getTagByName(tagName) {
  return await tagModel.findOne({
    where: {
      name: tagName,
    },
  })
}

/**
 * Get post tags list based on given posts and tag id
 *
 * @param postIds
 * @param tagId
 * @returns {Promise<*>}
 * @private
 */
async function _getPostTagsByPostIdsAndTagId(postIds, tagId) {
  return await postTagModel.find({
    where: {
      tagId: tagId,
      postId: { inq: postIds },
    },
    fields: {
      postId: true,
    },
  })
}

/**
 * Get posts by given ids
 *
 * @param postIds
 * @param paging
 * @returns {Promise<*>}
 * @private
 */
async function _getPostsByIds(postIds, paging) {
  return await postModel.find({
    include: [
      {
        relation: 'comments',
        scope: {
          fields: {
            id: true,
          },
        },
      },
      {
        relation: 'postTags',
        scope: {
          include: {
            relation: 'tags',
            scope: {
              fields: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    ],
    where: {
      id: { inq: postIds },
      isValid: 1,
      isDraft: 0,
    },
    order: 'publishedAt DESC',
    skip: paging.skip,
    limit: paging.limit,
  })
}

/**
 * Add new tags for given post
 *
 * @param id
 * @param tags
 * @returns {Promise<Array>}
 */
async function addPostTags(id, tags) {
  if (!id || !tags || !tags.length) {
    return []
  }

  const tagList = await _addTags(tags)
  const postTags = tagList.map(tag => {
    return {
      isValid: 1,
      postId: id,
      tagId: tag.id,
    }
  })

  return await postTagModel.create(postTags)
}

/**
 * Add tags for given post using given tag id list
 *
 * @param id
 * @param tagIds
 * @returns {Promise<void>}
 */
async function addPostTagsById(id, tagIds) {
  const postTags = tagIds.map(tagId => {
    return {
      isValid: 1,
      postId: id,
      tagId: tagId,
    }
  })

  return await postTagModel.create(postTags)
}

/**
 * Update tags of given post
 *
 * @param id
 * @param tags
 * @returns {Promise<Array>}
 */
async function updatePostTags(id, tags) {
  if (!id || !tags) {
    return []
  }

  // Get new data & remove old tags
  const tagList = !tags.length ? [] : await _addTags(tags)
  await _destroyOldTags(id, tagList)

  return await Promise.all(tagList.map(async tag => {
    return await postTagModel.upsertWithWhere({
      isValid: {inq: [0, 1]},
      postId: id,
      tagId: tag.id,
    }, {
      isValid: 1,
      postId: id,
      tagId: tag.id,
    })
  }))
}

async function removeTag(blogId, tagId, meta) {
  let tags = await postTagModel.find({
    include: {
      relation: 'posts',
      scope: {
        include: {
          relation: 'blogs',
          scope: {
            where: {
              id: blogId,
              userId: meta.userId,
            },
            fields: {
              id: true,
            },
          },
        },
      },
    },
    where: {
      tagId: tagId,
    },
  })

  tags = tags.filter(tag => {
    const post = tag.posts()

    return !!(post && post.blogs())
  })

  return tags.length ? await postTagModel.destroyAll({
    id: { inq: arrayUtils.column(tags) },
  }) : { count: 0 }
}

/**
 * Remove old tags that not within given tags list
 *
 * @param id
 * @param tags
 * @returns {Promise<void>}
 * @private
 */
async function _destroyOldTags(id, tags) {
  const oldTags = await postTagModel.find({
    where: {
      tagId: {nin: !tags.length ? [0] : tags.map(tag => tag.id)},
      postId: id,
    },
    fields: {id: true},
  })

  return await postTagModel.destroyAll({
    id: {inq: oldTags.map(tag => tag.id)},
  })
}

/**
 * Add new tags into btags table
 *
 * @param tags
 * @returns {Promise<Array>}
 * @private
 */
async function _addTags(tags) {
  return await Promise.all(tags.map(tag => {
    return tagModel.upsertWithWhere(
      {
        isValid: {inq: [0, 1]},
        name: tag,
      },
      {
        isValid: 1,
        name: tag,
        priority: 0,
      })
  }))
}

/**
 * Get all tags for blogs
 * @param {<Object>} blog
 * @return {<Object>}
 * @private
 */
function _getTagIds(blog) {
  const posts = blog.posts()
  return posts.reduce((res, post) => {
    post.postTags().forEach(tag => {
      res[tag.tagId] = res[tag.tagId] ? res[tag.tagId] + 1 : 0
    })
    return res
  }, {})
}

module.exports = {
  searchTags,
  addPostTags,
  addPostTagsById,
  updatePostTags,
  searchTagsByBlog,
  searchPostsByTagName,
  removeTag,
}
