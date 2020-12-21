<template>
  <div class="product-rank-list">
    <IconHeader :item="title">
      <b v-if="title.text">{{ title.text }}</b>
    </IconHeader>
    <ProductRankHorizontal :data="pagingData.data" :start-idx="20 * (pagingData.currentPage - 1)" :type="revenue" />
    <paging class="product-paging" :cur-page="pagingData.currentPage"
            :total="pagingData.lastPage"
            :from="pagingData.pagingFrom"
            :to="pagingData.pagingTo"
            :has-scroll="true"
            :is-add-url-param="true"
            :origin-url="originUrl"
            theme-class="theme1"
            @pagingclick="onGetDataPage"
    />
  </div>
</template>
<script>
import ProductRankHorizontal from '@/components/product/ProductRankHorizontal.vue'
import IconHeader from '@/components/systemtrade/IconHeader.vue'
import Paging from '@/components/paging/Paging.vue'
import icons from '@/js/systemtrade/icons'
import Medal from '@@/../components/icons/Medal.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/systemtrade-realasset.json'

const obj = Object.assign(
  {
    components: {
      IconHeader,
      ProductRankHorizontal,
      Paging,
      Medal,
    },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, params }) {
      const revenue = 'realasset'
      const pagingData = await app.GoGoHTTP.get('/api/v3/surface/systemtrade/rank/realasset',
          {
            params: {
              page: params.p || 1,
              limit: 20,
            },
          }
        )
      const originUrl = '/systemtrade/realasset'
      const title = Object.assign(
          {
            type: 'realasset',
            url: originUrl,
          },
          icons[revenue]
        )

      return {
        pagingData,
        title,
        revenue,
        originUrl,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/systemtrade/realasset',
          },
        ],
      }
    },
    methods: {
      onGetDataPage(_page) {
        location.href = `/systemtrade/realasset/p/${_page}`
      },
      descriptionTemplate() {
        return this.$t('description')
      },
    },
    computed: {
      titleChunk() {
        return this.$t('1')
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.product-rank-list {
  padding: 0 4vw;
  margin-bottom: 20vw;
  a {
    display: block;
    margin: 10vw auto 7vw;
    text-decoration: none;
  }
  .product-paging /deep/ {
    margin-top: 4vw;
    ul {
      text-align: center;
    }
  }
}
@media only screen and (min-width: 600px) {
  .product-rank-list .gogo-link {
    margin: 5vw auto;
  }
}
</style>
