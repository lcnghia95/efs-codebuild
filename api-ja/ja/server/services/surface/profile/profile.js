const app = require('@server/server')
const countList = require('./products').countList
const commonUser = require('@services/common/user')
const commonFollow = require('@services/common/follow')
const commonProduct = require('@services/common/product')
const commonProductUrl = require('@services/common/productUrl')
const commonReview = require('@services/common/review')
const gogoBlogService = require('./gogoBlog')
const fxonBlogService = require('./fxonBlog')
const realtradeService = require('@services/surface/realtrade')

const commonEmailV1 = require('@@services/common/emailv1')

const GOGO_HOST = process.env.GOGO_HOST_URL
const USER_ANSWERS = {
  1: 'occupation',
  2: 'bloodType',
  3: 'investmentType',
  4: 'investmentCareer',
  5: 'investmentAmount',
}

// Models
const reviewModel = app.models.Reviews
const userModel = app.models.Users

// Utils
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = app.utils.object
const pagingUtil = app.utils.paging
const stringUtil = app.utils.string
const httpUtil = app.utils.http

/**
 * Get user profile data by userid
 *
 * @param {Number} id
 * @param {Number} myId
 * @return {Promise<Object>}
 * @public
 */
async function show(id, myId) {
  id = parseInt(id)
  const user = await commonUser.getUser(id)

  if (!user || !user.id) {
    return {}
  }

  const [
    answers, introduction, isFollow, follows,
    followers, hasReview, hasBanner,
    products, gogoBlog, fxonBlog, realtrade,
  ] = await Promise.all([
    _answers(id),
    _selfIntroductions([id]),
    commonFollow.checkFollow(id, myId),
    commonFollow.countFollows(id),
    commonFollow.countFollowers(id),
    _hasReview(id),
    _hasBanner(id),
    countList(id),
    gogoBlogService.gogoBlog(id, {}, 1),
    fxonBlogService.fxonBlog(id, {type: 1}),
    realtradeService.getRealTradeAccount(id, {limit: 0}),
  ])

  const blogCount = gogoBlog.length + fxonBlog.length

  return objectUtil.filter(Object.assign(answers, {
    id: user.id,
    nickName: user.nickName,
    isFollow,
    hasBanner,
    introduction: stringUtil.stripTags(introduction[id] || ''),
    follows,
    followers,
    hasProduct: !!products,
    hasReview,
    hasBlog: blogCount > 0,
    products,
    blogCount,
    realtrade: realtrade.total || 0,
  }))
}

/**
 * Get user review data
 *
 * @param {Number} id
 * @return {Promise<Object>}
 * @public
 */
async function review(id) {
  const fields = 'id,productId,title,content,reviewStars'
  const reviews = await commonReview.getReviews(id, fields)
  const productIds = arrayUtil.column(reviews, 'productId')
  const products = await commonProduct.products(productIds, 'id,typeId,name')
  const urls = await commonProductUrl.productDetailUrls(products)
  const productNames = commonProduct.name(products)

  return reviews.map(review => {
    return _reviewObject(review, productNames, urls)
  })
}

/**
 * Follow user
 *
 * @param {Number} id
 * @param {Number} myId
 * @return {Bool}
 * @public
 */
async function follow(id, myId) {
  const fields = {
    id: true,
    mailAddress: true,
    languages: true,
  }
  const [user, followUser] = await Promise.all([
    commonUser.getUser(id, fields),
    commonUser.getUser(myId),
  ])

  if (myId == 0 || Object.keys(user).length === 0) {
    return false
  }

  const insertStatus = await commonFollow.follow(id, myId)

  // if created
  if (insertStatus) {
    const emailContent = {
      nick_name: followUser.nickName,
      contents: GOGO_HOST + 'users/' + myId,
    }
    // Send mail
    commonEmailV1.sendByUserId(
      id, emailContent, 38,
      user.languages || 1,
    )
  }

  return true
}

/**
 * Unfollow user
 *
 * @param {Number} id
 * @param {Number} myId
 * @return {Bool}
 * @public
 */
async function unFollow(id, myId) {
  return await commonFollow.unFollow(id, myId)
}

/**
 * Get user follows data
 *
 * @param {Number} id
 * @param {Object} input
 * @return {Promise<Object>}
 * @public
 */
