const app = require('@server/server')
const commonUser = require('@services/common/user')
const commonProductUrl = require('@services/common/productUrl')
const commonSfProduct = require('@services/common/surfaceProduct')
// const commonSynchronize = require('@services/common/synchronize')

const commonEmailV1 = require('@@services/common/emailv1')

// models
const saleModel = app.models.Sales
const imageModel = app.models.Images
const communityViModel = app.models.CommunitiesVi
const communityGoodModel = app.models.CommunityGood
const surfaceProductDetailModel = app.models.SurfaceProductDetails

// utils
const timeUtil = require('@ggj/utils/utils/time')
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = require('@ggj/utils/utils/object')
const pagingUtil = require('@ggj/utils/utils/paging')
const modelUtil = require('@@server/utils/model')
const stringUtil = require('@ggj/utils/utils/string')

/**
 *
 * @var {Number}
 */
const COMMUNITY_GOOD_LIKE = 1

/**
 *
 * @var {Number}
 */
const COMMUNITY_GOOD_DISLIKE = 2

/**
 *
 * @var {String}
 */
const MY_COMMUNITY_GOOD_LIKE_TYPE = 'myGoodType'

/**
 *
 * @var {Number}
 */
const COMMUNITY_IMAGE_CATEGORY_ID = 12

const LASTEST_SUB_LIMIT = 20

/**
 * get communities of product
 *
 * @param {object} input
 * @param {Number} uId
 * @return {Array}
 * @public
 */
async function index(input, uId) {
  const pId = parseInt(input.productId)
  if (!pId) {
    return []
  }

  const communities = await _communities(pId)

  if (!communities.length) {
    return []
  }

  // Get related data
  const [goods, users, images, buyers] = await Promise.all([
    _goodInfo(arrayUtil.column(communities, 'id'), uId),
    _users(arrayUtil.column(communities, 'userId')),
    _imageInformation(arrayUtil.column(_filterIsImageField(communities), 'id')),
    _buyUsers(pId),
  ])

  const result = communities.reduce((result, community) => {
    const obj = _object(
      community, users[community.userId],
      goods[community.id], images[community.id],
    )
    obj.buyer = (buyers.indexOf(community.userId) > -1) ? 1 : undefined
    result.total++

    if (community.isTopic) {
      // topic
      result.topic++
      result.comments[community.id] = obj
    } else {
      // reply
      const topicId = community.topicCommunityId
      if (result.comments[topicId]) {
        // Integrate reply into parent comment
        // reply sort => +created_at
        if (result.comments[topicId].replies) {
          result.comments[topicId].replies.unshift(obj)
        } else {
          result.comments[topicId].replies = [obj]
        }
      } else {
        result.total--
      }
    }
    return result
  }, {
    topic: 0,
    total: 0,
    comments: {},
  })

  result.comments = arrayUtil.objectToArray(result.comments).reverse()
  result.purchased = buyers.indexOf(uId) > -1 ? 1 : null
  return objectUtil.nullFilter(result)
}

/**
 * Like/Dislike community record
 *
 * @param {Number} cId
 * @param {Number} type
 * @param {Object} meta
 * @return {Void}
 * @public
 */
async function action(cId, type, meta) {
  type = parseInt(type)

  // login only
  if (!meta.userId || [1, 2].indexOf(type) == -1) {
    return
  }

  // Only like/dislike topic
  // Only like/dislike 1 time, cannot change
  const [isTopic, isAction] = await Promise.all([
    _isTopic(cId),
    _isAction(cId, meta.userId),
  ])

  if (!isTopic || isAction) {
    return
  }

  // delete this if sync to fxon
  await communityGoodModel.create({
    isValid: 1,
    communityId: cId,
    userId: meta.userId,
    goodType: type,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  })

  // uncomment this if sync to fxon
  // // Post new `common.community_good` record
  // let communityGood = await communityGoodModel.create({
  //   isValid: 1,
  //   communityId: cId,
  //   userId: meta.userId,
  //   goodType: type,
  //   ipAddress: meta.ipAddress,
  //   userAgent: meta.userAgent,
  // })

  // sync data to fx-on
  // commonSynchronize.syncDataToFxon('community_good', communityGood.id)

  return
}

