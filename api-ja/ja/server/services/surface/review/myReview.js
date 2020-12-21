const app = require('@server/server')
const productUrlSv = require('@services/common/productUrl')
const saleSv = require('@services/common/sale')
const cache = require('@server/utils/cache')
const productModel = app.models.Products
const reviewModel = app.models.Reviews
const saleModel = app.models.Sales

const surfaceProductDetailsModel = app.models.SurfaceProductDetails
const reviewStarModel = app.models.ReviewStars

const commonEmailV1 = require('@@services/common/emailv1')

const arrayUtil = require('@ggj/utils/utils/array')

const httpUtil = app.utils.http
/**
 * Get detail data for specific product
 *
 * @param {Object} input
 * @return {Promise<Object>}
 */
async function index(input) {
  const userId = await app.utils.meta.asyncUserId(app, input.requestId)
  const productIds = arrayUtil.column(await saleModel.find({
    where: {
      userId,
      userType: 1,
      statusType: 1,
      salesType: 1,
    },
    order: 'id DESC',
    fields: {productId: true},
  }), 'productId')

  const page = parseInt(input.page || 1)
  const limit = parseInt(input.limit|| 0)
  const pagingInfo = app.utils.paging.getOffsetCondition(page, limit)
  const where = {
    id: {inq: productIds},
  }

  // If current user doesn't have any sale record, return empty
  if (!userId || !productIds.length) {
    return {}
  }

  let [total, products, reviews, res] = await Promise.all([
    productModel.count(where),
    productModel.find({
      where,
      order: 'id DESC',
      skip: pagingInfo.skip,
      limit: pagingInfo.limit,
      fields: {id: true, name: true},
    }),
    reviewModel.find({
      where: {
        userId,
        productId: {inq: productIds},
      },
      order: 'id DESC',
      limit: pagingInfo.limit,
      fields: {id: true, productId: true},
    }),
    [],
  ])

  // Indexing reviews and get response
  reviews = arrayUtil.index(reviews, 'productId')
  res = products.map(record => {
    return app.utils.object.filter({
      id: record.id,
      name: record.name,
      review: reviews[record['id']],
    })
  })

  return app.utils.paging.addPagingInformation(res, page, total, limit)
}

/**
 * Get detail review of current user for specific product
 *
 * @param id
 * @param input
 * @return {Promise<Object>}
 */
async function show(id, input) {
  if (!parseInt(id)) {
    return {}
  }

  const userId = await app.utils.meta.asyncUserId(app, input.requestId)
  const product = await productModel.findOne({
    where: {
      id: id,
    },
    fields: {id: true, typeId: true, name: true},
  })

  const [detailUrl, isPurchased, review] = await Promise.all([
    !product ? null : productUrlSv.productDetailUrls([product]),
    !product ? null : saleSv.getSaleByProductIds([product.id], userId, false, false, {id: true, payAt: true}),
    !product ? null : reviewModel.findOne({
      where: {
        userId,
        productId: product.id,
      },
      order: 'id DESC',
      fields: {id: true, reviewStars: true, title: true, content: true},
    }),
  ])

  let purchasedAt = null

  if ((isPurchased || []).length > 0) {
    purchasedAt = Math.max(...isPurchased.map(e => e.payAt))
  }

  return !product ? {} : app.utils.object.filter({
    id: !review ? null : review.id,
    productId: product.id,
    productName: product.name,
    productDetailUrl: detailUrl[product['id']] != '/' ? detailUrl[product['id']] : null,
    isPurchased: userId ? (isPurchased || []).length > 0 : 0,
    purchasedAt,
    reviewStars: !review ? null : review.reviewStars,
    reviewTitle: !review ? null : review.title,
    reviewContent: !review ? null : review.content,
  })
}

/**
 * Update/create specific review
 *
 * @param id
 * @param input
 * @return {Promise<Object>}
 */
async function update(id, input, req) {
  const userId = await app.utils.meta.asyncUserId(app, input.requestId)

  if (!userId || !id || Object.keys(input).length < 2) {
    return {}
  }

  const [sale, review] = await Promise.all([
    saleModel.findOne({
      where: {
        userId,
        productId: id,
        userType: 1,
        statusType: 1,
        salesType: 1,
      },
      fields: { id: true, typeId: true, developerUserId: true },
    }),
    reviewModel.findOne({
      where: {
        userId,
        productId: id,
      },
      order: 'id DESC',
      fields: { id: true },
    }),
  ])

  const reviewStars = parseInt(input.reviewStars || 0)
  const data = !sale ? null : {
    isValid: 1,
    userId,
    productId: id,
    typeId: sale.typeId,
    publishedAt: Date.now(),
    reviewStars: [1, 2, 3, 4, 5].includes(reviewStars) ? reviewStars : 0,
    title: input.reviewTitle || '',
    content: input.reviewContent || '',
  }

  if (!sale || !data) {
    return {}
  }

  await cache.remove(cache.fingerprint(`/api/v3/surface/review/product/${id}`, req.headers))

  // Sync data surface product detail & review star
  const response = !review ? await reviewModel.create(data) : await review.updateAttributes(data)

  const [reviewData, productDetail, productReviewStar] = await Promise.all([
    _caculateReviewData(id),
    _getSFProductDetail(id),
    _getReviewStar(id),
  ])

  if (!review) {
    commonEmailV1.sendByUserId(sale.developerUserId, {
      product_name: productDetail.productName || '',
      contents: input.reviewContent || '',
      product_id: id,
    }, 185)
    commonEmailV1.sendByUserId(userId, {
      product_name: productDetail.productName || '',
      contents: input.reviewContent || '',
      product_id: id,
    }, 186)
  }

  if(Object.keys(reviewData).length > 0) {

    if(!productReviewStar) {
      await reviewStarModel.create({
        isValid: 1,
        productId: id,
        reviewStars: reviewData.star,
        reviewCount: reviewData.count,
      })
      await httpUtil.get(`${process.env.API_V2_HOST_URL}surface_product_details/${id}/refresh`)

    } else {
      productDetail.reviewsStars = reviewData.star
      productDetail.reviewsCount = reviewData.count

      productReviewStar.reviewStars = reviewData.star
      productReviewStar.reviewCount = reviewData.count

      productDetail.save()
      productReviewStar.save()
    }
  }

  return response
}

/**
 * Get and caculate review data
 *
 * @param pId
 * @return {Promise<Object>}
 * @private
 */
async function _caculateReviewData(pId) {
  const data = await reviewModel.find({
    where: {
      isValid: 1,
      productId: pId,
    },
    fields: {reviewStars: true},
  })
  const count = data.length

  if(count == 0) {
    return {}
  }

  const totalStar = data.reduce((total, item) => total += parseInt(item.reviewStars), 0)

  return {
    count,
    star: parseInt(totalStar) / count,
  }
}

/**
 * Get surface product detail
 *
 * @param pId
 * @return {Promise<Object>}
 * @private
 */
async function _getSFProductDetail(pId) {
  return await surfaceProductDetailsModel.findOne({
    where: {
      isValid: 1,
      productId: pId,
    },
    fields: {id: true, productName: true},
  })
}

/**
 * Get review star
 *
 * @param pId
 * @return {Promise<Object>}
 * @private
 */
async function _getReviewStar(pId) {
  return await reviewStarModel.findOne({
    where: {
      isValid: 1,
      productId: pId,
    },
    fields: {id: true},
  })
}


module.exports = {
  index,
  show,
  update,
}