async function follows(id, input) {
  const page = input.page || 1
  const where = {
    isValid: 1,
    followUserId: id,
  }
  const offset = pagingUtil.getOffsetCondition(page, input.limit)
  const [total, follows] = await Promise.all([
    commonFollow.countFollows(id),
    commonFollow.getFollows(where, offset.limit, offset.skip, 'userId'),
  ])

  if (!follows || follows.length === 0) {
    return {}
  }

  const userIds = arrayUtil.column(follows, 'userId')
  let [users, introduction] = await Promise.all([
    _getUsers(userIds),
    _selfIntroductions(userIds),
  ])
  const userNames = commonUser.name(users)

  users = arrayUtil.index(users, 'id')

  const data = follows.filter(follow => {
    return users[follow.userId]
  }).map(follow => {
    const followUId = follow.userId
    return {
      id: followUId,
      nickName: userNames[followUId],
      introduction: introduction[followUId],
    }
  })

  return pagingUtil.addPagingInformation(data, page, total, offset.limit)
}

/**
 * Get user followers data
 *
 * @param {Number} id
 * @param {Object} input
 * @return {Promise<Object>}
 * @public
 */
async function followers(id, input) {
  const page = input.page || 1
  const where = {
    isValid: 1,
    userId: id,
  }
  const offset = pagingUtil.getOffsetCondition(page, input.limit)
  const [total, follows] = await Promise.all([
    commonFollow.countFollowers(id),
    commonFollow.getFollows(where, offset.limit, offset.skip,
      'followUserId'),
  ])

  if (!follows || follows.length === 0) {
    return {}
  }

  const userIds = arrayUtil.column(follows, 'followUserId')
  let [users, introduction] = await Promise.all([
    _getUsers(userIds),
    _selfIntroductions(userIds),
  ])
  const userNames = commonUser.name(users)

  users = arrayUtil.index(users, 'id')

  const data = follows.filter(follow => {
    return users[follow.followUserId]
  }).map(follow => {
    const followUId = follow.followUserId
    return {
      id: followUId,
      nickName: userNames[followUId],
      introduction: introduction[followUId],
    }
  })


  return pagingUtil.addPagingInformation(data, page, total, offset.limit)
}

/**
 * Get users don't care about is_valid
 *
 * @param {Array} userIds
 * @returns {Array}
 * @public
 */
async function _getUsers(userIds) {
  return await userModel.find({
    where: {
      id: {
        inq: userIds,
      },
      isValid: {
        inq: [0, 1],
      },
    },
    fields: {
      id: true,
      nickName: true,
    },
  })
}

/**
 * Get user answer data by user id
 *
 * @param {Number} userId
 * @return {Promise<Array>}
 * @private
 */
async function _answers(userId) {
  const answers = await commonUser.userAnswers(userId)
  return answers.reduce((result, item) => {
    if (USER_ANSWERS[item.questionType]) {
      result[USER_ANSWERS[item.questionType]] = item.answerType
    }
    return result
  }, {})
}

/**
 * Get user self introduction data
 *
 * @param {Array} userIds
 * @return {Promise<Object>}
 * @private
 */
async function _selfIntroductions(userIds) {
  const data = await commonUser.usersSelfIntroduction(userIds)
  return data.reduce((result, item) => {
    result[item.userId] = item.content || ''
    return result
  }, {})
}

/**
 * check user has review
 *
 * @param {Number} userId
 * @return {Number} 0 || 1
 * @private
 */
async function _hasReview(userId) {
  const count = await reviewModel.count({
    isValid: 1,
    userId,
  })
  return count
}

/**
 * Check user has blog
 *
 * @param userId
 * @return {Promise<boolean>}
 * @private
 */
// async function _hasBlog(userId) {
//   const [hasGogoBlog, hasFxonBlog] = await Promise.all([
//     gogoBlogService.hasGogoBlog(userId),
//     fxonBlogService.hasFxonBlog(userId),
//   ])
//   return hasGogoBlog || hasFxonBlog
// }

/**
 * Convert review object
 *
 * @param {Object} review
 * @param {Object} productNames
 * @param {Object} urls
 * @return {Object}
 * @private
 */
function _reviewObject(review, productNames, urls) {
  const productId = review.productId
  return objectUtil.filter({
    id: review.id,
    title: review.title,
    content: review.content,
    stars: review.reviewStars,
    productId: productId,
    productName: productNames[productId],
    productDetailUrl: urls[productId],
  })
}

/**
 * Check user has banner
 *
 * @param {Number} id
 * @return {Object}
 * @private
 */
async function _hasBanner(id) {
  const url = process.env.IMG_HOST_URL + 'users/' + id + '/banners?ingoreOnErr=1'
  const image = await httpUtil.get(url)
  return !image ? false : true
}


module.exports = {
  show,
  review,
  follows,
  followers,
  unFollow,
  follow,
}
