const app = require('@server/server')

//models
const advertiseBannersModel = app.models.AdvertiseBanners

/**
 * index systemtrade banners and sliders
 *
 * @param {Void}
 * @return {Array}
 * @public
 */
async function index() {
  let now = Date.now()
  return await advertiseBannersModel.find({
    where: {
      isValid: 1,
      servicePath: '/systemtrade',
      startedAt: {
        lt: now
      },
      endedAt: {
        gt: now
      },
    },
    fields: {
      bannerUrl: true,
      landingPageUrl: true
    },
  })
}

function sideBanner() {
  let fxhost = process.env.FXON_HOST_URL
  return [
    [
      fxhost + 'include/img/common/sub/banner/20171023_FXTF_banner300_200.png',
      fxhost + 're/?i=tEr7FTvNhsdEtFW9SNSZuPvyoaAI%2BiggDasxRLxOmO8'
    ],
    [
      fxhost + 'include/img/common/sub/banner/winter_campaign_300×200.jpg?s',
      fxhost + 'lecture/duty.php?c=46&i=14207&sb'
    ],
    [
      fxhost + 'include/img/common/sub/banner/fxon_campaign_v1_300x200.jpg?t',
      fxhost + 'campaign/?p=2'
    ],
    [
      fxhost + 'include/img/common/sub/banner/20171023_FXTF_banner300_200.png',
      fxhost + 're/?i=tEr7FTvNhsdEtFW9SNSZuPvyoaAI%2BiggDasxRLxOmO8'
    ],
    [
      fxhost + 'include/img/common/sub/banner/winter_campaign_300×200.jpg?s',
      fxhost + 'lecture/duty.php?c=46&i=14207&sb'
    ],
    [
      fxhost + 'include/img/common/sub/banner/fxon_campaign_v1_300x200.jpg?t',
      fxhost + 'campaign/?p=2'
    ],
    [
      fxhost + 'include/img/common/sub/banner/20171023_FXTF_banner300_200.png',
      fxhost + 're/?i=tEr7FTvNhsdEtFW9SNSZuPvyoaAI%2BiggDasxRLxOmO8'
    ],
    [
      fxhost + 'include/img/common/sub/banner/winter_campaign_300×200.jpg?s',
      fxhost + 'lecture/duty.php?c=46&i=14207&sb'
    ],
    [
      fxhost + 'include/img/common/sub/banner/fxon_campaign_v1_300x200.jpg?t',
      fxhost + 'campaign/?p=2'
    ]
  ]
}

module.exports = {
  index,
  sideBanner,
}
