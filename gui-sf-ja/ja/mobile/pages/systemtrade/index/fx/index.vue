<template>
  <div class="product-list-content">
    <BubbleChart02 :chart="rankingActive" style="min-height: 450px; margin-top: 20px;" />
    <div class="mt-15 flex content-end" min-height="40px">
      <a href="/systemtrade/search/?sort=0profitTotal&page=1&minActiveCount=20&minActiveRate=40&isOnSale=false&isOperating=false" style="font-size: 14px;">{{ $t('7') }}</a>
    </div>
    <div class="flex center product-header">
      <div>
        <IconHeader :item="pipsTitle">
          <b>{{ pipsTitle.text }}</b>
        </IconHeader>
      </div>
    </div>
    <ProductRankHorizontal :data="rtRanking" type="pips" :rt-ranking="rtRanking" />
    <div v-for="(rankList, idx) in arrayFxProductRank" :key="idx">
      <div class="flex center product-header">
        <div v-if="idx == 0">
          <IconHeader :item="title">
            <b>{{ title.text }}</b>
          </IconHeader>
        </div>
        <h2 class="sub-tit text-center m-0" v-else v-html="$t(idx + 1)"></h2>
      </div>
      <ProductRankHorizontal :data="rankList" :type="types[idx]" :rt-ranking="rtRanking" />
      <ShowMore :target="targets[idx]" />
      <a class="banner w-full" v-if="advertiseBanners && advertiseBanners[idx]" :href="advertiseBanners[idx][0].landingPageUrl">
        <img class="w-full" :src="advertiseBanners[idx][0].bannerUrl" alt="" />
      </a>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/systemtrade-fx.json'
import ShowMore from '@/components/common/ShowMore.vue'
import ProductRankHorizontal from '@/components/product/ProductRankHorizontal.vue'
import IconHeader from '@/components/systemtrade/IconHeader.vue'
import icons from '@/js/systemtrade/icons'
import title from '@@/../common/pages'
import BubbleChart02 from '@/components/charts/BubbleChart02.vue'

const obj = Object.assign(
  {
    components: {
      IconHeader,
      ProductRankHorizontal,
      ShowMore,
      BubbleChart02,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        title: Object.assign(
          {
            type: 'fx1',
            url: '/systemtrade/fx',
          },
          icons['fx']
        ),
        pipsTitle: Object.assign(
          {
            type: 'pips',
            url: '/systemtrade/realasset',
          },
          icons['realasset']
        ),
        targets: [
          '/systemtrade/sell/fx',
          '/systemtrade/profitrate/fx',
          '/systemtrade/profit/fx',
          '/systemtrade/profitfactor/fx',
          '/systemtrade/riskreturn/fx',
        ],
        types: ['sell', 'profitrate', 'profit', 'profitfactor', 'riskreturn'],
        titleChunk: this.$t('titlePrefix'),
      }
    },
    async asyncData({ app, store }) {
      let [bestsell, criterial, rankingActive, rtRanking] = await Promise.all([
        app.GoGoHTTP.get('/api/v3/surface/systemtrade/fx/rank/sell?limit=5'),
        app.GoGoHTTP.get('/api/v3/surface/systemtrade/fx/rank/criterial'),
        app.GoGoHTTP.get('/api/v3/surface/top/rankingActive'),
        app.GoGoHTTP.get('/api/v3/surface/systemtrade/fx/rank/realtrade', { params: { limit: 5 } }),
      ]),
      advertiseBanners = store.state.advertisements.advertiseBanners || {}
      return {
        arrayFxProductRank: [
          bestsell,
          criterial && criterial.rateOf3M ? criterial.rateOf3M.data : [],
          criterial && criterial.amountOf3M ? criterial.amountOf3M.data : [],
          criterial && criterial.profitOf3M ? criterial.profitOf3M.data : [],
          criterial && criterial.riskOf3M ? criterial.riskOf3M.data : [],
        ],
        rankingActive,
        rtRanking: rtRanking || [],
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/fx`,
          },
        ],
        advertiseBanners,
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('6')
      }
    }
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
  .banner {
    display: block;
    margin-top: 10vw;
  }
}
@media only screen and (min-width: 600px) {
  .product-list-content {
    padding: 0 6vw;
  }
}
</style>
