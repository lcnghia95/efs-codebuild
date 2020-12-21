<template>
  <div class="product-rank-list">
    <IconHeader :item="title">
      <b v-if="title.text">{{ title.text }}</b>
      <i :is="title.icon" v-if="title.icon" />
    </IconHeader>
    <ProductRankHorizontal :data="pagingData.data" :start-idx="ITEMS_PER_PAGE * (pagingData.currentPage - 1)" type="fx"/>
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
import i18n from '@@/lang/desktop/system-economics.json'
import title from '@@/../common/pages'

const ITEMS_PER_PAGE = 30
const titlesMap = {
  1: 'unemploy_fx',
  2: 'financial_fx',
}

const obj = Object.assign(
  {
    validate({ params }) {
      return ~['1', '2'].indexOf(params.type)
    },
    components: {
      IconHeader,
      ProductRankHorizontal,
      Paging,
    },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, params }) {
      let type = params.type,
        productRank = await app.GoGoHTTP.get(
          `/api/v3/surface/systemtrade/fx/rank/economics/${type}`
        ),
        pagingData = calPaging(productRank, params.p, ITEMS_PER_PAGE),
        titleUrl = `/systemtrade/economics/fx/${type}`,
        title = Object.assign(
          {
            type: titlesMap[type],
            url: titleUrl,
          },
          icons['fx']
        ),
        originUrl = ['/systemtrade', 'economics/fx', type].join('/')

      return {
        ITEMS_PER_PAGE,
        productRank,
        pagingData,
        title,
        type,
        originUrl,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/economics/fx/${type}`,
          },
        ],
      }
    },
    methods: {
      onGetDataPage(_page) {
        this.pagingData = calPaging(this.productRank, _page, ITEMS_PER_PAGE)
      },
      descriptionTemplate() {
        return this.$t('d' + this.type)
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
