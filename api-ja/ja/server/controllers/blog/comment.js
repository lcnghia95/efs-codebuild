const app = require('@server/server')
const service = require('@server/services/blog/comment')
const metaUtils = app.utils.meta

async function mypageComment(req, res) {
  try {
    res.json(await service.mypageComment(req.params.id, req.query, metaUtils.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function hideComment(req, res) {
  try {
    let result = await service.hideComment(req.params.id, metaUtils.meta(req, ['userId']))
    res.json(result)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function removeComment(req, res) {
  try {
    let result = await service.removeComment(req.params.id, req.body, metaUtils.meta(req, ['userId']))
    res.json(result)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function hideReply(req, res) {
  try {
    let result = await service.hideReply(req.params.id, metaUtils.meta(req, ['userId']))
    res.json(result)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

/**
 * Block given user (that user can't comment all blog of current user)
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function blockUser(req, res) {
  try {
    let result = await service.blockUser(req.params.id, metaUtils.meta(req, ['userId']))
    res.json(result)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

/**
 * Unblock given user (that user can comment on all block of current user)
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function unblockUser(req, res) {
  try {
    let result = await service.unblockUser(req.params.id, metaUtils.meta(req, ['userId']))
    res.json(result)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function surfaceComment(req, res) {
  try {
    res.json(await service.surfaceComment(req.params.id, req.query, metaUtils.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function storeComment(req, res) {
  try {
    res.json(await service.storeComment(req.params.id, req.body, metaUtils.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

// async function destroyCommunity(req, res) {
//   try {
//     res.json(await service.destroyCommunity(req.params.commentId, req.body, metaUtils.meta(req, ['userId'])))
//   } catch (e) {
//     console.error(e)
//     res.sendStatus(500)
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
