<template>
  <div class="product-list-content">
    <div v-for="(rankList, idx) in arrayStockRanking" :key="idx">
      <div class="flex center product-header">
        <div v-if="idx == 0">
          <IconHeader :item="title" :type="idx">
            <b v-if="title.text">{{ title.text }}</b>
            <i :is="title.icon" v-if="title.icon" />
          </IconHeader>
        </div>
        <h2 class="sub-tit text-center m-0" v-else v-html="$t(idx + 1)"></h2>
      </div>
      <ProductRankHorizontal :data="rankList" :type="types[idx]" />
      <ShowMore :target="targets[idx]" />
      <a class="banner w-full" v-if="advertiseBanners && advertiseBanners[idx]" :href="advertiseBanners[idx][0].landingPageUrl">
        <img class="w-full" :src="advertiseBanners[idx][0].bannerUrl" alt="" />
      </a>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/systemtrade-stock.json'
import ShowMore from '@/components/common/ShowMore.vue'
import ProductRankHorizontal from '@/components/product/ProductRankHorizontal.vue'
import IconHeader from '@/components/systemtrade/IconHeader.vue'
import icons from '@/js/systemtrade/icons'
import title from '@@/../common/pages'
const obj = Object.assign(
  {
    components: {
      IconHeader,
      ProductRankHorizontal,
      ShowMore,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        targets: [
          '/systemtrade/sell/stocks',
          '/systemtrade/profitrate/stocks',
          '/systemtrade/profit/stocks',
          '/systemtrade/profitfactor/stocks',
          '/systemtrade/riskreturn/stocks',
        ],
        types: ['sell', 'profitrate', 'profit', 'profitfactor', 'riskreturn'],
        titleChunk: this.$t('titlePrefix'),
      }
    },
    async asyncData({ app, store }) {
      let [bestsell, criterial, riskreturn] = await Promise.all([
          app.GoGoHTTP.get(
            '/api/v3/surface/systemtrade/stocks/rank/sell?limit=5'
          ),
          app.GoGoHTTP.get('/api/v3/surface/systemtrade/stocks/rank/criterial'),
          app.GoGoHTTP.get(
            '/api/v3/surface/systemtrade/stocks/rank/riskreturn?limit=5'
          ),
        ]),
        title = Object.assign(
          {
            type: 'stock1',
            url: '/systemtrade/stocks',
            bgColor: '#e6ae4d',
          },
          icons['stocks']
        ),
        advertiseBanners = store.state.advertisements.advertiseBanners || {}
      return {
        arrayStockRanking: [
          bestsell,
          criterial ? criterial.returnRate : [],
          criterial ? criterial.amount : [],
          criterial ? criterial.pf : [],
          riskreturn,
        ],
        title,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/stocks`,
          },
        ],
        advertiseBanners,
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('7')
      },
      
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.product-list-content {
  padding: 0 4vw;
  margin-bottom: 20vw;
  .product-header {
    margin-top: 12vw;
  }
  .sub-tit {
    font-size: 5vw;
    font-weight: bold;
    color: #707070;
    line-height: 6vw;
  }
  .c-prod-l {
    margin-top: 5vw;
  }
  /deep/ .item {
    padding-top: 1vw;
  }
  .banner {
    display: block;
    margin-top: 10vw;
  }
}
</style>
