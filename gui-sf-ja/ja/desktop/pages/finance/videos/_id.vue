<template>
  <div class="pos-rel">
    <info-bar-top02 :purchased="purchased" />
    <FreeDetail
      v-if="!dataVideo.cartInfo"
      :data-video="dataVideo"
      :related="related"
    />
    <FeeDetail
      v-else
      :data-video="dataVideo"
      :others="others"
      :recommend="recommend"
    />
  </div>
</template>

<script>
import InfoBarTop02 from '@/components/navi/InfoBarTop02.vue'
import titleI18n from '@@/lang/common/video-title.json'
import title from '@@/../common/pages'
import authorMeta from '@@/../common/pages/author.js'
import FreeDetail from '@/components/finance/video/FreeDetail.vue'
import FeeDetail from '@/components/finance/video/FeeDetail.vue'
import { editCss, convertToFxonHost, filterInt } from '@/utils/client/common'
import { trackingVideoView } from '@@/../common/js/ga/ecom-enhance'
import generateLDJson from '@@/../common/js/generateLDJson'

const obj = Object.assign(
  {
    components: {
      InfoBarTop02,
      FreeDetail,
      FeeDetail,
    },
    mounted() {
      window.productId = (this.dataVideo.cartInfo || {}).productId
      trackingVideoView(this.dataVideo)
    },
    methods: {
      descriptionTemplate() {
        return this.description
      },
      keywordsTemplate() {
        return `${this.localeHead.keywords},${this.keywordsChunk}`
      },
    },
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    async asyncData({ app, params, error, req, store }) {
      let locale = app.i18n.locale,
        title = titleI18n[locale].title,
        [dataVideo, purchased] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/ggjtv/${params.id}`),
          app.GoGoHTTP.get(`/api/v3/surface/ggjtv/purchased`),
        ]),
        related = [],
        others = [],
        recommend = [],
        titleChunk,
        imgUrl,
        currentUrl,
        description = '',
        commuTotal = 0

      if (!dataVideo || !Object.keys(dataVideo).length) {
        return error({ statusCode: 404 })
      }
      if (dataVideo.cartInfo && dataVideo.cartInfo.productId) {
        let [_others, _recommend, _commuTotal] = await Promise.all([
          app.GoGoHTTP.get(
            `/api/v3/surface/ggjtv/${params.id}/others?uId=${dataVideo.userId}&pId=${dataVideo.productId}`
          ),
          app.GoGoHTTP.get(`/api/v3/surface/ggjtv/${params.id}/recommend`),
          app.GoGoHTTP.get(
            `/api/v3/surface/products/communities/${dataVideo.productId}/count`
          ),
        ])
        others = _others
        recommend = _recommend
        commuTotal = _commuTotal
      } else {
        related = await app.GoGoHTTP.get(
          `/api/v3/surface/ggjtv/${params.id}/related`
        )
      }
      dataVideo.commuTotal = commuTotal
      if (process.browser) {
        currentUrl = window.location.href
      } else {
        currentUrl = process.env.GOGO_URL + req.originalUrl
      }
      titleChunk = dataVideo.title
      imgUrl = process.env.GOGO_URL + '/img/products/' + dataVideo.productId
      dataVideo.outline = convertToFxonHost(dataVideo.outline)
      if (
        dataVideo.outline &&
        dataVideo.outline.indexOf('<style type="text/css">') !== -1
      ) {
        dataVideo.outline = editCss(dataVideo.outline, '.outline-IbBKtrbLMt')
      }
      store.commit('cart/setInfo', {
        info: dataVideo.cartInfo,
        productStatus: dataVideo.status,
        isPassword: dataVideo.isPassword,
      })
      store.commit('pushBC', {
        name: dataVideo.title,
        target: { name: 'finance-videos-id', params: params },
      })

      description = (dataVideo.content || '')
        .replace(/(&lt;)/gi, '<')
        .replace(/(&gt;)/gi, '>')
        .replace(/(<([^>]+)>)/gi, '')
        .substr(0, 300)

      const {
        cartInfo: { price, status } = { price: 0, status: 0 },
        review: { count, stars } = {},
      } = dataVideo
      return {
        dataVideo,
        purchased,
        related,
        others,
        recommend,
        titleChunk,
        description,
        keywordsChunk: dataVideo.title,
        localeHead: titleI18n[locale] || titleI18n['ja'],
        meta: [
          {
            name: 'og:site_name',
            content: 'GogoJungle',
            hid: 'og:site_name',
          },
          {
            name: 'og:type',
            content: 'website',
            hid: 'og:type',
          },
          {
            name: 'og:title',
            content: `${titleChunk} - ${title}`,
            hid: 'og:title',
          },
          {
            name: 'og:description',
            content: description,
            hid: 'og:description',
          },
          {
            name: 'og:url',
            content: currentUrl,
            hid: 'og:url',
          },
          {
            name: 'og:image',
            content: imgUrl,
            hid: 'og:image',
          },
          authorMeta,
        ],
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance/videos/${params.id}`,
          },
        ],
        jsonLDTemplate: generateLDJson({
          title: dataVideo.productName,
          id: params.id,
          description: dataVideo.description || dataVideo.productName,
          url: `${process.env.GOGO_URL}/finance/videos/${params.id}`,
          image_link: imgUrl,
          product_type: 5,
          status,
          price,
          count,
          rate: stars,
        }),
      }
    },
  },
  title
)
export default obj
</script>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>