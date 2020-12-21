const app = require('@server/server')
const format = require('date-fns/format')
const postModel = app.models.Posts
const commentModel = app.models.Comments
const replyModel = app.models.Replies
const userModel = app.models.Users
const userBlockModel = app.models.UserBlock

// Utils
const arrayUtils = require('@ggj/utils/utils/array')


/** Get all comments of a blog by date range
 * @param {*} id
 * @param {*} input
 * @returns {Promise<Object[]>}
 */
async function mypageComment(id, input, meta) {
  // TODO: verify if user is owner of blog?
  const blogOwnerId = meta.userId || 0
  const startDate = `${input.from || format(new Date(), 'YYYY-MM-DD')} 00:00:00`
  const endDate = `${input.to || format(new Date(), 'YYYY-MM-DD')} 23:59:59`

  let arrPosts = await postModel.find({
    include: [
      {
        relation: 'comments',
        scope: {
          where: {
            isValid: 1,
            isDelete: 0,
            createdAt: {
              between: [startDate, endDate],
            },
          },
          sort: 'updatedAt DESC',
          include: [
            {
              relation: 'replies',
              scope: {
                where: {
                  isValid: 1,
                  isDelete: 0,
                },
                sort: 'updatedAt DESC',
              },
            },
          ],
        },
      },
    ],
    where: {
      blogId: id,
      isValid: 1,
    },
  }),
  result = []

  // Each blog have many posts, loop over each post
  await Promise.all(arrPosts.map(async post => {
    // Get all comments of each post
    const arrComments = post.comments()
    const commentUserIds = arrayUtils.column(arrComments, 'userId')

    // Each post have many comments & replies, loop over each comment
    await Promise.all(arrComments.map(async comment => {
      let replies = comment.replies(),
        replyUserIds = !replies ? [] : arrayUtils.column(replies, 'userId'),
        [users, blockedUsers] = await Promise.all([
          userModel.find({
            where: {
              id: {inq: commentUserIds.concat(replyUserIds)},
            },
            fields: {id: true, nickName: true},
          }),
          userBlockModel.find({
            where: {
              userId: blogOwnerId,
              blockedUserId: {inq: commentUserIds.concat(replyUserIds)},
            },
            fields: {createdAt: false, updatedAt: false},
          }),
        ])

      // Index users & blocked users list
      users = arrayUtils.index(users, 'id')
      blockedUsers = arrayUtils.index(blockedUsers, 'blockedUserId')

      result = result.concat(mypageObjects(post, comment, replies, users, blockedUsers))
    }))
  }))

  return result.sort((a, b) => b.publishedDate - a.publishedDate)
}

/**
 * Convert response object for mypage comment manage page
 *
 * @param post
 * @param {object} comment
 * @param {array} replies
 * @param {object} users
 * @param {object} blockedUsers
 * @return {object}
 */
function mypageObjects(post, comment, replies, users, blockedUsers) {
  const commentUser = users[comment['userId']] || {}
  const commentBlockRecord = blockedUsers[comment['userId']] || null
  const res = []

  res.push({
    id: comment.id,
    isReply: 0,
    postId: post.id,
    postTitle: post.title,
    postSlug: post.slug,
    content: comment.content,
    isHide: comment.isHide,
    isBlock: !commentBlockRecord ? 0 : 1,
    isUnread: comment.isUnread,
    user: {
      id: commentUser.id,
      name: commentUser.nickName,
    },
    publishedDate: comment.createdAt,
  })

  replies.forEach(reply => {
    const replyUser = users[reply['userId']] || {}
    const replyBlockRecord = blockedUsers[reply['userId']] || null

    res.push({
      id: reply.id,
      isReply: 1,
      postId: post.id,
      postTitle: post.title,
      postSlug: post.slug,
      content: reply.content,
      isHide: reply.isHide,
      isBlock: !replyBlockRecord ? 0 : 1,
      isUnread: reply.isUnread,
      user: {
        id: replyUser.id,
        name: replyUser.nickName,
      },
      publishedDate: reply.createdAt,
    })
  })

  return res
}

/** Hide comment and all of its replies from other users
 * @param {*} commentId
 * @param {*} meta
 * @returns {status: [1: success, 0: fail]}
 */
async function hideComment(commentId, meta) {
  const userId = meta.userId || 0
  let comment = await getManagableComment(commentId, userId)

  if (comment) {
    comment = comment.comment
    await comment.updateAttribute('isHide', 1 - comment.isHide)
    return { status: 1 }
  }

  return { status: 0 }
}

/** Delete comment and all of its replies
 * @param {*} commentId
 * @param {*} meta
 * @returns {status: [1: success, 0: fail], totalReply: numberOfRepliesDeleted}
 */
