<template>
  <section class="o-prod">
    <LazyComp01 class="box-wrapp flex space-between pos-rel" min-height="22vw">
      <a v-if="rank" :href="data.detailUrl" class="o-prod__number flex mid center">
        <rank-number :number="rank" />
      </a>
      <div class="o-prod__info">
        <a :href="data.detailUrl">
          <div :title="data.name" class="o-prod__name wrap-text"><b>{{ data.name }}</b></div>
          <Prices :prices="data.prices" :is-vertical="true" class="o-prod__prices" />
          <span class="o-prod__rr">{{ $t(getItemDetailInfo(type).label) + ': ' + formatNumber(data[getItemDetailInfo(type).value] || 0) + $t(getItemDetailInfo(type).unit) }}</span>
        </a>
        <Rate :stars="data.review ? data.review.stars : 0" :number="data.review ? data.review.count : 0" :target="data.id" :alway-show="true" class="o-prod__review" />
      </div>
      <a :href="data.detailUrl" class="o-prod__info02 flex layout-col space-between">
        <div class="battle">
          <span class="o-prod__cat text-center" :style="{ 'background-color': categoryColors[data.category || 1], 'font-size': data.category == 18 ? '2vw' : '2.5vw'}">
            {{ $t('c' + (data.category || 1)) }}
          </span>
          <span v-if="data.isReal" class="o-prod__cat text-center readtrade" :style="{'font-size': data.category == 18 ? '2vw' : '2.5vw'}">REAL</span>
        </div>
        <Lzimg :data-src="'/img/products/' + data.id + '/small'" class="o-prod__img" />
      </a>
      <a :href="data.detailUrl">
        <GoogleLineChart :size="size" :data="data.chart" class="o-prod__chart" />
      </a>
    </LazyComp01>
  </section>
</template>
<script>
import i18n from '@@/lang/components-mobile/systemtrade-rank-item'
import RankNumber from '@/components/icons/RankNumber.vue'
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'
import Lzimg from '@@/../components/Lzimg.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
/**
 * The Product Item for mobile.
 */

const itemDetail = {
  profit: {
    label: 'profit',
    unit: 'yen',
    value: 'profitTotal',
  },
  profitrate: {
    label: 'profit_rate',
    unit: 'percent',
    value: 'profitRate',
  },
  profitfactor: {
    label: 'pf',
    unit: '',
    value: 'profitFactor',
  },
  riskreturn: {
    label: 'risk_return',
    unit: '',
    value: 'riskReturn',
  },
  sell: {
    label: 'profit',
    unit: 'yen',
    value: 'profitTotal',
  },
  newproduct: {
    label: 'profit',
    unit: 'yen',
    value: 'profitTotal',
  },
  unemploy: {
    label: 'profit',
    unit: 'yen',
    value: 'profitTotal',
  },
  financial: {
    label: 'profit',
    unit: 'yen',
    value: 'profitTotal',
  },
  default: {
    label: 'default',
    unit: 'default',
    value: 'profitTotal',
  },
  pips: {
    label: 'profit',
    unit: 'pips',
    value: 'pips',
  },
  realasset: {
    label: 'profit',
    unit: 'pips',
    value: 'pips',
  },
}

export default {
  i18n: { messages: i18n },
  props: {
    /**
     * The data of product item.
     */
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    oneLine: Number,
    rank: { type: Number, default: 0 },
    size: {
      type: Array,
      default() {
        return [88, 88]
      },
    },
    type: {
      type: String,
      default: 'profit',
    },
    isRealAccount: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categoryColors: {
        1: '#8fc31f',
        3: '#00b7ee',
        18: '#f19149',
      },
    }
  },
  components: {
    RankNumber,
    Prices,
    Rate,
    GoogleLineChart,
    Lzimg,
    LazyComp01,
  },
  methods: {
    getItemDetailInfo(_type) {
      return itemDetail[_type] || itemDetail['default']
    },
  },
}
</script>
<style lang="scss" scoped>
.battle {
  display: inline-grid;
}
.readtrade {
  margin-top: 5px;
  background-color: #bf9e6c;
}
</style>
<docs>
  ```vue
  <template>
    <div>
      <item :data="item"/>
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          item: {
            chart:"0,0,14921,14921,14921,14921,29876,29876,40295,40295,40295,55215,68824,83769,100639,100639",
            detailUrl:"/systemtrade/fx/14861",
            id:14861,
            name:"Prospect_FX_AUDNZD",
            prices:[{
              price:15000
              discountPrice:15000
            }],
            review: {
              count:10,
              stars:4,
            }
          }
        }
      }
    }
  </script>
  ```
</docs>
