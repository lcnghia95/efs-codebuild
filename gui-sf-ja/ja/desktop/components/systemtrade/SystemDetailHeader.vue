<template>
  <section>
    <div class="flex mid product-name pb-10">
      <div class="icon-title flex mid center fs-13 mr-5" v-if="isStock"
           :style="$i18n.locale == 'ch' || $i18n.locale == 'tw' ? 'font-size: 13px; width: 38px; height: 38px;' : ''"
      >
        <b>{{ $t(isStock ? 1 : 12) }}</b>
      </div>
      <h2><b>{{ detail.name }}</b></h2>
    </div>
    <div class="flex space-between mt-25">
      <div class="flex">
        <div class="product-img">
          <img :src="'/img/products/' + detail.id + '/small'" :alt="`${detail.name} ${$t('15')}`" class="prd-img" />
          <Rate :stars="detail.review.stars" :number="detail.review.count" class="mt-5" :target="detail.id" />
          <div class="flex mid space-between pl-5 pr-5 mt-5 center question w-full cursor-pointer" @click="goCommunity">
            <span class="question-icon"></span>
            <span>{{ $t('6') }}</span>
            <span>({{ commuTotal || 0 }})</span>
          </div>
        </div>
        <div class="product-des ml-20 mr-15" :style="{'width': isStock ? '100%' : '300px'}">
          <div class="des-content">{{ detail.description }}</div>
          <div class="flex mt-20">
            <div class="category">{{ $t('2') }}</div>
            <div class="fs-12 ml-25">{{ detail.platform ? $t('platforms.' + detail.platform) : '-' }}</div>
          </div>
          <div class="flex mt-5">
            <div class="category">{{ $t('3') }}</div>
            <div class="fs-12 ml-25"> {{ (detail.user || {}).name }}</div>
          </div>
          <div class="flex mt-5">
            <div class="category">{{ $t('4') }}</div>
            <div class="fs-12 ml-25">{{ detail.updated ? formatTime(detail.updated, 8) : '-' }}</div>
          </div>
          <div class="flex mt-5">
            <div class="category">{{ $t('5') }}</div>
            <div class="fs-12 ml-25">{{ detail.version || '-' }}</div>
          </div>
          <div class="flex mt-5">
            <div class="category">{{ $t('13') }}</div>
            <GogoLink v-if="detail.user" class="fs-12 ml-25" :target="'/users/' + detail.user.id">
              <span class="under-link">{{ (detail.user || {}).name }}</span>
            </GogoLink>
          </div>
        </div>
      </div>
      <div class="spider" v-if="!isStock">
        <SpiderWeb :chart="[detail.spider]" :option="spiderOpt" v-if="detail.spider" />
      </div>
    </div>
    <div class="flex mt-20 mb-20">
      <LineButton class="mr-10" :url="$route.fullPath" />
      <FacebookButton class="ml-10 mr-10" :url="$route.fullPath" />
      <TwitterButton class="ml-10 mr-10" :url="$route.fullPath" :title="detail.name + '%0A'" />
    </div>
    <stocksHeader :detail="detail" v-if="isStock" />
    <fxHeader :detail="detail" v-else />
    <LazyComp01 class="mt-40 text-center" min-height="400px">
      <span class="ea-cls" v-if="isOperationStop">{{ $t('14') }}</span>
      <LineStock :chart="mainChart" :option="lineStockOpt" style="height: 400px;" />
    </LazyComp01>
  </section>
</template>
<script>
import i18n from '@@/lang/components-desktop/systemtrade-header.json'
import SpiderWeb from '@@/../components/charts/SpiderWeb.vue'
import Rate from '@@/../components/product/Rate.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
import LineStock from '@@/../components/charts/LineStock.vue'
import fxHeader from '@/components/systemtrade/fx/fxHeader.vue'
import stocksHeader from '@/components/systemtrade/stock/stocksHeader.vue'
import TwitterButton from '@@/../components/social/TwitterButton.vue'
import LineButton from '@@/../components/social/LineButton.vue'
import FacebookButton from '@@/../components/social/FacebookButton.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

