const home = require('@controllers/mypage/home/home')
const message = require('@controllers/mypage/message/message')
const download = require('@controllers/mypage/download/download')
const myaccounts = require('@controllers/mypage/myaccounts/myaccounts')
const member = require('@controllers/mypage/member/member')
const favorite = require('@controllers/mypage/favorite/favorite')
const setting = require('@controllers/mypage/setting/setting')
const bankAccount = require('@controllers/mypage/setting/bankAccount')
const gift = require('@controllers/mypage/gift/gift')
const withdrawal = require('@controllers/mypage/setting/withdrawal')
const user = require('@controllers/mypage/setting/user')
const affiliateVideo = require('@controllers/mypage/affiliate/widget/video')
const affiliateBanner = require('@controllers/mypage/affiliate/widget/banner')
const affiliateGift = require('@controllers/mypage/affiliate/gift/gift')
const video = require('@controllers/mypage/video/video')
const mt4 = require('@controllers/mypage/affiliate/widget/mt4')
const serial = require('@controllers/mypage/serial/serial')
const site = require('@controllers/mypage/manage/site')
const affiliateSite = require('@controllers/mypage/manage/affiliateSite')
const mailmagazineThread = require('@controllers/mypage/mailmagazine/thread')
const common = require('@controllers/mypage/common')

module.exports = function (server) {
  const router = server.loopback.Router()

  // Common
  router.get('/user', setting.information)
  router.get('/pairs', common.pairs)

  // Home
  router.get('/banner', home.banner)
  router.get('/notice', home.notice)
  router.get('/message/new', home.message)
  router.get('/notice/mailmagazine', home.mailmagazine)
  router.get('/seller/contact/partner', home.partner)
  router.get('/seller/contact/buyer', home.buyer)

  // Download
  router.get('/download', download.index)

  // Myaccounts
  router.get('/myaccounts/purchased', myaccounts.index)
  router.get('/myaccounts/license', myaccounts.license)
  router.get('/myaccounts/notice/emails', myaccounts.getRealTradeEmails)
  router.get('/myaccounts/notice/accounts', myaccounts.getNotifyAccounts)
  router.post('/myaccounts/license', myaccounts.create)
  router.post('/myaccounts/update', myaccounts.update)
  router.post('/myaccounts/delete', myaccounts.deleteLicense)
  router.post('/myaccounts/magic-number/create', myaccounts.createMagicNumber)
  router.delete('/myaccounts/magic-number/:id(\\d+)', myaccounts.deleteMagicNumber)
  router.post('/myaccounts/magic-number/update', myaccounts.updateMagicNumber)
  router.post('/myaccounts/related-product/update', myaccounts.updateRelatedProducts)
  router.post('/myaccounts/notice/emails/edit', myaccounts.editRealTradeEmail)

  // Member
  router.post('/member/checkrss', member.checkRss)

  // Message
  router.get('/message', message.index)
  router.get('/message/sent', message.sent)
  router.get('/message/draft', message.draft)
  router.get('/message/:id(\\d+)', message.show)

  // Favorite
  router.get('/favorite', favorite.favorite)
  router.get('/favorite/also-bought', favorite.alsoBought)

  // Setting
  router.get('/setting/user', setting.user)
  router.get('/setting/user/subscribe', user.subscribe)
  router.get('/setting/payment', bankAccount.index)
  router.put('/setting/payment/:id(\\d+)', bankAccount.update)
  router.post('/setting/unsubscribe', user.unsubscribe)
  router.post('/setting/withdrawal', withdrawal.withdrawal)

  // gifts
  router.get('/gifts', gift.index)

  // widgets
  router.get('/affiliate/widgets/videos', affiliateVideo.index)
  router.get('/affiliate/widgets/banner', affiliateBanner.index)
  router.get('/affiliate/widgets/twoTier', affiliateBanner.indexTwoTier)
  router.get('/affiliate/widgets/tradestation', affiliateBanner.indexTradestation)
  router.get('/affiliate/widgets/mt4/account/:id(\\d+)', mt4.accounts)
  router.get('/affiliate/widgets/mt4/account/:accountId(\\d+)/magicNumber', mt4.magicNumber)

  // affiliate gifts
  router.get('/affiliate/gift/products/:id(\\d+)/:pr(\\d+)', affiliateGift.indexGiftPr)

  // videos
  router.get('/videos', video.index)
  router.get('/videos/:id(\\d+)', video.show)
  router.get('/videos/comments/:id(\\d+)', video.comment)
  router.post('/videos/comments/:id(\\d+)', video.postComment)
  router.delete('/videos/comments/:id(\\d+)', video.deleteComment)
  router.get('/videos/schedule/:id(\\d+)', video.schedule)
  router.get('/videos/setting', video.setting)
  router.post('/videos/setting', video.postSetting)
  router.get('/videos/:id(\\d+)/review', video.review)
  router.post('/videos/:id(\\d+)/review', video.postReview)

  // serial
  router.get('/serial', serial.index)

  // manage
  router.get('/manage/sites', site.sites)
  router.put('/manage/affiliate-sites/:id(\\d+)', affiliateSite.update)
  router.put('/manage/affiliate-sites/', affiliateSite.bulkUpdate)

  // mailmagazine for buyer
  // Threads
  router.get('/mailmagazine/:id(\\d+)/threads/:threadId(\\d+)', mailmagazineThread.index)
  router.post('/mailmagazine/:id(\\d+)/threads/:threadId(\\d+)', mailmagazineThread.store)
  router.get('/mailmagazine/:id(\\d+)/threads/:threadId(\\d+)/sub', mailmagazineThread.sub)

  server.use('/api/v3/mypage', router)
}
