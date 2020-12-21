<template>
  <section>
    <div class="product-name flex mid">
      <div class="icon-title flex mid center" v-if="isStock">
        <b>{{ $t(isStock ? 1 : 12) }}</b>
      </div>
      <h2><b>{{ detail.name }}</b></h2>
    </div>
    <div class="flex space-between product-info">
      <div class="product-img">
        <div class="prd-img pos-rel">
          <img class="pos-abs" :src="'/img/products/' + (detail.exProductId || detail.id) + '/small'" :alt="`${detail.name} ${$t('15')}`" />
        </div>
        <Rate class="mid center" :stars="detail.review.stars" :number="detail.review.count"
              :target="detail.id" :alway-show="true" 
        />
        <div class="flex mid space-between mt-5 center question w-full cursor-pointer" @click="goCommunity">
          <span class="question-icon"></span>
          <span>{{ $t('6') }}</span>
        </div>
      </div>
      <div class="product-des w-full">
        <div class="des-content"><b>{{ detail.description }}</b></div>
        <div class="flex">
          <div class="category">{{ $t('2') }}</div>:
          <div>{{ detail.platform ? $t('platforms.' + detail.platform) : '-' }}</div>
        </div>
        <div class="flex">
          <div class="category">{{ $t('3') }}</div>:
          <div> {{ (detail.user || {}).name }}</div>
        </div>
        <div class="flex">
          <div class="category">{{ $t('4') }}</div>:
          <div>{{ detail.updated ? formatTime(detail.updated, 8) : '-' }}</div>
        </div>
        <div class="flex">
          <div class="category">{{ $t('5') }}</div>:
          <div>{{ detail.version || '-' }}</div>
        </div>
        <div class="flex">
          <div class="category">{{ $t('13') }}</div>:
          <a v-if="detail.user" :href="'/users/' + detail.user.id">
            <span class="under-link">{{ (detail.user || {}).name }}</span>
          </a>
        </div>
      </div>
    </div>
    <LazyComp01 min-height="300px" class="main-chart text-center">
      <span class="ea-cls" v-if="mainChart.isOperationStop">{{ $t('14') }}</span>
      <div class="chart-title p-10">{{ $t(17) }}</div>
      <LineStock class="mb-20" :chart="mainChart.mainChart" :option="lineStockOpt" style="min-height: 300px;" />
    </LazyComp01>
    <SocialGroup />
    <LazyComp01 min-height="300px" class="main-chart text-center" @comp-ready="onChartSliderReady()" v-if="mainChart.pipChart">
      <div class="chart-title p-10">{{ $t(16) }}</div>
      <div class="owl-carousel chart-slider slider1 mt-10 mb-20 flex" style="height: 340px;">
        <div v-if="chartItem.length" v-for="(chartItem, idx) in mainChart.pipChart" :key="'chart-' + idx" style="width: 100%; height: 300px;">
          <h2 v-if="chartItem[0].leverage <= 25" style="font-size: 18px; line-height: 1.4;">
            {{ $t('20') }} {{ chartItem[0].accountCompany }}
          </h2>
          <a :href="chartItem[0].accountId ? `${realTradeUrl}/accounts/${chartItem[0].accountId}/${chartItem[0].magicNumberStr}` : 'javascript:void(0)'" style="display: block; text-decoration: none; ">
            <h2 class="text-left" style="font-size: 18px; line-height: 1.4; color: #23527c;">
              {{ chartItem[0].accountName || $t('19') }}
            </h2>
          </a>
          <LineStock class="mb-20" :chart="chartItem" :option="{...lineStockOpt, ...{ curUnit: 'pips' }}" style="width: 100%; min-height: 300px;" v-if="mapIndex.includes(idx)" />
          <Loading v-else style="width: 100%; min-height: 300px;" />
        </div>
      </div>
      <h4 class="title text-left">{{ $t('18') }}</h4>
    </LazyComp01>
  </section>
</template>
<script>
import i18n from '@@/lang/components-mobile/systemtrade-header.json'
import Rate from '@@/../components/product/Rate.vue'
// import llc from '@@/../common/js/lazy-load-component'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import LineStock from '@@/../components/charts/LineStock.vue'
import Loading from '@@/../components/icons/Loading.vue'
import SocialGroup from '@@/../components/systemtrade/SocialGroup.vue'

