<template>
  <div class="product-rank-list">
    <IconHeader :item="title">
      <b v-if="title.text">{{ title.text }}</b>
      <i :is="title.icon" v-if="title.icon" />
    </IconHeader>
    <ProductRankHorizontal :data="pagingData.data" :start-idx="ITEMS_PER_PAGE * (pagingData.currentPage - 1)" :is-ranking="false" :type="'newproduct'" />
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
import { calPaging } from '@/utils/client/common'
import icons from '@/js/systemtrade/icons'
import i18n from '@@/lang/mobile/system-newproduct.json'
import title from '@@/../common/pages'

const ITEMS_PER_PAGE = 30
const titlesMap = {
  bitcoin: 'newproduct_bitcoin',
  fx: 'newproduct_fx',
  stocks: 'newproduct_stock',
  _: 'newproduct_all',
}

const obj = Object.assign(
  {
    validate({ params }) {
      return ~['fx', 'stocks', undefined].indexOf(params.category)
    },
    i18n: {
      messages: i18n,
    },
    components: {
      IconHeader,
      ProductRankHorizontal,
      Paging,
    },
    async asyncData({ app, params }) {
      let category = params.category,
        newProducts = await app.GoGoHTTP.get(
          `/api/v3/surface/systemtrade/${
            category === undefined ? '' : category + '/'
          }new/product`
        ),
        pagingData = calPaging(newProducts, params.p, ITEMS_PER_PAGE),
        title = Object.assign(
          {
            type: titlesMap[category || '_'],
            url: category
              ? `/systemtrade/newproduct/${category}`
              : '/systemtrade/newproduct',
          },
          icons['newproduct']
        ),
        originUrl = ['/systemtrade/newproduct', category].join('/')

      return {
        ITEMS_PER_PAGE,
        newProducts,
        category,
        pagingData,
        title,
        originUrl,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          },
        ],
      }
    },
    data() {
      return {
        titleChunk: this.$route.params.category
          ? this.$t('2' + this.$route.params.category)
          : this.$t('2'),
      }
    },
    methods: {
      onGetDataPage(_page) {
        this.pagingData = calPaging(this.newProducts, _page, ITEMS_PER_PAGE)
      },
      descriptionTemplate() {
        return this.$t(`d${this.category || ''}`)
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
  .gogo-link {
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