async function removeComment(commentId, input, meta) {
  // New flow
  const userId = meta.userId || 0
  let comment = input.isReply
      ? await getManagableReply(commentId, userId)
      : await getManagableComment(commentId, userId)

  if (!comment) {
    return { status: 0 }
  }

  comment = comment.comment
  comment.isDelete = 1
  comment.deleteType = comment.userType
  await comment.save()
  return { status: 1 }

  // Old flow (hard delete)
  // let userId = meta.userId || 0,
  //   comment = await getManagableComment(commentId, userId)
  // if (comment) {
  //   let replies = await comment.replies.find(),
  //     replyStatus = await replyModel.destroyAll({
  //       id: {inq: arrayUtils.column(replies, 'id')}
  //     }),
  //     commentStatus = await commentModel.destroyById(commentId)
  //   return {
  //     status: commentStatus.count > 0 ? 1 : 0,
  //     totalReply: replyStatus.count,
  //   }
  // }
  // return { status: 0 }
}

/** util to get comment can be manage by user
 * @param {*} commentId
 * @param {*} userId
 * @returns comment object
 */
async function getManagableComment(commentId, userId) {
  const comment = await commentModel.findOne({
    include: [
      {
        relation: 'posts',
        scope: {
          include: [
            {
              relation: 'blogs',
              scope: {
                fields: {
                  userId: true,
                },
              },
            },
          ],
        },
      },
      {
        relation: 'replies',
        scope: {
          fields: {id: true},
          where: {isValid: 1},
        },
      },
    ],
    where: {
      id: commentId,
      isValid: 1,
    },
  })

  if (comment) {
    const post = comment.posts()
    const blog = post.blogs()

    // Current user is blog owner
    if (blog.userId === userId) {
      return {
        userType: 1,
        comment,
      }
    }
    // Current user is comment owner
    if (comment.userId === userId) {
      return {
        userType: 0,
        comment,
      }
    }
  }
  return null
}

/** util to get comment can be manage by user
 * @param {*} commentId
 * @param {*} userId
 * @returns comment object
 */
