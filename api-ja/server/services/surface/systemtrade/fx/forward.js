const app = require('@server/server')
const sprintf = require('sprintf-js').sprintf
const {
  count,
  excuteQuery,
} = require('@@server/utils/model')

// models
const fxonInfoProductModel = app.models.FxonInfoProduct
const pagingUtil = require('@ggj/utils/utils/paging')

/**
 * Get data for forwards
 *
 * @param pId
 * @param oldUId
 * @returns {Promise<void>}
 */
async function getDataPage(pId, input = [], oldUId = 0) {
  if (!oldUId) {
    oldUId = await fxonInfoProductModel.findOne({
      where: {
        Id: pId,
      },
      fields: {
        DevUserId: true,
      },
    })

    oldUId = oldUId ? oldUId.DevUserId : 0
  }

  const table = `si_${pId}_${sprintf('%04d', oldUId)}_0000`
  const page = (input.page || 1)
  const limit = (parseInt(input.limit) || 30)
  const offset = (page - 1) * limit

  let sql = ''
  sql += ' SELECT IsOpen,CheckDate,Pair,Position,EntryOpen,OrderOpen,ReverseOpen,CloseDate,EntryClose,OrderClose'
  sql += ',ReverseClose,Size,Commision,Taxes,Swap,ProfitTotal*1 as ProfitTotal,ProfitTotalSum*1 as ProfitTotalSum,OperationType,Profit'
  sql += ` FROM ${table}`
  sql += ' WHERE (IsOpen=1) OR (EntryClose!=0)'
  sql += ' ORDER BY IsOpen DESC,CloseDate DESC,CheckDate DESC,TicketID DESC'

  if (input.limit != 0) {
    sql += ` LIMIT ${limit}`
  }
  if (offset) {
    sql += ` offset ${offset}`
  }

  try {
    const [total, data] = await Promise.all([
      count('fx_system', table, {
        where: {
          or: [{
            IsOpen: 1,
          }, {
            EntryClose: {
              neq: 0,
            },
          }],
        },
        fields: {
          ID: true,
        },
      }),
      excuteQuery('fx_system', sql),
    ])
    return pagingUtil.addPagingInformation(data || [], page, total, limit)
  } catch (e) {
    if (e.code !== 'ER_NO_SUCH_TABLE') {
      throw e
    }
  } 

  return {data: []}
}

module.exports = {
  getDataPage,
}