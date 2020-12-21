<template>
  <product-rank-list
    :origin-url="originUrl"
    :cur-page="curPage"
    :data="productRank"
    :revenue="'realasset'"
    :left-title="$t('1')"
  >
    <template slot-scope="prop">
      <RealRankingProduct
        class="mb-10"
        :product="prop.product"
        :number="prop.number"
        :key="prop.product.id"
      />
    </template>
  </product-rank-list>
</template>
<script>
import title from '@@/../common/pages'
import ProductRankList from '@/components/systemtrade/ProductRankList.vue'
import RealRankingProduct from '@/components/product/RealRankingProduct.vue'
import i18n from '@@/lang/desktop/systemtrade-realasset.json'
const obj = Object.assign(
  {
    scrollToTop: true,
    i18n: {
      messages: i18n,
    },
    components: { ProductRankList, RealRankingProduct },
    data() {
      return {
        category: null,
      }
    },
    computed: {
      titleChunk() {
        return this.$t('1')
      },
    },
    async asyncData({ app, params }) {
      const curPage = params.p || 1
      const productRank = await app.GoGoHTTP.get('/api/v3/surface/systemtrade/rank/realasset',
          {
            params: {
              page: curPage,
              limit: 20,
              type: 1,
            },
          }
        ),
        originUrl = '/systemtrade/realasset'
      return {
        productRank,
        originUrl,
        category: 'all',
        curPage,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/systemtrade/realasset',
          }
        ]
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('description')
      },
    },
  },
  title
)
export default obj
</script>
