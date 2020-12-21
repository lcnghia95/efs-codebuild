import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getCookie } from '@/utils/client/common'

Vue.use(VueI18n)

export default ({ app, req, res }) => {
  // Set `i18n` instance on `app`
  // This way we can use it in middleware and pages `asyncData`/`fetch`

  let cookieLang = process.browser ?
    getCookie('lang', document.cookie) :
    (req.cookies['lang']),
    lang
  if (process.browser) {
    lang = ['en', 'th', 'ch', 'tw', 'vi'].includes(cookieLang) ?
      cookieLang :
      'ja'
  } else {
    /**
     * At server side, the priority to get current lang
     *   Get from URL
     *   Get from cookie
     */
    lang = req.path.split('/')[1]
    let pou = req._parsedOriginalUrl || {},
    url = pou.pathname || req.path
    if (['en', 'th', 'vi'].includes(lang)) {
      // correct cookie in case it does not exist
      if (cookieLang != lang) {
        res.cookie('lang', lang, {
          path: '/',
          expires: new Date(Date.now() + 2592000000), // 30 days
        })
      }
    } else {
      lang = ['en', 'th', 'ch', 'tw', 'vi'].includes(cookieLang) ?
        cookieLang :
        'ja'
    }
  }

  app.i18n = new VueI18n({
    locale: lang,
    fallbackLocale: 'ja',
    silentTranslationWarn: true,
  })
}