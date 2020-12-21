const app = require('@server/server')

// models
const systemtradeChartColumnModel = app.models.SystemtradeChartColumn

const NamesMap = {
  '1~4999 円': 3,
  '5000~9999 円': 3,
  '10000~14999 円': 2,
  '15000~19999 円': 2,
  '20000~24999 円': 1,
  '25000~29999 円': 1,
  '30000~34999 円': 1,
  '35000~39999 円': 1,
  '40000~44999 円': 1,
  '45000~49999 円': 1,
  '50000~59999 円': 0,
  '60000~69999 円': 0,
  '70000~79999 円': 0,
  '80000~89999 円': 0,
  '90000~99999 円': 0,
  '100000 円以上': 0,
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
  const columns = await systemtradeChartColumnModel.find({
    where: {
      isValid: 1,
      categoryId: StockCategoryId,
      platformId: {
        inq: PlatformIds,
      },
    },
    fields: {
      name: true,
      value: true,
      platformId: true,
    },
  })

  return columns.reduce((result, item) => {
    const nameKey = NamesMap[item.name]
      const platformKey = PlatformsMap[item.platformId]
    if (nameKey === undefined) {
      return result
    }
    result[platformKey].data[nameKey] += item.value
    return result
  }, [
    {
      name: 'システムトレードの達人',
      data: [0, 0, 0, 0],
    },
    {
      name: 'マルチチャート',
      data: [0, 0, 0, 0],
    },
    {
      name: 'TradeStation',
      data: [0, 0, 0, 0],
    },
  ])
}

module.exports = {
  index,
}
