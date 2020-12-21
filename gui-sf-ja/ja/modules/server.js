const { isLoadMobile } = require('../desktop/utils/client/common')

function create(app, nuxtMobile, nuxtDesktop) {
  require('@ggj/utils/utils/tracer')
  // allow goes /cart/confirm', '/cart/complete' '/cart/add/:id' by POST method
  app.post(['/cart/confirm', '/cart/cancel'], (req, res) => {
    try {
      if (isLoadMobile(req)) {
        nuxtMobile.render(req, res)
      } else {
        nuxtDesktop.render(req, res)
      }
    } catch (e) {
      console.error(e)
      res.sendStatus(500)
    }
  })
  app.get(['/cart/confirm', '/cart/cancel'], (req, res) => {
    res.redirect('/cart')
  })
  app.get('/health', (req, res) => res.sendStatus(200))
  app.use((req, res) => {
    try {
      if (isLoadMobile(req)) {
        nuxtMobile.render(req, res)
      } else {
        nuxtDesktop.render(req, res)
      }
    } catch (e) {
      console.error(e)
      res.sendStatus(500)
    }
  })
}

module.exports = create