/**
 * get lastest Community
 *
 * @param {Array} input
 * @return {Array}
 * @public
 */
async function lastest(input) {
  const limit = parseInt(input.limit) || 3
  const pTypeId = input.typeId || null
  const res = []

  let page = 0  

  while (res.length < limit) {
    page++
    const data = await _getCommunitiesData(
      pagingUtil.getOffsetCondition(page, limit + LASTEST_SUB_LIMIT),
    )

    if (!data.length) {
      return res
    }

    let [users, products] = await Promise.all([
      _users(arrayUtil.column(data, 'userId')),
      _getProductData(arrayUtil.column(data, 'productId'), pTypeId),
    ])
    const urls = await commonProductUrl.productDetailUrls(products)

    let key = 0
    products = arrayUtil.index(products, 'productId')
    while (res.length < limit && data[key]) {
      const item = data[key]
      key++
      if (!products[item.productId] || !users[item.userId]) {
        continue
      }
      res.push({
        id: item.id,
        productId: item.productId,
        isTopic: item.isTopic,
        topicId: item.topicCommunityId,
        content: item.content,
        publishedDate: item.publishedAt,
        userId: item.userId,
        userName: users[item.userId].nickName,
        detailUrl: urls[item.productId],
      })
    }
  }
  return res
}

/**
 * Get total communities of product
 *
 * @param {Number} productId
 * @return {Number}
 * @public
 */
async function count(productId) {
  return productId ? await communityViModel.count({
    isPrivate: 0,
    productId,
    userId: {
      gt: 0,
    },
  }) : 0
}

/**
 * Post `common.communities` record, in case of reply  input.topicId > 0
 *
 * @param {Object} input
 * @param {Object} meta
 * @return {Object}
 * @public
 */
async function store(input, meta) {
  const productId = parseInt(input.productId)
  if (!productId || !meta.userId) {
    return {
      id: 0,
    }
  }

  const isTopic = (input.isTopic == 1) ? 1 : 0
  const topicCommunityId = isTopic ? 0 : parseInt(input.topicId)

  if (!isTopic && !topicCommunityId) {
    return {
      id: 0,
    }
  }

  const community = await communityViModel.create({
    isValid: 1,
    userId: meta.userId,
    productId,
    isTopic,
    topicCommunityId,
    publishedAt: timeUtil.utcDate(),
    content: input.content || '',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  })
  _notify(productId, input.content || '', community)

  // sync data to fx-on
  // commonSynchronize.syncDataToFxon('communities', community.id)

  return {
    id: community.id,
  }
}

/**
 * Delete `common.communities` record
 *
 * @param {Number} id (communityId)
 * @param {Number} userId
 * @return {Void}
 * @public
 */
async function destroy(id, userId) {
  if (!id || !userId) {
    return
  }

  const record = await communityViModel.findOne({
    where: {
      id,
      isValid: 1,
      userId,
    },
    fields: {
      id: true,
    },
  })

  if (!record) {
    return
  }

  // detete
  record.isValid = 0
  await record.save()

  // sync
  // commonSynchronize.syncDataToFxon('communities', record.id, {
  //   is_valid: 0
  // })

  _destroyReplies(id)
}

/**
 * get and index users
 *
 * @param {Array} userIds
 * @return {Object}
 * @private
 */
async function _users(userIds) {
  return arrayUtil.index(await commonUser.getUsers(userIds))
}

/**
 * Destroy all reply when topic community was destroyed
 *
 * @param {Number} topicCommunityId
 * @return {Void}
 * @private
 */
async function _destroyReplies(topicCommunityId) {
  // detete and no sync
  communityViModel.updateAll({
    topicCommunityId,
    isValid: 1,
    isTopic: 0,
  }, {
    isValid: 0,
  })


  // detete and sync
  // let communities = await communityViModel.find({
  //   where: {
  //     topicCommunityId,
  //     isValid: 1,
  //     isTopic: 0,
  //   },
  //   fields: {
  //     id: true
  //   }
  // })
  // communities.map(community => {
  //   commonSynchronize.syncDataToFxon('communities', community.id, {
  //     is_valid: 0
  //   })
  // })
}

