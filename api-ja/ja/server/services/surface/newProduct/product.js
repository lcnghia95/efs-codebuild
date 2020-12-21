const app = require('@server/server')
const sfProduct = require('@services/common/surfaceProduct')
const commonRecentProductModel = app.models.CommonRecentProducts
const commonRankingReviewCountModel= app.models.CommonRankingReviewCount
const articlesModel= app.models.Articles
const utils = app.utils

const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Get index data for surface new products
 *
 * @param input
 * @returns {Promise<Object>}
 */
async function index(input) {
  const fields = 'typeId,categories,productId,productName,price,isSpecialDiscount,specialDiscountPrice'
  const page = parseInt(input.page || 1)
  const limit = input.limit || 100
  const keywords = input.keywords || null
  const offset = utils.paging.getOffsetCondition(page, limit)
  const where = keywords ? {productName: {like: `%${keywords}%`}} : {}

  let [total, data] = await Promise.all([
    commonRecentProductModel.count(where),
    commonRecentProductModel.find({
      where,
      fields: utils.query.fields(fields),
      limit,
      skip: offset.skip,
    }),
  ]),
    articles = []

  const articleProductIds = data.filter(e => e.typeId == 3).map(e => e.productId)

  if ((articleProductIds || []).length) {
    articles = await articlesModel.find({
      where: {
        productId: {
          inq: articleProductIds,
        },
      },
      fields: {
        id: true,
        productId: true,
      },
    })
    articles = arrayUtil.index(articles || [], 'productId')
  }

  data = await sfProduct.sfProductObjects(data)

  if (Object.keys(articles).length) {
    data = data.map(item => {
      if (articles[item.id]) {
        item.articlesId = articles[item.id].id || 0
      }
      return item
    })
  }

  return utils.paging.addPagingInformation(
    data,
    page,
    total,
    limit,
  )
}

/**
 * Get ranking data for ea
 *
 * @param input
 * @return {Promise<Object>}
 */
async function ea(input) {
  const fields = 'typeId,categories,productId,productName,price,isSpecialDiscount'
    + ',specialDiscountPrice,platformId,reviewsStars'
    + ',reviewsCount,accountCurrencyType'
  const page = parseInt(input.page || 1)
  const offset = utils.paging.getOffsetCondition(page, 10)
  const where = {
    typeId: 1,
    categories: 1,
  }
  const [total, data] = await Promise.all([
    commonRankingReviewCountModel.count(where),
    commonRankingReviewCountModel.find({
      where,
      fields: utils.query.fields(fields),
      limit: 10,
      skip: offset.skip,
      order: 'reviewsCount DESC',
    }),
  ])

  return utils.paging.addPagingInformation(
    await sfProduct.sfProductObjects(data),
    page,
    total,
    10,
  )
}

/**
 * Get ranking data for ebook
 *
 * @param input
 * @return {Promise<Object>}
 */
async function ebook(input) {
  const fields = 'typeId,categories,productId,productName,price,isSpecialDiscount'
    + ',specialDiscountPrice,platformId,reviewsStars'
    + ',reviewsCount,accountCurrencyType'
  const page = parseInt(input.page || 1)
  const offset = utils.paging.getOffsetCondition(page, 10)
  const where = {
    typeId: 6,
  }
  const [total, data] = await Promise.all([
    commonRankingReviewCountModel.count(where),
    commonRankingReviewCountModel.find({
      where,
      fields: utils.query.fields(fields),
      limit: 10,
      skip: offset.skip,
      order: 'reviewsCount DESC',
    }),
  ])

  return utils.paging.addPagingInformation(
    await sfProduct.sfProductObjects(data),
    page,
    total,
    10,
  )
}

module.exports = {
  index,
  ea,
  ebook,
}
