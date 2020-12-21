<template>
  <div class="product-rank-list">
    <IconHeader :item="title">
      <b v-if="title.text">{{ title.text }}</b>
      <i :is="title.icon" v-if="title.icon" />
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
import Sync from '@@/../components/icons/Sync.vue'
import Medal from '@@/../components/icons/Medal.vue'
import BalanceScale from '@@/../components/icons/BalanceScale.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/system-revenue.json'

const titlesMap = {
  profit: {
    fx: 'profit_fx',
    stocks: 'profit_stock',
    _: 'profit_all',
  },
  profitfactor: {
    fx: 'profitfactor_fx',
    stocks: 'profitfactor_stock',
    _: 'profitfactor_all',
  },
  profitrate: {
    fx: 'profitrate_fx',
    stocks: 'profitrate_stock',
    _: 'profitrate_all',
  },
  riskreturn: {
    fx: 'riskreturn_fx',
    stocks: 'riskreturn_stock',
    _: 'riskreturn_all',
  },
  sell: {
    fx: 'sell_fx',
    stocks: 'sell_stock',
    _: 'sell_all',
  },
}
const leftTitle = {
  profitrate: {
    fx: 1,
    stocks: 2,
    all: 4,
  },
  profit: {
    fx: 5,
    stocks: 6,
    all: 8,
  },
  profitfactor: {
    fx: 9,
    stocks: 10,
    all: 12,
  },
  riskreturn: {
    fx: 13,
    stocks: 14,
    all: 16,
  },
  sell: {
    fx: 17,
    stocks: 18,
    all: 20,
  },
}
const obj = Object.assign(
  {
    validate({ params }) {
      return (
        ~['profitrate', 'profit', 'profitfactor', 'riskreturn', 'sell'].indexOf(
          params.revenue
        ) && ~['fx', 'stocks', undefined].indexOf(params.category)
      )
    },
    components: {
      IconHeader,
      ProductRankHorizontal,
      Paging,
      Sync,
      BalanceScale,
      Medal,
    },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, params }) {
      let revenue = params.revenue,
        category = params.category,
        pagingData = await app.GoGoHTTP.get(
          `/api/v3/surface/systemtrade/${
            category === undefined ? '' : category + '/'
          }rank/${revenue}`,
          {
            params: {
              page: params.p || 1,
              limit: 20,
            },
          }
        ),
        titleUrl = category
          ? `/systemtrade/${revenue}/${category}`
          : `/systemtrade/${revenue}`,
        title = Object.assign(
          {
            type: titlesMap[revenue][category || '_'],
            url: titleUrl,
          },
          icons[revenue]
        ),
        originUrl = ['', 'systemtrade', revenue, category].join('/')

      return {
        pagingData,
        title,
        revenue,
        originUrl,
        category,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/${revenue}${
              category ? '/' + category : ''
            }`,
          },
        ],
      }
    },
    methods: {
      onGetDataPage(_page) {
        location.href = `/systemtrade/${this.revenue}${
          this.category ? '/' + this.category : ''
        }/p/${_page}`
      },
      descriptionTemplate() {
        return this.$t(`d${this.revenue || 'profitrate'}${this.category || ''}`)
      },
    },
    computed: {
      titleChunk() {
        return this.$t(leftTitle[this.revenue][this.category || 'all'])
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