/**
 * get goods information
 *
 * @param {Array} cIds
 * @param {Number} uId
 * @return {Object}
 * @private
 */
async function _goodInfo(cIds, uId) {
  const fields = {
    communityId: true,
    goodType: true,
    userId: uId ? true : false,
  }
  const data = await communityGoodModel.find({
    where: {
      communityId: {
        inq: cIds,
      },
    },
    fields,
  })
  return data.reduce((acc, record) => {
    let cId, type, obj = {}
    cId = record.communityId
    type = record.goodType
    if (acc[cId]) {
      if (!acc[cId][type]) {
        acc[cId][type] = 0
      }
      acc[cId][type] += 1
    } else {
      obj[type] = 1
      acc[cId] = obj
    }
    if (uId && (record.userId || 0) == uId) {
      obj = {}
      obj[MY_COMMUNITY_GOOD_LIKE_TYPE] = type
      acc[cId] = Object.assign(acc[cId], obj)
    }
    return acc
  }, {})
}

/**
 * check if community is Topic
 *
 * @param {Number} cId
 * @return {Bool}
 * @private
 */
async function _isTopic(cId) {
  const communities = await communityViModel.find({
    where: {
      id: cId,
      isTopic: 1,
    },
  })
  if (communities.length) {
    return true
  }
  return false
}

/**
 * check if community is Action
 *
 * @param {Number} cId
 * @param {Number} uId
 * @return {Bool}
 * @private
 */
async function _isAction(cId, uId) {
  const communities = await communityGoodModel.find({
    where: {
      communityId: cId,
      userId: uId,
    },
  })
  if (communities.length) {
    return true
  }
  return false
}

/**
 * get all communities with product id
 *
 * @param {Number} pId (product_id)
 * @return {object}
 * @private
 */
async function _communities(pId, limit = 0) {
  return await communityViModel.find({
    where: {
      isPrivate: 0,
      productId: pId,
      userId: {
        gt: 0,
      },
    },
    limit,
    fields: {
      id: true,
      userId: true,
      isTopic: true,
      topicCommunityId: true,
      content: true,
      publishedAt: true,
      isUploadedImages: true,
    },
    order: ['isTopic DESC', 'createdAt DESC'],
  })
}

/**
 * Get images inforamtion
 *
 * @param {Array} cIds
 * @return {Object}
 * @private
 */
async function _imageInformation(cIds) {
  // Get image information from gogojungle
  const images = await imageModel.find({
    where: {
      imageCategoryId: COMMUNITY_IMAGE_CATEGORY_ID,
      masterId: {
        inq: cIds,
      },
    },
  })
  const result = images.reduce((result, image) => {
    const cId = parseInt(image.masterId)
    if (!result[cId]) {
      result[cId] = {
        newImageCount: 0,
      }
    }
    result[cId].newImageCount++
    return result
  }, {})

  // Get image information from fxon
  const fxComments = await modelUtil.find('asp', '_commu_topic_comment', {
    where: {
      Id: {
        // ignore previous communities's id
        inq: arrayUtil.arrayDiff(cIds, Object.keys(result).map(Number)),
      },
    },
    fields: {
      Id: true,
      TopicId: true,
      ImageFileName1: true,
      ImgType1: true,
      ImageFileName2: true,
      ImgType2: true,
      ImageFileName3: true,
      ImgType3: true,
    },
  })
  const url = `${process.env.FXON_HOST_URL}commuf/upfile/community/00001/`

  fxComments.map(fxComment => {
    const subUrl = `${url}${fxComment.TopicId}/${fxComment.Id}/`
    result[fxComment.Id] = {
      fxonImages: [],
    }
    if (fxComment.ImageFileName1) {
      result[fxComment.Id].fxonImages.push(
        subUrl + fxComment.ImageFileName1 + fxComment.ImgType1,
      )
    }
    if (fxComment.ImageFileName2) {
      result[fxComment.Id].fxonImages.push(
        subUrl + fxComment.ImageFileName2 + fxComment.ImgType2,
      )
    }
    if (fxComment.ImageFileName3) {
      result[fxComment.Id].fxonImages.push(
        subUrl + fxComment.ImageFileName3 + fxComment.ImgType3,
      )
    }
  })

  return result
}

