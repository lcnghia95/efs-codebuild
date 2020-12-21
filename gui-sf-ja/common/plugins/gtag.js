export default function() {
  // ignore if bot or not production mode
  if (/(Chrome-Lighthouse|bot)/i.test(navigator.userAgent) ||
    process.env.NODE_ENV !== 'production') {
    window.gtag = function() {
      console.log(JSON.stringify(arguments[0]), JSON.stringify(arguments[1]), JSON.stringify(arguments[2]))
    }
    return
  }

  // https://developers.google.com/analytics/devguides/collection/gtagjs/events#send_events
  const GA_MEASUREMENT_ID = 'UA-44365842-4'
  let a = document.createElement('script'),
    m = document.getElementsByTagName('script')[0]
  a.async = 1
  a.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  m.parentNode.insertBefore(a, m)

  window.dataLayer = window.dataLayer || []
  window.gtag = function() {window.dataLayer.push(arguments)}
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID)
}
