/**
 * ads of stocks
 *
 * @return {Array}
 * @public
 */
async function index() {
  let fxonHost = process.env.FXON_HOST_URL,
    gogoHost = process.env.GOGO_HOST_URL,
    randAds = [
      [
        fxonHost + 'kabu/include/img/banner/banner_tradestation_lp.jpg',
        fxonHost + 'lp/detail/tradestation-lp/',
        'TradeStationストラテジーfx-onで取扱い開始'
      ],
      [
        fxonHost + 'kabu/include/img/banner/banner_tatujin.png',
        fxonHost + 'lp/sys-tatsu/',
        'システムトレードの達人ストラテジーfx-onで取扱い開始'
      ],
    ],
    ads = [
      [
        fxonHost + 'kabu/include/img/banner/banner_kabu_induction_670x90.png',
        gogoHost + 'systemtrade/search/?categoryId=3&month=3&sort=-profitTotal&page=1'
      ],
      [
        fxonHost + 'systemtrade/include/img/common/salon_lp_670x90.jpg',
        fxonHost + 'lp/detail/melmaga/?t&la'
      ],
      [
        fxonHost + 'systemtrade/include/img/common/salon_lp_670x90.jpg',
        fxonHost + 'lp/detail/melmaga/?t&la'
      ],
    ],
    rightAds = [
      [
        fxonHost + 'kabu/include/img/banner/systre_tatujinn.png',
        fxonHost + 'ebooks/detail/?id=11361'
      ],
      [
        fxonHost + 'kabu/include/img/banner/easy_language.png',
        fxonHost + 'ebooks/detail/?id=10174'
      ],
      [
        fxonHost + 'kabu/include/img/banner/banner_multichart.png',
        fxonHost + 'ebooks/detail/?id=6301'
      ],
      [
        fxonHost + 'kabu/include/img/banner/banner_multichart2.png',
        fxonHost + 'ebooks/detail/?id=6302'
      ],
      [
        fxonHost + 'kabu/include/img/banner/banner_multichart3.png',
        fxonHost + 'ebooks/detail/?id=6305'
      ],
    ]

  return {
    randAds: randAds[Math.random() > 0.5 ? 0 : 1],
    ads,
    rightAds
  }
}

module.exports = {
  index,
}
