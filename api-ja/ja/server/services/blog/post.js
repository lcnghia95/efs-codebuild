const app = require('@server/server')
const tagService = require('@server/services/blog/tag')

// Models
const postModel = app.models.Posts
const postAccessModel = app.models.PostAccess
const blogModel = app.models.Blogs
const tagModel = app.models.BlogTags

// Utils
const objectUtils = require('@ggj/utils/utils/object')
const stringUtils = require('@ggj/utils/utils/string')
const pagingUtil = require('@ggj/utils/utils/paging')

/**
 * Get all posts of given blog
 *
 * @param input
 * @returns {Promise<Object>}
 */
async function index(input, meta) {
  if (! meta.userId) {
    return {}
  }
  const blog = await blogModel.findOne({
    include: [
      {
        relation: 'posts',
        scope: {
          include: [
            'comments',
            {
              relation: 'postTags',
              scope: {
                include: 'tags',
              },
            },
          ],
          where: objectUtils.deepFilter({
            and: [
              {
                createdAt: {gte: input.from ? input.from * 1000 : null},
              },
              {
                createdAt: {lte: input.to ? input.to * 1000 : null},
              },
            ],
          }),
        },
      },
    ],
    where: objectUtils.nullFilter({
      id: input.blogId ? input.blogId : await _mostActiveBlog(meta.userId),
      userId: meta.userId,
    }),
    order: 'createdAt DESC',
  })

  return !blog ? {} : await _getAllPosts(input, blog)
}

/**
 * Get most active blog of current user (blog that have most post)
 *
 * @param userId
 * @returns {Promise<Number>}
 * @private
 */
async function _mostActiveBlog(userId) {
  const blogs = await blogModel.find({
    include: [
      {
        relation: 'posts',
        scope: {
          fields: {id: true},
        },
      },
    ],
    where: {
      userId: userId,
    },
    order: 'createdAt DESC',
  })

  if (blogs.length === 0) {
    return null
  }

  const res = blogs.reduce((obj, blog) => {
    const count = blog.posts().length
    if (obj.count < count) {
      obj.count = count
      obj.id = blog.id
    }
    return obj
  }, {id: blogs[0].id, count: 0})

  return res.id
}

/**
 *
 * @param {Object} blog
 * @returns {Promise<Object>}
 * @private
 */
async function _getAllPosts(input, blog) {
  const posts = blog.posts().reduce((acc,post) => {
    post.createdDate = post.publishedAt
    if (post.isDraft) {
      post.createdDate = post.createdAt
    }
    // https://gogojungle.backlog.jp/view/OAM-15032
    // filter by tag id
    if (!input.tagName || _isTagExist(post, input.tagName)) {
      acc.push(post)
    }
    return acc
  }, [])

  posts.sort((a, b) => b.createdDate - a.createdDate)

  return {
    id: blog.id,
    title: blog.title,
    posts: posts.map(post => {
      const postTags = post.postTags()
      const tags = postTags.map(postTag => {
        const tag = postTag.tags() // TODO - Hung: optimize & clean this
        return {
          id: tag.id,
          name: tag.name,
        }
      })

      return {
        id: post.id,
        title: post.title,
        isDraft: post.isDraft,
        slug: post.slug,
        tags: tags,
        totalComment: post.comments().length,
        publishedDate: post.publishedAt,
        createdDate: post.createdDate,
      }
    }),
  }
}


function _isTagExist(post, tagName) {
  if (!post.postTags().length) {
    return false
  }

  return post.postTags().find(postTag => postTag.tags().name === tagName)
}

/**
 * Get post detail for edit page (mypage)
 * Only owner can get data of given post
 *
 * @param id
 * @param meta
 * @return {Promise<object>}
 */