export default {
  components: {
    SpiderWeb,
    Rate,
    GogoLink,
    LineStock,
    fxHeader,
    stocksHeader,
    FacebookButton,
    LineButton,
    TwitterButton,
    LazyComp01,
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      },
    },
    goCommunity: {
      type: Function,
      default() {},
    },
    category: String,
    commuTotal: Number,
    mainChart: Array,
    isStock: {
      type: Boolean,
      default: false,
    },
    isOperationStop: {
      type: Boolean,
      default: false,
    },
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      spiderOpt: {
        width: 200,
        height: 180,
        categories: [
          this.$t('7'),
          this.$t('8'),
          this.$t('9'),
          this.$t('10'),
          this.$t('11'),
        ],
        yMax: 5.0,
      },
      lineStockOpt: {
        rangeSelector: true,
        navigator: true,
        margin: 20,
      },
    }
  },
}
</script>
<style lang="scss" scoped>
.product-name {
  border-bottom: solid 2px #ff8400;
  .icon-title {
    width: 25px;
    height: 25px;
    background: #ff8400;
    border-radius: 50%;
    color: white;
    ~ h2 {
      font-size: 18px;
      line-height: 1.4;
      margin-top: 2px;
      margin-bottom: 0;
    }
  }
  .btc-icon {
    color: #ff8400;
  }
}
.product-img {
  width: 120px;
  .prd-img {
    width: 120px;
    height: 120px;
    margin-bottom: 3px;
  }
  /deep/ .gg-rating {
    justify-content: center;
    > .rate-num {
      font-size: 13px;
    }
  }
  .question {
    height: 25px;
    font-size: 10px;
    border: 3px solid #ff8400;
    border-radius: 18px;
    color: #ff8400;
    font-weight: bold;
    .question-icon {
      display: block;
      border-style: solid;
      border-width: 4px 0 4px 4px;
      border-color: transparent transparent transparent #ff8500;
      margin: -1px 2px 0 0;
    }
  }
}
.product-des {
  color: #666;
  .des-content {
    font-size: 16px;
    line-height: 18px;
  }
}
.spider {
  width: 220px;
  height: 180px;
}
.category {
  flex: 0 0 140px;
  border-right: dotted 2px #c5c5c5;
}
.under-link {
  text-decoration: underline;
  color: #666;
}
.ea-cls {
  font-weight: bold;
  color: #b56ba3;
}
</style>
<docs>
  ```vue
  <template>
    <div>
      <SystemDetailHeader :detail="detail" :category="'fx'" url-path="/stocks/123" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        detail: {
          id: 14662,
          name: 'TMS_GU_M15',
          description: '低ドローダウンのＥＡ，GBPUSD 1ポジションで取引します。',
          platform: 1,
          user: {
            id: 110195,
            name: 'ヒロトーン',
          },
          updated: 1535827416,
          review: {
            stars: 10,
            count: 3,
          },
          questionTotal: 0,
          criterial: {
            profitTotal: 17980,
            recommendedMargin: 660180,
            profitFactor: 2.1,
            riskReturn: 0.55,
            averageProfit: 3809,
            averageLoss: -3260,
            accountBalance: 1017980,
            revenueIncludes: -13957,
            rateReturn: 2.72,
            winRate: 64.29,
            win: 9,
            total: 14,
            maxPosition: 1,
            maxDD: 4.75,
            dd: 32588,
            maxProfit: 14936,
            maxLoss: -14189,
            firstAmount: 1000000,
            currency: 1,
          },
          spider: [{
            data: [
              2.1,
              64.29,
              27,
              14,
              0.55,
            ],
            pointPlacement: 'on',
          }],
          lineStock: [{
            name: '収益',
            tooltip: {
              valueDecimals: 2,
            },
            data: [
              [
                1532617200000,
                0,
              ],
              [
                1532703600000,
                1,
              ],
              [
                1532876400000,
                2,
              ],
            ],
          }, {
            name: '収益+当日最大含み損益',
            tooltip: {
              valueDecimals: 2,
            },
            data: [
              [
                1532617200000,
                0,
              ],
              [
                1532703600000,
                2,
              ],
              [
                1532876400000,
                3,
              ],
            ],
          }],
          brokers: [
            '148',
            '229',
            '251',
            '203',
          ],
          currencyType: 1,
          forward: [
            {
              open: 1535596200,
              symbol: 'GBP/USD',
              type: 1,
              openPrice: 1.29895,
              stop: 1.2992,
              takeProfit: 1.30686,
              close: 1535596800,
              closePrice: 1.29919,
              lots: 1,
              commission: 0,
              tax: 0,
              swap: 0,
              pips: 2678,
              profit: 17980,
              reverseOpen: 0,
            },
            {
              open: 1535583600,
              symbol: 'GBP/USD',
              type: 1,
              openPrice: 1.3027,
              stop: 1.29811,
              takeProfit: 1.31051,
              close: 1535588400,
              closePrice: 1.30302,
              lots: 1,
              commission: 0,
              tax: 0,
              swap: 0,
              pips: 3573,
              profit: 15302,
              reverseOpen: 0,
            },
            {
              open: 1535065200,
              symbol: 'GBP/USD',
              type: 0,
              openPrice: 1.28214,
              stop: 1.28677,
              takeProfit: 1.27437,
              close: 1535080740,
              closePrice: 1.28216,
              lots: 1,
              commission: 0,
              tax: 0,
              swap: 0,
              pips: -223,
              profit: 11729,
              reverseOpen: 0,
            },
          ],
        },
      }
    },
  }
  </script>
  ```
</docs>
