const app = require('@server/server')

//models
const systemtradeChartColumnModel = app.models.SystemtradeChartColumn

const NamesMap = {
  '1~4999円': 3,
  '5000~9999円': 3,
  '10000~14999円': 2,
  '15000~19999円': 2,
  '20000~24999円': 1,
  '25000~29999円': 1,
  '30000~34999円': 1,
  '35000~39999円': 1,
  '40000~44999円': 1,
  '45000~49999円': 1,
  '50000~59999円': 0,
  '60000~69999円': 0,
  '70000~79999円': 0,
  '80000~89999円': 0,
  '90000~99999円': 0,
  '100000円以上': 0,
}

const PlatformsMap = {
  4: 0,
  2: 1,
  3: 2,
}

const StockCategoryId = 3
const PlatformIds = [4, 2, 3]

/**
 * index column Chart
 *
 * @return {Array}
 * @public
 */
async function index() {
  let columns = await systemtradeChartColumnModel.find({
    where: {
      isValid: 1,
      categoryId: StockCategoryId,
      platformId: {
        inq: PlatformIds
      }
    },
    fields: {
      name: true,
      value: true,
      platformId: true,
    }
  })

  return columns.reduce((result, item) => {
    let nameKey = NamesMap[item.name],
      platformKey = PlatformsMap[item.platformId]
    if (nameKey === undefined) {
      return result
    }
    result[platformKey].data[nameKey] += item.value
    return result
  }, [
    {
      name: 'システムトレードの達人',
      data: [0, 0, 0, 0]
    },
    {
      name: 'マルチチャート',
      data: [0, 0, 0, 0]
    },
    {
      name: 'TradeStation',
      data: [0, 0, 0, 0]
    },
  ])
}

module.exports = {
  index,
}
