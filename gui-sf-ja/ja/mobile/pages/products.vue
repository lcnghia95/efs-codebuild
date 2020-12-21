<template>
  <div class="page">
    <div class="page-title p-10">
      <b>{{ !keywords ? $t('1') : `${$t('1')} ー ${$t('6', { keyword:keywords,total })}` }}</b>
    </div>
    <div class="product-list mb-10">
      <template v-for="(product,index) in (dataDisplay || [])">
        <ProductVertical03
          :key="'oNrZd' + product.id "
          class="product-h9cei"
          :product="product"
          :category="$t(typeMap[product.typeId])"
        />
        
        <div v-if="product.banner && index!=dataDisplay.length-1" :key="'nweFw' + product.id " v-html="product.banner" class="banner w-full flex center"></div>
      </template>
    </div>
    <div class="pb-30">
      <LoadMore class="bg-white" v-if="lastPage > page" @click.native="onLoadmore" />
      <div class="flex center" v-if="isLoad">
        <Loading />
      </div>
      <div class="no-data bg-white" v-if="!dataDisplay.length">{{ $t(7) }}</div>
    </div>
  </div>
</template>

<script>
import ProductVertical03 from '@/components/product/ProductVertical03.vue'
import LoadMore from "@/components/common/LoadMore.vue"
import i18n from '@@/lang/mobile/new-products.json'
import type from '@@/lang/components-desktop/product-productvert.json'
import title from '@@/../common/pages'
import Loading from '@@/../components/icons/Loading.vue'

const typeMap = {
  1: 'type1',
  2: 'typetools',
  3: 'type3',
  4: 'type4',
  6: 'typetools',
  8: 'typetools',
  9: 'typetools',
  10: 'typetools',
  70: 'typetools',
  71: 'typetools',
  72: 'typetools',
}

const langMap = {
  ja: Object.assign(i18n['ja'], type['ja']),
  en: Object.assign(i18n['en'], type['en']),
  th: Object.assign(i18n['th'], type['th']),
  ch: Object.assign(i18n['ch'], type['ch']),
  tw: Object.assign(i18n['tw'], type['tw']),
  vi: Object.assign(i18n['vi'], type['vi']),
}

function calBanner(data, banner,countBanner) {
  let bannerLen = banner.length,
    res = data,
    count = countBanner
  for (let i in data) {
    if ((i + 1) % 9 == 0 ) {
      Object.assign(res[i],{banner:(banner[count++])})
    }
    if (count == bannerLen) {
      count = 0
    }
  }
  return {res, count}
}

const obj = Object.assign(
  {
    components: {
      ProductVertical03,
      LoadMore,
      Loading,
    },
    i18n: {
      messages: langMap,
    },
    data() {
      return {
        isLoad: false,
      }
    },
    computed: {
      titleChunk() {
        return this.keywords ? `${this.$t('6', {keyword: this.keywords})} - ${this.$t('1')}` : this.$t('1')
      }
    },
    methods: {
      async onLoadmore() {
        this.page++
        this.isLoad = true
        let products = await this.GoGoHTTP.get(`/api/v3/surface/product/new`,{
            params: {
              page: this.page,
              limit: 27,
              keywords: this.keywords
            },
          }),
          {res, count} = calBanner(products.data, this.campaigns, this.bannerCount)
        this.lastPage = products.lastPage
        this.bannerCount = count
        this.dataDisplay = this.dataDisplay.concat(res)
        this.isLoad = false
      },
      descriptionTemplate() {
        return this.$t('5')
      },
    },
    async asyncData({ query, app }) {
      let page = 1,
        bannerCount = 0,
        keywords = query.q || '',
        [campaigns, newProducts] = await Promise.all([
          app.GoGoHTTP.get('/api/v3/surface/campaigns?isMobile=1'),
          app.GoGoHTTP.get(`/api/v3/surface/product/new`, {
            params: {
              page,
              limit: 27,
              keywords,
            },
          })]),
        {res, count} = calBanner(newProducts.data, campaigns, bannerCount),
        lastPage = newProducts.lastPage,
        total = newProducts.total
      return {
        total,
        bannerCount: count,
        campaigns,
        page,
        lastPage,
        dataDisplay: res,
        keywords,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/products`,
          },
        ],
        typeMap,
      }
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.page-title {
  background-color: rgb(243, 240, 239);
  font-size: 16px;
}
.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  padding: 10px 20px;
}
.product-list /deep/ {
  .s-82 {
    width: 30vw;
    height: 30vw;
  }
}
.no-data {
  text-align: center;
}
.banner {
  grid-column: 1 / 4;
}
.img1 {
  box-shadow: 0 0 7px rgba(0, 0, 0, 0.3);
}
.page /deep/ .btn-loadmore {
  color: #333;
  padding: 15px 0;
  .icon-cls {
    width: 18px;
    height: 18px;
  }
}
</style>
