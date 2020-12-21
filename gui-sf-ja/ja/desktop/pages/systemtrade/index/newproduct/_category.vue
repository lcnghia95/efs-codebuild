<template>
  <NewProduct
    :origin-url="originUrl"
    :cur-page="curPage"
    :data="newProduct"
    :cur-type="$route.params.category"
  >
    <div class="right-content p-15" slot="right-content">
      <div class="fs-13 co-white affiliatecompany">{{ $t('4') }}</div>
      <div class="img-wrap">
        <a :href="fxonUrl('/campaign/?p=3')" class="mt-10" target="_bank">
          <img :src="'/img/assets/pc/companies/sub_campaign_300x600.png'" alt="" />
        </a>
      </div>
      <div class="mt-25 fs-13 co-white affiliatecompany mb-10">{{ $t('3') }}</div>
      <div class="tieup" v-html="tieup"></div>
      <div class="mt-25 fs-13 co-white affiliatecompany mb-10">{{ $t('5') }}</div>
      <div class="adv-mt4">
        <a href="https://fx-on.com/news/detail/?c=1&id=395" target="_bank">
          <img src="https://fx-on.com/include/img/common/sub/banner/r_banner_onamae.png" alt="" />
        </a>
      </div>
    </div>
  </NewProduct>
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-newproduct.json'
import title from '@@/../common/pages'
import NewProduct from '@@/../components/systemtrade/NewProduct.vue'
const obj = Object.assign(
  {
    scrollToTop: true,
    validate({ params }) {
      return ~['fx', 'stocks', undefined].indexOf(params.category)
    },
    components: { NewProduct },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$route.params.category
          ? this.$t('2' + this.$route.params.category)
          : this.$t('2'),
      }
    },
    async asyncData({ app, params, store }) {
      let locale = app.i18n.locale,
        category = params.category || null,
        url = category
          ? `/api/v3/surface/systemtrade/${category}/new/product?limit=0`
          : `/api/v3/surface/systemtrade/new/product?limit=0`,
        [newProduct, tieup] = await Promise.all([
          app.GoGoHTTP.get(url),
          app.GoGoHTTP.get('/api/v3/surface/campaigns'),
        ]),
        originUrl = ['/systemtrade/newproduct', params.category].join('/'),
        alternateLinks = []
      if(category && category == 'fx') {
        alternateLinks = [
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: `https://www.gogojungle.co.jp/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `https://www.gogojungle.co.jp/en/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: `https://www.gogojungle.co.jp/th/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: `https://www.gogojungle.co.jp/vi/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `https://www.gogojungle.co.jp/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          }
        ]
      }
      store.commit('pushBC', {
        name: i18n[locale]['2' + (category || '')],
        target: {
          name: 'systemtrade-index-newproduct-category',
          params: params,
        },
      })
      return {
        newProduct: newProduct,
        tieup: tieup.content || '',
        originUrl,
        curPage: params.p || 1,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          }
        ].concat(alternateLinks),
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t(`d${this.$route.params.category || ''}`)
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.right-content {
  width: 300px;
  height: 100%;
  background: #ebeaeb;
  border-radius: 5px;
  .title-right {
    height: 30px;
    border-left: 3px solid #dbdbdb;
    background: #f0f0f0;
    font-size: 16px;
    color: #7d7d7d;
  }
  /deep/ .gogo-link {
    width: 100%;
    img:hover {
      opacity: 0.85;
    }
  }
  .affiliatecompany {
    height: 30px;
    background-color: #515151;
    line-height: 28px;
    padding-left: 10px;
    font-weight: bold;
    width: 270px;
    border-top: 3px solid #9c3;
    border-radius: 3px 3px 0 0;
  }
  .co-white {
    color: white;
  }
  .img-wrap {
    a {
      display: block;
      width: 270px;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .adv-mt4 {
    a {
      display: block;
      width: 270px;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
}
.tieup {
  overflow: hidden;
}
</style>
