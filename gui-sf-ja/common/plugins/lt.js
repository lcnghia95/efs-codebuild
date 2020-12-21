export default function() {
  // ignore if bot or not production mode
  if (/(Chrome-Lighthouse|bot)/i.test(navigator.userAgent) ||
    process.env.NODE_ENV !== 'production') {
      console.log('---LINE Tag---')
      window._lt = function() {
        console.log(JSON.stringify(arguments[0]), JSON.stringify(arguments[1]), JSON.stringify(arguments[2]))
      }
    return
  }


  (function(g,d,o){
    g._ltq=g._ltq||[];g._lt=g._lt||function(){g._ltq.push(arguments)}
    var h=location.protocol==='https:'?'https://d.line-scdn.net':'http://d.line-cdn.net'
    var s=d.createElement('script');s.async=1
    s.src=o||h+'/n/line_tag/public/release/v1/lt.js'
    var t=d.getElementsByTagName('script')[0];t.parentNode.insertBefore(s,t)
  })(window, document)
  window._lt('init', {
    customerType: 'lap',
    tagId: '127144fe-a505-481b-a8ef-02f938eecf5c'
  })
  window._lt('send', 'pv', ['127144fe-a505-481b-a8ef-02f938eecf5c'])
}
