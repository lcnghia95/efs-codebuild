<template>
  <section class="w-1000">
    <detail
      :id="id"
      :data="data"
      :get-product-password="getProductPassword"
      :outline="outline"
      @posted="onPosted"
      @delete-reply="onDeleteReply"
      @update-total="onUpdateTotal"
    />
  </section>
</template>

<script>
import detail from '@/components/tools/detail.vue'
import title from '@@/../common/pages'
import titleI18n from '@@/lang/common/title.json'
import i18n from '@@/lang/desktop/tools-id.json'
import { editCss, filterInt } from '@/utils/client/common'

const obj = Object.assign(
  {
    validate({ params }) {
      return (
        !isNaN(filterInt(params.id)) &&
        ['ebooks', 'indicators'].includes(params.type)
      )
    },
    components: { detail },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        id: null,
        status: null,
        data: {},
        outline: null,
        meta: [],
        linkMeta: [],
        isFavorite: false,
      }
    },
    async asyncData({ app, params, error, req, store }) {
      let locale = app.i18n.locale,
        title = titleI18n[locale].title,
        titlePrefix = i18n[locale].titlePrefix,
        toolData = await app.GoGoHTTP.get(
          `/api/v3/surface/tools/${params.id}?type=${params.type}`
        ),
        titleChunk,
        currentUrl
      store.commit('cart/setInfo', {
        info: toolData.cartInfo,
        productStatus: toolData.status,
        isPassword: toolData.isPassword,
      })
      if (!toolData || !Object.keys(toolData).length) {
        return error({ statusCode: 404 })
      }
      let data = toolData,
        outline = toolData.outline || ''
      if (process.browser) {
        currentUrl = window.location.href
      } else {
        currentUrl = process.env.GOGO_URL + req.originalUrl
      }
      titleChunk = titlePrefix ? `${data.name} - ${titlePrefix}` : data.name
      if (outline.includes('<style')) {
        outline = editCss(outline, '.outline-IbBKtrbLMt')
      }
      store.commit('pushBC', {
        name: data.name,
        target: { name: 'tools-type-id', params: params },
      })
      return {
        id: params.id,
        data,
        titleChunk,
        outline: outline || '',
        keywordsChunk: data.name,
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
            content: data.description || data.name,
            hid: 'og:description',
          },
          {
            name: 'og:url',
            content: currentUrl,
            hid: 'og:url',
          },
          {
            name: 'og:image',
            content: process.env.GOGO_URL + '/img/products/' + params.id,
            hid: 'og:image',
          },
        ],
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/tools/${params.type}/${
              params.id
            }`,
          },
        ],
      }
    },
    methods: {
      onUpdateTotal(number) {
        this.communityTotal = number
      },
      onDeleteReply() {
        this.communityTotal--
      },
      onPosted() {
        this.communityTotal++
      },
      getProductPassword(password) {
        return this.GoGoHTTP.post(
          '/api/v3/surface/tools/' + this.$route.params.id,
          { pagePassword: password, type: this.$route.params.type }
        ).then(data => {
          if (!data || !Object.keys(data).length) {
            this.$router.push('/tools')
            return
          }
          if (this.data.isPassword === 2) {
            this.$store.commit('cart/productStatus', data.status)
          }
          if (this.data.isPassword === 1 && data.status == 0) {
            this.$store.commit('cart/productStatus', 0)
          }
          if (this.data.isPassword === 1 && data.status == 1) {
            this.$set(this, 'data', data)
            this.$store.commit('cart/setCart', data.cartInfo)
            this.$store.commit('cart/productStatus', 1)
            let outline = data.outline || '',
              locale = this.$i18n.locale,
              suffixDes = titleI18n[locale].suffixDes,
              title = titleI18n[locale].title,
              description = titleI18n[locale].description,
              currentUrl = window.location.href,
              descriptionChunk,
              titleChunk,
              keywordsChunk
            descriptionChunk = `${data.name} ${suffixDes}`
            titleChunk =
              this.$t('titlePrefix') !== 'titlePrefix'
                ? `${data.name}- ${this.$t('titlePrefix')}`
                : data.name
            if (outline.indexOf('<style type="text/css">') !== -1) {
              outline = editCss(outline, '.outline-IbBKtrbLMt')
            }
            this.$set(this, 'id', this.$route.params.id)
            this.$set(this, 'titleChunk', titleChunk)
            this.$set(this, 'outline', outline || '')
            this.$set(this, 'descriptionChunk', descriptionChunk)
            this.$set(this, 'keywordsChunk', keywordsChunk)
            this.$set(this, 'meta', [
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
              },
              {
                name: 'og:description',
                content: `『${descriptionChunk}』 ${description}`,
                hid: 'og:description',
              },
              {
                name: 'og:url',
                content: currentUrl,
                hid: 'og:site_name',
              },
              {
                name: 'og:image',
                content:
                  process.env.GOGO_URL +
                  '/img/products/' +
                  this.$route.params.id,
                hid: 'og:image',
              },
            ])
            this.$set(this, 'linkMeta', [
              {
                rel: 'canonical',
                href: `https://www.gogojungle.co.jp/tools/${this.$route.type}/${
                  this.$route.id
                }`,
              },
            ])
          }
        })
      },
      descriptionTemplate() {
        return this.data.description || this.data.name
      },
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
