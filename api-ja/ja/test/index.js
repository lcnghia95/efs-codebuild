const v3Server = 'http://localhost:7990'
const mpServer = 'http://localhost:8000'
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
// const assert = chai.assert
const pIds = [7650, 8812, 9154, 8592, 10520, 8697, 10340, 8955, 14150, 14359]
const invalPIds = [-10, 0, 7651, 1000000]
const cases = ['show', 'sample', 'threads', 'related']

chai.use(chaiHttp)

function cleanedData(data) {
  const ignoreData = [
    'date',
    'start',
    'reservedStart',
    'userUrl',
    'id',
    'profileImg',
    'isFavorite',
    'url'
  ]
  const fixedData = [
    'id',
    'productId'
  ]

  Object.keys(data).forEach(k => {
    // recursive if data[k] is dictionary, ex: {foo: bar}
    if (typeof data[k] === 'object' && data[k] !== null) {
      return cleanedData(data[k])
    }

    if (ignoreData.includes(k)) {
      delete data[k]
    }

    if (fixedData.includes(k)) {
      data[k] = parseInt(data[k])
    }
  })


  return data
}

cases.forEach(cs => {
  describe(`Test ${cs} function`, function() {
    let tailUrl = cs == 'show' ? '' : cs
    for (let i in pIds) {
      it('should equal to mypage response', async () => {
        const v3_res = await chai.request(v3Server)
          .get(`/api/v3/surface/salons/${pIds[i]}/${tailUrl}`)

        const mp_res = await chai.request(mpServer)
          .get(`/api/surface/salons/${pIds[i]}/${tailUrl}`)

        expect(v3_res).to.have.status(200)
        expect(cleanedData(v3_res.body)).to.deep.equal(cleanedData(mp_res.body))
      }).timeout(10000)
    }

    for (let i in invalPIds) {
      it('should return {} if pId is invalid', async () => {
        const v3_res = await chai.request(v3Server)
          .get(`/api/v3/surface/salons/${invalPIds[i]}/${tailUrl}`)
        expect(v3_res).to.have.status(200)
        expect(v3_res.body).to.deep.equal({})
      }).timeout(5000)
    }
  })
})
