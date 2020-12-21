export default function() {
  let d = new Date(), day = d.getDay(),
    // we only calculate on JP time
    hour = d.getUTCHours() + 9
  // ignore if bot or not production mode
  if (/(Chrome-Lighthouse|bot)/i.test(navigator.userAgent) || !(day > 0 && day < 6 && hour > 9 && hour < 19)) {
    return
  }

  let a = document.createElement('script'),
    m = document.getElementsByTagName('script')[0]
  a.async = 1
  a.src = 'https://embed.small.chat/T8WCY8AD7G010XNC7CJE.js'
  m.parentNode.insertBefore(a, m)
}
