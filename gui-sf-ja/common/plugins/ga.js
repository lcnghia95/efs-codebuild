/* eslint-disable */
export default ({ app }) => {
  if (process.env.NODE_ENV !== 'production') {
    window.ga = function(){}
    return
  }
  if (/(Chrome-Lighthouse|bot)/i.test(navigator.userAgent)) {
    window.ga = function(){}
    return
  }
  /*
  ** Include Google Analytics Script
  */
  ;(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r
    ;(i[r] =
      i[r] ||
      function() {
        ;(i[r].q = i[r].q || []).push(arguments)
      }),
      (i[r].l = 1 * new Date())
    ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
    a.async = 1
    a.src = g
    m.parentNode.insertBefore(a, m)
  })(
    window,
    document,
    'script',
    'https://www.google-analytics.com/analytics.js',
    'ga'
  )

  ga('create', 'UA-44365842-4', 'auto')
  app.router.afterEach((to, from) => {
    let path = to.fullPath
    if (path.startsWith('/cart')) {
      if (Object.keys(to.query).length) {
        path += '&lang=' + app.i18n.locale 
      } else {
        path += '?lang=' + app.i18n.locale 
      }
    }
    ga('set', 'page', path)
    ga('send', 'pageview')
  })
}
/* eslint-enable */