async function showEdit(id, meta) {
  const post = await postModel.findOne({
    include: [
      {
        relation: 'blogs',
        scope: {
          where: {
            userId: meta.userId,
          },
        },
      },
      {
        relation: 'postTags',
        scope: {
          include: {
            relation: 'tags',
          },
          where: {
            isValid: 1,
            userId: meta.userId,
          },
        },
      },
    ],
    where: {
      id: id,
    },
  })

  if (!post) {
    return {}
  }

  const [blog, postTags] = await Promise.all([
    post.blogs.get(),
    post.postTags.find(),
  ])
  const tags = postTags
    ? await Promise.all(postTags.map(async tag => await tag.tags.get()))
    : []

  return !blog ? {} : {
    id: post.id,
    isDraft: post.isDraft,
    isEnableComment: post.isEnableComment,
    imageNumbers: post.imageNumbers,
    publishedAt: post.publishedAt,
    blogId: post.blogId,
    title: post.title,
    content: post.content,
    tags: tags.map(tag => tag.name),
  }
}

/**
 * Update given post
 * Only update fields that was modified
 *
 * @param id
 * @param input
 * @param meta
 * @return {Promise<object>}
 */
async function update(id, input, meta) {
  const [post, blog] = await Promise.all([
    postModel.findOne({
      include: {
        relation: 'blogs',
        scope: {
          where: {
            userId: meta.userId,
          },
        },
      },
      where: {
        id: id,
      },
    }),
    blogModel.findOne({
      where: {
        id: input.blogId,
        userId: meta.userId,
      },
    }),
  ])

  const curBlog = await post.blogs.get()

  if (!post || !blog || !curBlog) {
    return {}
  }

  return await Promise.all([
    post.updateAttributes(objectUtils.nullFilter({
      publishedAt: input.publishedAt ? input.publishedAt * 1000 : null,
      isDraft: input.isDraft === post.isDraft ? null : input.isDraft,
      isEnableComment: input.disableComment === undefined
        ? null
        : (input.disableComment ? 0 : 1),
      blogId: input.blogId === post.blogId ? null : input.blogId,
      imageNumbers: input.imageNumbers === post.imageNumbers ? null : input.imageNumbers,
      headImageUrl: input.headImageUrl === post.headImageUrl ? null : input.headImageUrl,
      title: input.title === post.title ? null : input.title,
      content: input.content === post.content ? null : input.content,
      slug: input.title === post.title || !input.title
        ? null
        : stringUtils.slugify(input.title) + '-' + parseInt(Date.now() / 1000),
    })),
    !input.tagsList ? [] : tagService.updatePostTags(id, input.tagsList),
  ])
}

/**
 * Store new post
 *
 * @param input
 * @param meta
 * @returns {Promise<Object>}
 */
async function store(input, meta) {
  if (!Object.keys(input).length || !meta.userId) {
    return {}
  }

  const blog = await blogModel.findOne({
    where: {
      id: input.blogId,
      userId: meta.userId,
    },
  })

  if (!blog) {
    return {}
  }

  const publishedAt = input.publishedAt
    ? input.publishedAt * 1000
    : (input.isDraft ? null : Date.now())

  const post = await postModel.create({
    isValid: 1,
    publishedAt: publishedAt,
    isDraft: input.isDraft || 0,
    isEnableComment: input.disableComment ? 0 : 1,
    blogId: input.blogId,
    imageNumbers: input.imageNumbers,
    headImageUrl: input.headImageUrl,
    title: input.title,
    content: input.content,
    slug: stringUtils.slugify(input.title) + '-' + parseInt(Date.now() / 1000),
  })

  const tags = await tagService.addPostTags(post.id || 0, input.tagsList)

  return [post, tags]
}

/**
 * Duplicate post (create same post from an existing post)
 *
 * @param id
 * @param input
 * @param meta
 * @returns {Promise<*>}
 */
