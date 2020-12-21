const app = require('@server/server')
const productUrlSv = require('@services/common/productUrl')
const priceSv = require('@services/common/price')
const commonRecentReviewModel = app.models.CommonRecentReviews
const commonRankingReviewCountModel = app.models.CommonRankingReviewCount
const utils = app.utils
const commonReview = require('@services/common/review')
const sfProductDetailModel = app.models.SurfaceProductDetails

const DEFAUL_FIELDS = 'productId,typeId'
const PRICE = ',price,isSpecialDiscount,specialDiscountPrice,accountCurrencyType'
const STARS = ',reviewsStars,reviewsCount'
const REVIEW = ',reviewPublishedAt,reviewStars,reviewTitle,reviewContent'

const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Get top new reviews
 *
 * @param input
 * @return {Promise<Array>}
 */
async function newReview(input) {
  const fields = 'productId,typeId,categoryId,productName,reviewStars,price'
  const limit = input.limit || 10
  const data = await _objects(commonRecentReviewModel, fields, limit)

  if(data.length == 0) {
    return []
  }

  const pIds = arrayUtil.unique(arrayUtil.column(data, 'productId'))

  let [reviews, products] = await Promise.all([
    commonReview.getReviewStars(pIds, {productId: true, reviewCount: true}),
    _getProductDetail(pIds, {productId: true, price: true, specialDiscountPrice: true}),
  ])

  reviews = arrayUtil.index(reviews, 'productId')
  products = arrayUtil.index(products, 'productId')

  return data.map(item => {
    const id = item.productId
    return {
      productId: id,
      name: item.productName || '',
      prices: [
        utils.object.nullFilter({
          price:  products[id].price || 0,
          discountPrice: products[id].specialDiscountPrice ? products[id].specialDiscountPrice : null,
        }),
      ],
      review: {
        stars: item.reviewStars || 0,
        count: (!reviews[id]) ? 0 : reviews[id].reviewCount,
      },
      detailUrl: item.detailUrl || '',
    }
  })
}

/**
 * Get top new reviews of systemtrade
 *
 * @param input
 * @return {Promise<Array>}
 */
async function systemtrade() {
  const fields = DEFAUL_FIELDS
    + REVIEW
    + ',productName,reviewUserId,reviewNickName,categoryId'
  return await _objects(commonRecentReviewModel, fields, 3, '1')
}

/**
 * Get top new reviews of ebook
 *
 * @param input
 * @return {Promise<Array>}
 */
async function ebook() {
  const fields = DEFAUL_FIELDS + REVIEW + ',reviewUserId,reviewNickName,categoryId'
  return await _objects(commonRecentReviewModel, fields, 3, '2,6,9,19')
}

/**
 * Get top new reviews of salon
 *
 * @param input
 * @return {Promise<Array>}
 */
async function salon() {
  const fields = DEFAUL_FIELDS
    + REVIEW
    + ',reviewUserId,reviewNickName,categoryId'
  return await _objects(commonRecentReviewModel, fields, 3, '4')
}

/**
 * Get reviewer info of top new reviews
 *
 * @param input
 * @return {Promise<Array>}
 */
async function reviewer(input) {
  const fields = 'productId,reviewUserId,reviewNickName,reviewTitle'
  return await _objects(commonRecentReviewModel, fields, input.limit || 10)
}

/**
 * Get top review (popular) of ea
 *
 * @param input
 * @return {Promise<Array>}
 */
async function topEA(input) {
  input.typeId = 1
  return await _topReview(commonRankingReviewCountModel, input)
}

/**
 * Get top review (popular) of ebook
 *
 * @param input
 * @return {Promise<Array>}
 */
async function topEbook(input) {
  input.typeId = 2
  return await _topReview(commonRankingReviewCountModel, input)
}

/**
 * Get product price via surface product detail
 *
 * @param {Array} pIds
 * @param {Object} fields
 * @return {Promise<Array>}
 */
async function _getProductDetail(pIds, fields) {
  return sfProductDetailModel.find({
    where: {
      isValid: 1,
        id: {
          inq: pIds,
        },
      },
    fields,
  })
}

/**
 * Get top review of specific product type
 *
 * @param {Model} model
 * @param {Object} input
 * @return {Promise<Array>}
 * @private
 */
async function _topReview(model, input) {
  const data = await model.find({
    where: {
      typeId: input.typeId,
    },
    limit: input.limit || 5,
    fields: utils.query.fields(
      DEFAUL_FIELDS + PRICE + STARS + ',categories,productName',
    ),
  })

  return await _productMapping(data)
}

/**
 * Get review data
 *
 * @param model
 * @param {String} fields
 * @param {Number} limit
 * @param {String} type
 * @return {Promise<Array>}
 * @private
 */
async function _objects(model, fields, limit = 5, type = null) {
  const data = await model.find(utils.object.deepFilter({
    where: {
      typeId: !type ? null : {inq: type.split(',')},
    },
    limit,
    fields: utils.query.fields(fields),
    order: 'reviewPublishedAt DESC',
  }))
  return await _reviewObjects(data)
}

/**
 * Get review response objects
 *
 * @param {Array} reviews
 * @return {Promise<Array>}
 * @private
 */
async function _reviewObjects(reviews) {
  return await Promise.all(reviews.map(async record => {
    const res = {
      productId: record.productId,
      productName: record.productName,
      reviewNickName: record.reviewNickName,
      reviewUserId: record.reviewUserId,
      reviewPublishedDate: record.reviewPublishedAt,
      reviewTitle: record.reviewTitle,
      reviewContent: record.reviewContent,
      reviewStars: record.reviewStars,
      chart: _setChart(record),
    }
    if (record.typeId) {
      const detailUrl = await productUrlSv.productDetailUrls([record])
      res.detailUrl = detailUrl[record.productId]
    }
    return utils.object.filter(res)
  }))
}

/**
 * Mapping response object for top products
 *
 * @param {Array} reviews
 * @return {Promise<Array>}
 * @private
 */
async function _productMapping(reviews) {
  const detailUrls = await productUrlSv.productDetailUrls(reviews)
  return await Promise.all(reviews.map(async record => {
    const price = record.price !== null || record.price !== undefined
      ? priceSv.sfPrice(record)
      : null

    // Response object
    const res = {
      productId: record.productId,
      name: record.productName,
      review: {
        stars: record.reviewsStars,
        count: record.reviewsCount,
      },
      detailUrl: detailUrls[record.productId],
      prices: !price && !price[0] ? null :
      [
        utils.object.nullFilter({
          price: price[0].price || 0,
          discountPrice: price[0].discountPrice ? price[0].discountPrice : null,
        }),
      ],
    }

    return utils.object.filter(res)
  }))
}

/**
 * Get chart for review response
 *
 * @param {Record} record
 * @return {Array}
 * @private
 */
function _setChart(record) {
  if (record.timeCurrent && record.balanceCurve) {
    const times = record.timeCurrent.split ? record.timeCurrent.split(',') : []
    const equities = record.balanceCurve.split ? record.balanceCurve.split(',') : []

    times.sort()
    return times.map((time, index) => {
      return [parseInt(time), parseInt(equities[index] || 0)]
    })
  }
}

module.exports = {
  newReview,
  systemtrade,
  ebook,
  salon,
  reviewer,
  topEA,
  topEbook,
}
