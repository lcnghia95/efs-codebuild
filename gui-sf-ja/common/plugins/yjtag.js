export default function() {
  // ignore if bot or not production mode
  if (/(Chrome-Lighthouse|bot)/i.test(navigator.userAgent) ||
    process.env.NODE_ENV !== 'production') {
    window.ytag = function() {
      console.log('---yjTag---')
    }
    return
  }

  (function () {
    var tagjs = document.createElement("script")
    var s = document.getElementsByTagName("script")[0]
    tagjs.async = true
    tagjs.src = "//s.yjtag.jp/tag.js#site=AYrNoNg"
    s.parentNode.insertBefore(tagjs, s)
  }())
}