/**
 * Get list of user that purchased products
 *
 * @param {Number} pId
 * @return {array}
 * @private
 */
async function _buyUsers(pId) {
  return await arrayUtil.column(saleModel.find({
    where: {
      productId: pId,
      userType: 1,
      statusType: 1, // 0:未売上、1:売上成立、2:投資クラウドソーシング開発者支払い済み、3:DVD発送済み
      salesType: 1, // 0:なし、1:販売商品、2:アフィリエイト、3:投資クラウドソーシング、4:相殺
      isCancel: 0,
      cancelType: 0,
      offsetId: 0,
      isRepayment: 0,
      payAt: {
        gte: '1970-01-01 00:00:01',
      },
    },
    fields: {
      userId: true,
    },
    limit: 0,
  }), 'userId')
}

/**
 * Get communities with property isUploadedImages != 0
 *
 * @param {Objects} communities
 * @return {Array}
 * @private
 */
function _filterIsImageField(communities) {
  return communities.filter(community => community.isUploadedImages)
}

/**
 * Get lastest communities data
 *
 * @param {Objects} offset
 * @return {Array}
 * @private
 */
async function _getCommunitiesData(offset) {
  return await communityViModel.find({
    where: {
      isValid: 1,
      isPrivate: 0,
      userId: {
        gt: 0,
      },
    },
    fields: {
      id: true,
      userId: true,
      content: true,
      publishedAt: true,
      productId: true,
      typeId: true,
      isTopic: true,
      topicCommunityId: true,
    },
    limit: offset.limit || LASTEST_SUB_LIMIT,
    skip: offset.skip || 0,
    order: 'publishedAt DESC',
  })
}

/**
 * Get product base on data
 *
 * @param {Array} pIds
 * @param {Number} pTypeId
 * @return {array}
 * @private
 */
async function _getProductData(pIds, pTypeId) {
  const conditions = commonSfProduct.onSaleConditions(
    [],
    pTypeId ? [pTypeId] : [],
  )

  conditions.where.id = {
    inq: pIds,
  }
  conditions.fields = {
    productId: true,
    typeId: true,
    categories: true,
  }
  return await surfaceProductDetailModel.find(conditions)
}

/**
 * object Comment
 *
 * @param {Array} community
 * @param {Array} user
 * @param {Array} good
 * @param {Array} image
 * @return {Object}
 * @private
 */
function _object(community, user = {}, good = {}, image = {}) {
  return objectUtil.nullFilter({
    id: community.id,
    content: community.content,
    publishedDate: community.publishedAt,
    userId: user.id,
    userName: user.nickName || '',
    isUploadedImages: image.newImageCount,
    isTopic: community.isTopic == 1,
    like: good[COMMUNITY_GOOD_LIKE],
    dislike: good[COMMUNITY_GOOD_DISLIKE],
    likeType: good[MY_COMMUNITY_GOOD_LIKE_TYPE],
    fxonImgUrl: image.fxonImages,
  })
}

/**
 * Send email to developer
 *
 * @param {Number} productId
 * @param {String} content
 * @return void
 */
async function _notify(productId, content, cmt) {
  content = stringUtil.jpStringShorten(content, 300)
  const product = await surfaceProductDetailModel.findOne({
    where: {
      isValid: 1,
      id: productId,
      statusType: {
        gt: 0,
      },
    },
    fields: {
      productId: true,
      userId: true,
      typeId: true,
      categories: true,
    },
  })

  if (!product) {
    return
  }

  const [user, productUrls] = await Promise.all([
    commonUser.getUserFullInformation(product.userId, true),
    commonProductUrl.productDetailUrls([product]),
  ])

  if (!user) {
    return
  }

  commonEmailV1.sendByUserId(product.userId, {
    nick_name: user.nickName || '',
    site_url: `${process.env.GOGO_HOST_URL}${productUrls[productId].substr(1)}?cmt=${cmt.id},${cmt.isTopic}${cmt.topicCommunityId ? (',' + cmt.topicCommunityId) : ''}`,
    content,
  }, 42)
}

module.exports = {
  action,
  index,
  lastest,
  count,
  store,
  destroy,
}
