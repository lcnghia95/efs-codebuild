// const home = require('@controllers/mypage/home/home')
// const message = require('@controllers/mypage/message/message')
// const download = require('@controllers/mypage/download/download')
// const member = require('@controllers/mypage/member/member')
const favorite = require('@controllers/mypage/favorite/favorite')
// const setting = require('@controllers/mypage/setting/setting')
// const bankAccount = require('@controllers/mypage/setting/bankAccount')
// const gift = require('@controllers/mypage/gift/gift')
// const withdrawal = require('@controllers/mypage/setting/withdrawal')
// const user = require('@controllers/mypage/setting/user')
// const affiliateVideo = require('@controllers/mypage/affiliate/widget/video')
// const affiliateBanner = require('@controllers/mypage/affiliate/widget/banner')
// const video = require('@controllers/mypage/video/video')
// const mt4 = require('@controllers/mypage/affiliate/widget/mt4')
// const serial = require('@controllers/mypage/serial/serial')

module.exports = function(server) {
  let router = server.loopback.Router()

  // // Common
  // router.get('/user', setting.information)

  // // Home
  // router.get('/banner', home.banner)
  // router.get('/notice', home.notice)
  // router.get('/message/new', home.message)
  // router.get('/notice/mailmagazine', home.mailmagazine)
  // router.get('/seller/contact/partner', home.partner)
  // router.get('/seller/contact/buyer', home.buyer)

  // //Download
  // router.get('/download', download.index)

  // //Member
  // router.post('/member/checkrss', member.checkRss)

  // // Message
  // router.get('/message', message.index)
  // router.get('/message/sent', message.sent)
  // router.get('/message/draft', message.draft)
  // router.get('/message/:id(\\d+)', message.show)

  // Favorite
  router.get('/favorite', favorite.favorite)

  // // Setting
  // router.get('/setting/user', setting.user)
  // router.get('/setting/user/subscribe', user.subscribe)
  // router.get('/setting/payment', bankAccount.index)
  // router.put('/setting/payment/:id(\\d+)', bankAccount.update)
  // router.post('/setting/unsubscribe', user.unsubscribe)
  // router.post('/setting/withdrawal', withdrawal.withdrawal)

  // //gifts
  // router.get('/gifts', gift.index)

  // // widgets
  // router.get('/affiliate/widgets/videos', affiliateVideo.index)
  // router.get('/affiliate/widgets/banner', affiliateBanner.index)
  // router.get('/affiliate/widgets/mt4/account', mt4.accounts)

  // // videos
  // router.get('/videos', video.index)
  // router.get('/videos/:id(\\d+)', video.show)
  // router.get('/videos/comments/:id(\\d+)', video.comment)
  // router.post('/videos/comments/:id(\\d+)', video.postComment)
  // router.delete('/videos/comments/:id(\\d+)', video.deleteComment)
  // router.get('/videos/schedule/:id(\\d+)', video.schedule)
  // router.get('/videos/setting', video.setting)
  // router.post('/videos/setting', video.postSetting)
  // router.get('/videos/:id(\\d+)/review', video.review)
  // router.post('/videos/:id(\\d+)/review', video.postReview)

  // // serial
  // router.get('/serial', serial.index)

  server.use('/api/v3/mypage', router)
}