export default {
  components: {
    Rate,
    LineStock,
    LazyComp01,
    Loading,
    SocialGroup,
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
    isStock: {
      type: Boolean,
      default: false,
    },
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      lineStockOpt: {
        rangeSelector: false,
        navigator: false,
        chart: {
          height: 300,
          marginRight: 20,
        },
        legend: {
          enabled: true,
          floating: false,
          x: 0,
          y: 10,
        },
        scrollbar: {
          enabled: false,
        },
        tooltip: {
          useHTML: true,
          split: false,
          valueDecimals: 1,
        },
      },
      mainChart: {},
      mapIndex: [0],
    }
  },
  computed: {
    realTradeUrl() {
      return process.env.REAL_TRADE_URL
    }
  },
  mounted() {
    this.getChart()
  },
  methods: {
    getChart() {
      this.GoGoHTTP.get(
        `/api/v3/surface/systemtrade/${this.category}/${this.detail.id}/chartv2`, {
        params: {
          accountId: this.$route.query.a || 0
        }
      }).then(data => {
        this.mainChart = data
      })
    },
    onChartSliderReady() {
      this.$nextTick(() => {
        let owl = $('.chart-slider')
        owl.owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          loop: false,
          rewind: true,
          autoplay: true,
          smartSpeed: 500,
          autoplayHoverPause: true,
          items: 1,
          nav: true,
        })
        let me = this
        owl.on('changed.owl.carousel', function(event) {
          const current_slide_in_loop = event.item.index - (event.relatedTarget.clones().length / 2)
          if (!me.mapIndex.includes(current_slide_in_loop)) {
            if (current_slide_in_loop > 0 ) {
              me.mapIndex.push(current_slide_in_loop)
            } else {
              me.mapIndex.push((me.pipChart.length) + current_slide_in_loop)
            }
          }
        })
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.chart-title {
  background: #f3f0ef;
}
.product-name {
  background: #f3f0ef;
  padding: 2vw 4vw;
  .icon-title {
    width: 8vw;
    height: 8vw;
    background: #ff8400;
    border-radius: 50%;
    font-size: 4vw;
    color: white;
    margin-right: 2vw;
    b {
      margin-top: 1px;
    }
  }
  > h2 {
    font-size: 4.5vw;
    color: #434343;
    margin-top: 2px;
    margin-bottom: 0;
  }
  .btc-icon {
    color: #ff8400;
    width: 10vw;
    height: 10vw;
  }
}
.product-info {
  padding: 4vw;
  .product-img {
    width: 25%;
    flex: 0 0 25%;
    .prd-img {
      width: 100%;
      height: 0;
      padding-top: 100%;
      background: #f5f7fa;
      margin-bottom: 2vw;
      img {
        max-width: 100%;
        max-height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    /deep/ .gg-rating {
      font-size: 3.5vw;
      letter-spacing: -1px;
      > .rate-num {
        font-size: 3vw;
        margin-left: 0.8vw;
      }
    }
    .question {
      height: 6.5vw;
      font-size: 2.5vw;
      border: 0.5vw solid #ff8400;
      border-radius: 6vw;
      color: #ff8400;
      font-weight: bold;
      .question-icon {
        display: block;
        border-style: solid;
        border-width: 1vw 0 1vw 1.2vw;
        border-color: transparent transparent transparent #ff8500;
        margin-right: 1vw;
        ~ span {
          margin-top: 2px;
        }
      }
    }
  }
  .product-des {
    width: 71%;
    margin-left: 4%;
    font-size: 3vw;
    color: #434343;
    .category {
      flex: 0 0 43%;
      ~ div,
      ~ a {
        margin-left: 3vw;
      }
    }
    > div:not(:first-child) {
      margin-top: 1vw;
    }
  }
  .des-content {
    margin-bottom: 2vw;
  }
}
.under-link {
  text-decoration: underline;
  color: #434343;
}
.main-chart {
  /deep/ .loader {
    width: 100vw;
    height: 300px;
  }
}
.ea-cls {
  font-weight: bold;
  color: #b56ba3;
}
.title {
  margin: 0 4vw;
  font-size: 14px;
  line-height: 1.4;
  color: black;
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
        },
      }
    },
  }
  </script>
  ```
</docs>
