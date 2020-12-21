<template>
  <Spinner />
</template>

<script>
import i18n from '@@/lang/desktop/cart-index.json'
import title from '@@/../common/pages'
import { filterInt } from '@/utils/client/common'
import Spinner from '@@/../components/Spinner.vue'

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      Spinner,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('1'),
      }
    },
    mounted() {
      location.reload()
    },
    async asyncData({ app, redirect, params, req, res, store }) {
      if (req.headers['new-cart-enable'] == 'true') {
        const auxTag = req.query.auxTag
        let referer = req.headers.referer || ''
        // OAM-11049 in case redirect, it should sync cookie from fx-on at first
        if (referer.startsWith(process.env.FXON_URL)) {
          console.log('CART ADD re from fx-on')
          return
        }
        let data = await app.GoGoHTTP.post(`/api/v3/cart/add/${params.id}`, {auxTag:auxTag}),
          period = 30 * 24 * 60 * 1000,
          path = referer,
          savePath
        if (path.includes('/tools')) {
          savePath = '/tools'
        } else if (path.includes('/review/detail')) {
          savePath = '/review'
        } else if (path.includes('/finance/navi')) {
          savePath = '/finance/navi'
        } else if (path.includes('/finance/mailmagazine')) {
          savePath = '/finance/mailmagazine'
        } else if (path.includes('/re/')) {
          savePath = '/'
        } else {
          savePath = path.split('/')
          savePath = savePath.slice(3, savePath.length - 1)
          savePath = '/' + savePath.join('/')
          if (savePath === '/cart' || !savePath) {
            savePath = '/'
          }
        }
        res.cookie('savePath', savePath, {
          expires: new Date(Date.now() + period),
        })

        if (data.statusType) {
          redirect(302, '/cart')
        } else {
          if (data.error == 'cartError001') {
            redirect(302, `/cart/?e=${data.error}&u=/cart/add/${params.id}`)
          } else {
            if (data.error == 'cartError015') {
              // OAM-36597 Create function（Set product purchase restrictions）
              // error message will get from DB not i18n
              data.msg && res.cookie('cartErrorMsg', data.msg)
            }
            redirect(
              302,
              `/cart/?e=${data.error}${
                data.upperLimit ? '&limit=' + data.upperLimit : ''
              }`
            )
          }
        }
      } else {
        let path = req.headers['referer'] || '',
          cartUrl
        if (path.includes('/finance/salons')) {
          cartUrl = `${process.env.FXON_URL}/asp/adviserpay/input/?id=${
            params.id
          }`
        } else {
          cartUrl = `${process.env.FXON_URL}/asp/cart/add/?id=${params.id}`
        }
        if (!!req.cookies['llt'] && store.state.user.id) {
          redirect(cartUrl)
        } else {
          redirect(302, `/login?is_buyuser=1&u=${cartUrl}`)
        }
      }
      return {}
    },
  },
  title
)
export default obj
</script>