async function duplicate(id, input, meta) {
  if (!meta.userId) {
    return {}
  }
  
  const blog = await blogModel.findOne({
    where: {
      userId: meta.userId,
    },
  })

  if (!blog) {
    return {}
  }

  const post = await postModel.findOne({
    include: {
      relation: 'postTags',
    },
    where: {
      id: id,
    },
  })

  const tags = !post ? [] : await post.postTags.find()
  const newTitle = post.title + '  (コピー)'
  const newPost = !post ? {} : await postModel.create({
    isValid: 1,
    publishedAt: Date.now(),
    isDraft: 1,
    isEnableComment: post.isEnableComment,
    blogId: post.blogId,
    title: newTitle,
    content: post.content,
    slug: stringUtils.slugify(newTitle) + parseInt(Date.now() / 1000),
  })
  const newTags = await tagService.addPostTagsById(newPost.id || 0, tags.map(tag => tag.tagId))

  return [newPost, newTags]
}

/**
 * Destroy given post
 *
 * @param id
 * @param meta
 * @returns {Promise<Object>}
 */
async function destroy(id, meta) {
  const post = await postModel.findOne({
    include: [
      {
        relation: 'blogs',
        scope: {
          where: {
            userId: meta.userId,
          },
        },
      },
    ],
    where: {
      id: id,
    },
  })

  return !post ? {} : await post.destroy()
}

/**
 * Search post list by tag
 *
 * @param {String} tagName
 * @returns {Promise<Object>}
 */
async function searchByTag(tagName) {
  const tagResult = await tagModel.findOne({
    where: {
      name: tagName,
    },
    include: [
      {
        relation: 'postTags',
        scope: {
          where: {
            isValid: 1,
          },
          include: [{
            relation: 'posts',
            scope: {
              where: {
                isValid: 1,
              },
              sort: 'createdAt DESC',
            },
          }],
        },
      },
    ],
  })

  if(tagResult) {
    const arrPostTags = tagResult.postTags()
    return arrPostTags.map(postTag => postTag.posts())
  }

  return []
}

// ------------------------------ Surface --------------------------------//
/**
 * Get surface detail data of specific post
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

  const isPreview = parseInt(input.isPreview || 0)
  const post = await postModel.findOne({
    include: [
      {
        relation: 'blogs',
        scope: objectUtils.deepFilter({
          where: {
            userId: isPreview ? (meta.userId || -1) : null,
          },
          fields: {userId: true},
        }),
      },
      {
        relation: 'comments',
        scope: {
          include: {
            relation: 'replies',
            scope: {
              where: {
                isHide: 0,
                isDelete: 0,
              },
            },
          },
          where: {
            isHide: 0,
            isDelete: 0,
          },
        },
      },
      {
        relation: 'postTags',
        scope: {
          include: 'tags',
          fields: {tagId: true},
        },
      },
    ],
    where: {
      slug,
      isValid: 1,
      isDraft: isPreview ? {inq: [0, 1]} : 0,
      and: isPreview ? undefined : [
        {
          publishedAt: {gt: 0},
        },
        {
          publishedAt: {lte: Date.now()},
        },
      ],
    },
  })
  const blog = !post ? null : post.blogs()

  if (!blog || !post) {
    return {}
  }

  const comments = post.comments()
  const postTags = post.postTags()
  const [nearly] = await Promise.all([
    _nearlyPost(post.id, post.blogId),
    _createPostAccessRecord(post.id, meta.userId),
  ])
  const tags = await Promise.all(postTags.map(async postTag => {
    const tag = await postTag.tags.get()
    return {
      id: tag.id,
      name: tag.name,
    }
  }))

  // Calculate total replies, total replies will be sum with total comment
  const totalReplies = comments.reduce((total, comment) => {
    return total + comment.replies().length
  }, 0)

  return !post ? {} : {
    id: post.id,
    title: post.title,
    headImageUrl: post.headImageUrl ? post.headImageUrl.replace('http://', 'https://') : null,
    publishedDate: post.publishedAt || 0,
    updatedDate: post.updatedAt || 0,
    enableComment: post.isEnableComment,
    totalComment: post.isEnableComment ? comments.length + totalReplies : 0,
    content: post.content.replace(
      /src=(['"])http:\/\/([^'"]*)['"]/gi,
      'src=$1https://$2$1',
    ),
    strippedContent: stringUtils.stripTagsAndStyle(post.content).substr(0, 300),
    userId: blog ? blog.userId : 0,
    tags: tags,
    nearlyPost: nearly,
  }
}

/**
 *
 * @param id
 * @param userId
 * @returns {Promise<void>}
 * @private
 */
