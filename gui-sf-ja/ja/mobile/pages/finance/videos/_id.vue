<template>
  <div>
    <FreeDetail
      v-if="!dataVideo.cartInfo"
      :data-video="dataVideo"
      :purchased="purchased"
      @onLoadMore="onLoadMoreHandler"
      :related="related"
    />
    <FeeDetail
      v-else
      :data-video="dataVideo"
      :purchased="purchased"
      @onLoadMore="onLoadMoreHandler"
      :others="others"
      :recommend="recommend"
    />
  </div>
</template>

<script>
import FreeDetail from '@/components/finance/videos/FreeDetail.vue'
import FeeDetail from '@/components/finance/videos/FeeDetail.vue'
import title from '@@/../common/pages'
import titleI18n from '@@/lang/common/video-title.json'
import authorMeta from '@@/../common/pages/author.js'
import { filterInt, convertToFxonHost, editCss } from '@/utils/client/common'
import {trackingVideoView} from '@@/../common/js/ga/ecom-enhance'
import generateLDJson from '@@/../common/js/generateLDJson'

const obj = Object.assign({
  validate({ params }) {
    return !isNaN(filterInt(params.id))
  },
  components: {
    FreeDetail,
    FeeDetail,
  },
  mounted() {
    window.productId = (this.dataVideo.cartInfo || {}).productId
    trackingVideoView(this.dataVideo)
  },
  async asyncData({app, params, error, store, req}) {
    let [dataVideo, purchased] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/ggjtv/${params.id}`),
          app.GoGoHTTP.get(`/api/v3/surface/ggjtv/purchased`),
        ]),
        related = [],
        others = [],
        recommend = [],
        commuTotal = 0,
        description = (dataVideo.content || '')
          .replace(/(&lt;)/gi, '<')
          .replace(/(&gt;)/gi, '>')
          .replace(/(<([^>]+)>)/gi, '')
          .substr(0, 300),
        locale = app.i18n.locale,
        title = titleI18n[locale].title,
        titleChunk = dataVideo.title,
        currentUrl = process.env.GOGO_URL + req.originalUrl,
        imgUrl = process.env.GOGO_URL + '/img/products/' + dataVideo.productId
    
    if (!dataVideo || !Object.keys(dataVideo).length) {
      return error({ statusCode: 404 })
    }
    if (dataVideo.cartInfo && dataVideo.cartInfo.productId) {
        let [_others, _recommend, _commuTotal] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/ggjtv/${params.id}/others`, {
              params: {
                uId: dataVideo.userId,
                pId: dataVideo.productId,
                limit: 3
              }
            }
          ),
          app.GoGoHTTP.get(`/api/v3/surface/ggjtv/${params.id}/recommend`, {
              params: {
                limit: 0,
              }
            }),
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
    dataVideo.outline = convertToFxonHost(dataVideo.outline)
    dataVideo.description = description
    dataVideo.commuTotal = commuTotal
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
    const {
      cartInfo: { price, status } = {},
      review: { count, stars } = {},
    } = dataVideo
    return {
      id: params.id,
      commuTotal,
      dataVideo,
      purchased,
      related,
      others,
      recommend,
      description,
      localeHead: titleI18n[locale] || titleI18n['ja'],
      titleChunk,
      keywordsChunk: dataVideo.title,
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
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/finance/videos/${params.id}`,
        },
        authorMeta,
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
  methods: {
    onLoadMoreHandler(type, page) {
      /*
      * type: ('related')
      * page: Number
      */
      if(type == 'related') {
        this.$children[0].isLoading = true
        this.GoGoHTTP.get(`/api/v3/surface/ggjtv/${this.id}/related`, {
          params: { page }
        }).then(related => {
          this.$children[0].isLoading = false
          this.related = this.related.concat(related)
        })
      }
    },
    descriptionTemplate() {
      return this.description
    },
    keywordsTemplate() {
      return `${this.localeHead.keywords},${this.keywordsChunk}`
    },
  },
}, title)
export default obj
</script>

<style lang="scss">
#search-bar-header {
  display: none;
}
#menu-cls {
  display: none;
}
</style>