async function getManagableReply(replyId, userId) {
  const reply = await replyModel.findOne({
    include: [
      {
        relation: 'comments',
        scope: {
          include: [
            {
              relation: 'posts',
              scope: {
                include: [
                  {
                    relation: 'blogs',
                    scope: {
                      fields: {
                        userId: true,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
    where: {
      id: replyId,
      isValid: 1,
    },
  })

  if (reply) {
    const comment = reply.comments ? reply.comments() : {}
    const post = comment.posts ? comment.posts() : {}
    const blog = post.blogs ? post.blogs() : {}

    // Current user is blog owner
    if (blog.userId === userId) {
      return {
        userType: 1,
        comment: reply,
      }
    }
    // Current user is comment owner
    if (reply.userId === userId) {
      return {
        userType: 0,
        comment: reply,
      }
    }
  }
  return null
}

/** Hide comment from other users
 * @param {*} commentId
 * @param {*} meta
 * @returns {status: [1: success, 0: fail]}
 */
async function hideReply(replyId, meta) {
  const userId = meta.userId || 0
  const reply = await replyModel.findOne({
    include: [{
      relation: 'comments',
      scope: {
        include: [
          {
            relation: 'posts',
            scope: {
              include: [
                {
                  relation: 'blogs',
                  scope: {
                    fields: {
                      userId: true,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    }],
    where: {
      id: replyId,
      isValid: 1,
    },
  })

  if (reply) {
    const comment = await reply.comments.get()
    const post = await comment.posts.get()
    const blog = await post.blogs.get()
    if (blog.userId === userId) {
      await reply.updateAttribute('isHide', 1 - reply.isHide)
      return { status: 1 }
    } else {
      console.log('You are not owner of this blog!')
    }
  } else {
    console.log('Reply not found! ', replyId)
  }
  return { status: 0 }
}

/**
 * Block given user (that user can't comment all blog of current user)
 *
 * @param userId
 * @param meta
 * @returns {Promise<Object>}
 */
async function blockUser(userId, meta) {
  if (!userId || !meta.userId || parseInt(userId) === meta.userId) {
    return {
      status: 0,
    }
  }

  const data = await userBlockModel.upsertWithWhere({
    userId: meta.userId,
    blockedUserId: userId,
  }, {
    isValid: 1,
    userId: meta.userId,
    blockedUserId: userId,
  })
  return data && Object.keys(data).length ? {status: 1} : {status: 0}
}

/**
 * Unblock given user (that user can comment on all block of current user)
 *
 * @param userId
 * @param meta
 * @returns {Promise<Object>}
 */
async function unblockUser(userId, meta) {
  if (!userId || !meta.userId) {
    return {
      count: 0,
    }
  }

  return await userBlockModel.destroyAll({
    userId: meta.userId,
    blockedUserId: userId,
  })
}

/**
 * Get surface detail comment data of specific post
 *
 * @param id
 * @param input
 * @param meta
 * @returns {Promise<Object[]>}
 */
async function surfaceComment(id, input, meta) {
  if (!id) {
    return []
  }

  const post = await postModel.findOne({
    include: {
      relation: 'blogs',
      scope: {
        where: {
          userId: meta.userId,
        },
        fields: {id: true},
      },
    },
    where: {
      id: id,
      isValid: 1,
    },
    fields: {id: true, blogId: true, isEnableComment: true},
  })
  const blog = !post ? null : post.blogs()
  const comments = !post || !post.isEnableComment
    ? []
    : await commentModel.find({
      include: [
        {
          relation: 'replies',
          scope: {
            where: {
              isValid: 1,
              isDelete: 0,
              isHide: !blog ? 0 : {inq: [0, 1]}, // Show hidden comment if current user is blog owner
            },
            order: 'createdAt ASC',
          },
        },
      ],
      where: {
        postId: id,
        isValid: 1,
        isDelete: 0,
        isHide: !blog ? 0 : {inq: [0, 1]}, // Show hidden comment if current user is blog owner
      },
      order: 'createdAt ASC',
    })

  // Get comment user info
  const commentUserIds = arrayUtils.column(comments, 'userId')
  const commentUsers = !commentUserIds.length
    ? {}
    : arrayUtils.index(await userModel.find({
      where: {
        id: {inq: commentUserIds},
      },
      fields: {id: true, nickName: true},
    }), 'id')

  // Convert all comment include replies into response object
  return await Promise.all(comments.map(async comment => {
    const replies = comment.replies()
    // Get reply users info
    const replyUserIds = arrayUtils.column(replies, 'userId')
    const replyUsers = !replyUserIds.length
      ? {}
      : arrayUtils.index(await userModel.find({
        where: {
          id: {inq: replyUserIds},
        },
        fields: {id: true, nickName: true},
      }), 'id')

    return surfaceObject(comment, replies, commentUsers, replyUsers)
  }))
}

/**
 * Convert comment response object for surface detail page
 *
 * @param comment
 * @param replies
 * @param commentUsers
 * @param replyUsers
 * @return {object}
 */
function surfaceObject(comment, replies, commentUsers, replyUsers) {
  return {
    id: comment.id,
    userId: comment.userId,
    userName: commentUsers[comment['userId']]
      ? commentUsers[comment['userId']]['nickName']
      : '',
    content: comment.content,
    publishedDate: comment.createdAt,
    isHide: comment.isHide,
    isDel: comment.isDelete,
    replies: replies.map(reply => {
      return {
        id: reply.id,
        userId: reply.userId,
        userName: replyUsers[reply['userId']]
          ? replyUsers[reply['userId']]['nickName']
          : '',
        content: reply.content,
        publishedDate: reply.createdAt,
        isHide: reply.isHide,
        isDel: reply.isDelete,
      }
    }),
  }
}

/**
 * Store new comment of given post
 *
 * @param id
 * @param input
 * @param meta
 * @returns {Promise<Object>}
 */
async function storeComment(id, input, meta) {
  if (!Object.keys(input).length || meta.userId === 0) {
    return {}
  }

  // Case post reply
  if (!input.isReply) {
    // Case post comment
    return await commentModel.create({
      isValid: 1,
      isUnread: 1,
      userId: meta.userId || 0,
      postId: id,
      content: input.content,
    })
  }

  return await replyModel.create({
    isValid: 1,
    isUnread: 1,
    userId: meta.userId || 0,
    commentId: input.parentId,
    content: input.content,
  })
}

// /**
//  * Destroy an comment/reply
//  *
//  * @param {Number} id
//  * @param {Object} input
//  * @param {Object} meta
//  * @returns {Promise<Object>}
//  */
// async function destroyCommunity(id, input, meta) {
//   return parseInt(input.isReply) === 1
//     ? await destroyReply(id, input, meta)
//     : await destroyComment(id, input, meta)
// }
//
// /**
//  * Destroy an comment include all replies of that comment
//  *
//  * @param {Number} id
//  * @param {Object} input
//  * @param {Object} meta
//  * @returns {Promise<Object>}
//  */
// async function destroyComment(id, input, meta) {
//   let comment = await commentModel.findOne({
//     include: {
//       relation: 'replies',
//       scope: {
//         fields: {id: true}
//       }
//     },
//     where: {
//       id: id
//     },
//     fields: {id: true, userId: true}
//   })
//   if (!(meta.userId === comment.userId)) {
//     return {
//       totalComment: 0,
//       totalReply: 0,
//     }
//   }
//
//   let replies = await comment.replies.find(),
//     totalReply = await replyModel.destroyAll({
//       id: {inq: arrayUtils.column(replies, 'id')}
//     }),
//     totalComment = await commentModel.destroyById(id)
//
//   return {
//     totalComment: totalComment.count,
//     totalReply: totalReply.count
//   }
// }
//
// /**
//  * Destroy an reply
//  *
//  * @param {Number} id
//  * @param {Object} input
//  * @param {Object} meta
//  * @returns {Promise<Object>}
//  */
// async function destroyReply(id, input, meta) {
//   let reply = await replyModel.findOne({
//     where: {
//       id: id
//     },
//     fields: {id: true, userId: true}
//   })
//
//   if (!(reply.userId === meta.userId)) {
//     return {
//       totalReply: 0
//     }
//   }
//   let totalReply = await replyModel.destroyById(id)
//
//   return {
//     totalReply: totalReply.count
//   }
// }

module.exports = {
  mypageComment,
  hideComment,
  removeComment,
  hideReply,
  blockUser,
  unblockUser,
  surfaceComment,
  storeComment,
  // destroyCommunity,
}