async function _createPostAccessRecord(id, userId) {
  const post = await postModel.findOne({
    include: {
      relation: 'blogs',
      scope: {
        where: {
          userId: userId,
        },
        fields: {id: true, userId: true},
      },
    },
    where: {
      id: id,
    },
    fields: {id: true, blogId: true},
  })
  const blog = post ? post.blogs() : null

  // Only create post access record for visitor (not blog owner)
  !blog && await postAccessModel.create({
    isValid: 1,
    userId : userId,
    postId: id,
  })
}

/**
 * Get nearly post of given post in same blog
 *
 * @param id
 * @param blogId
 * @returns {Promise<Object>}
 * @private
 */
async function _nearlyPost(id, blogId) {
  const posts = await postModel.find({
    where: {
      blogId: blogId,
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
    fields: {id: true, title: true, slug: true},
  })
  const length = posts.length
  let next = {}, prev = {}

  for (let i = 0; i < length; i++) {
    const post = posts[i]
    if (post.id === id) {
      prev = posts[i - 1] || {}
      next = posts[i + 1] || {}
    }
  }

  return {
    prev,
    next,
  }
}

/**
 * Get list posts of given blog on surface blog index page
 *
 * @param blogSlug
 * @param input
 * @returns {Promise<Object>}
 */
async function surfaceIndex(blogSlug, input) {
  const page = input.page || 1
  const limit = input.limit || 20
  const where = {
    isDraft: 0,
    and: [
      {
        publishedAt: {
          gte: !input.from
            ? 0
            : input.from * 1000,
        },
      },
      {
        publishedAt: {
          lte: !input.to
            ? Date.now()
            : input.to * 1000 < Date.now()
              ? input.to * 1000
              : Date.now(),
        },
      },
    ],
  }
  const pagingInfo = pagingUtil.getOffsetCondition(page, limit)
  const blog = await blogModel.findOne({
    include: {
      relation: 'posts',
      scope: {
        include: ['comments', 'postTags'],
        where,
        skip: pagingInfo.skip,
        limit: pagingInfo.limit,
        order: 'publishedAt DESC',
      },
    },
    where: objectUtils.nullFilter({
      slug: encodeURIComponent(blogSlug),
    }),
    order: 'createdAt DESC',
  })
  const total = await postModel.count(Object.assign({blogId: blog.id}, where))

  return !blog ? {} : await _surfaceGetAllPosts(input, total, blog)
}

/**
 * Get all post of given blog on surface blog index page
 *
 * @param input
 * @param total
 * @param blog
 * @returns {Promise<Object>}
 * @private
 */
async function _surfaceGetAllPosts(input, total, blog) {
  let posts = blog.posts()
  const page = input.page || 1
  const limit = input.limit || 20

  posts = await Promise.all(posts.map(async post => {
    const postTags = await post.postTags.find({
      include: [
        {
          relation: 'tags',
          scope: {
            fields: {id: true, name: true},
          },
        },
      ],
    })

    const tags = await Promise.all(postTags.map(async postTag => {
      const tag = await postTag.tags.get()
      return {
        id: tag.id,
        name: tag.name,
      }
    }))

    return {
      id: post.id,
      title: post.title,
      content: stringUtils.stripTagsAndStyle(post.content || '').substr(0, 200),
      slug: post.slug,
      tags: tags,
      totalComment: await post.comments.count(),
      publishedDate: post.publishedAt,
    }
  }))

  return pagingUtil.addPagingInformation(posts, page, total, limit)
}

module.exports = {
  index,
  show,
  showEdit,
  update,
  store,
  duplicate,
  destroy,
  searchByTag,
  surfaceIndex,
}
