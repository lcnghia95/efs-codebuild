
//        TODO phat tran: REMOVE BELOW FUNCTION LATER!

const app = require('@server/server')

const format = require('date-fns/format')

const queryUtil = require('@@server/utils/query')
const timeUtil = require('@@server/utils/time')
const pagingUtil = require('@@server/utils/paging')

const clickModel = app.models.Click

const MINIMUM_ID = 1e7


async function clickHandler(req, res) {
  const fields = queryUtil.fields(
      'imageCategoryId,masterId,siteId,' +
      'clickedAt,affiliateUserId',
    )
    const input = req.query
    const start = input.start || `${format(new Date(), 'YYYY-MM-DD')} 00:00:00`
    const end = input.end || `${format(new Date(), 'YYYY-MM-DD')} 23:59:59`
    const limit = input.limit || 500
    const page = input.page || 1
    const offset = pagingUtil.getOffsetCondition(page, limit)

  try {
    const data = await clickModel.find({
      where: {
        id: {gte: MINIMUM_ID}, // TODO Long - hard code here (only using for batch click_daily) - refactor later.
        masterId: {gte: 1},
        affiliateUserId: {gte: 1},
        and: [
          {
            clickedAt: {gte: timeUtil.utcDate(start)},
          },
          {
            clickedAt: {lte: timeUtil.utcDate(end)},
          },
        ],
      },
      fields,
      limit: offset.limit,
      skip: offset.skip,
      order: 'clickedAt ASC',
    })
    res.json(_objects(data))
  } catch (e) {
    console.error(e)
    res.sendStatus(e)
  }
}

function _objects(objs) {
  return objs.map(obj => {
    return {
      clicked_at: obj.clickedAt,
      affiliate_user_id: obj.affiliateUserId,
      site_id: obj.siteId,
      image_category_id: obj.imageCategoryId,
      master_id: obj.masterId,
    }
  })
}

module.exports = {
  clickHandler,
}
