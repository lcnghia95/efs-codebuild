<template>
  <div class="product-BjNGX p-10">
    <gogo-link :target="product.detailUrl" :title="product.name">
      <div class="product-img pos-rel mb-10">
        <rank-number v-if="rank" :number="rank" class="pos-abs" />
        <img :data-src="`/img/products/${product.id}/small`" :style="`width: ${size[0]}px; height: ${size[1]}px`" alt="" v-if="product.typeId && product.typeId != 1" :class="{'owl-lazy': isLz}" />
        <google-line-chart :size="size" :data="product.chart || []" v-else :class="{'owl-lazy': isLz}" :is-lz="isLz" />
      </div>
      <span class="other-type flex mid grow11 wrap-text" v-if="product.typeId && product.typeId != 1" :title="$t('types.' + product.typeId)">
        {{ $t('types.' + product.typeId) }}
      </span>
      <span class="category flex mid center" :style="{ 'background-color': categoryColors[product.category || 1], 'font-size': product.category == 18 ? '9px' : '11px'}" v-else>
        {{ $t('c' + (product.category || 1)) }}
      </span>
      <span v-if="product.isReal" class="readtrade">REAL</span>
      <div v-if="!oneLine" class="cursor-pointer product-name" :target="product.detailUrl" :title="product.name" v-wrap-lines="2">{{ product.name }}</div>
      <div v-else class="cursor-pointer product-name wrap-text" :target="product.detailUrl" :title="product.name">{{ product.name }}</div>
      <div v-if="showCriterial">
        <div class="criterial fs-12" v-if="product.profitRate">
          {{ $t('crit_profitRate') }}: {{ product.profitRate }}%
        </div>
        <div class="criterial fs-12" v-if="product.profitTotal">
          {{ $t('crit_profitTotal') }}: {{ formatNumber(product.profitTotal) }}{{ product.currencyType ? $t('cur' + product.currencyType) : '円' }}
        </div>
        <div class="criterial fs-12" v-if="product.profitFactor">
          {{ $t('crit_profitFactor') }}: {{ formatNumber(product.profitFactor) }}
        </div>
        <div class="criterial fs-12" v-if="product.riskReturn">
          {{ $t('crit_riskReturn') }}: {{ formatNumber(product.riskReturn, 0, 2) }}%
        </div>
      </div>
      <div class="criterial fs-12" v-if="product.pips">
        {{ formatNumber(product.pips) }} pips
      </div>
      <Prices :prices="product.prices" :is-vertical="true" />
    </gogo-link>
    <Rate :alway-show="true" :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
          :target="product.id"
    />
    <div :style="{ 'color': platformColors[product.platform] }" v-if="product.platform">
      <b class="fs-12">{{ $t('platforms.' + (product.platform)) }}</b>
    </div>
  </div>
</template>

<script>
import RankNumber from '@/components/icons/RankNumber.vue'
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
import Rate from '@@/../components/product/Rate.vue'
import Prices from '@@/../components/prices/Prices.vue'
import i18n from '@@/lang/components-desktop/product-productvert.json'
export default {
  i18n: { messages: i18n },
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
    oneLine: Number,
    rank: {
      type: Number,
      default: 0,
    },
    size: {
      type: Array,
      default() {
        return [88, 88]
      },
    },
    showCriterial: {
      type: Boolean,
      default: false,
    },
    isLz: Boolean,
  },
  components: {
    RankNumber,
    GoogleLineChart,
    GogoLink,
    Rate,
    Prices,
  },
  data() {
    return {
      categoryColors: {
        1: '#8fc31f',
        3: '#00b7ee',
        18: '#f19149',
      },
      platformColors: {
        1: '#00cc33',
        2: '#00cc33',
        3: '#627cc6',
        4: '#ef9062',
        5: '#00cc33',
        15: '#00cc33',
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.product-BjNGX {
  display: block;
  width: 110px;
  &:hover {
    background: #f5f5f5;
    a {
      text-decoration: none;
      > .product-name {
        text-decoration: underline;
      }
    }
  }
  .product-img .number {
    top: 0;
    left: 0;
    z-index: 1;
  }
  .category {
    padding: 0 2px;
    display: inline-block;
    min-width: 40px;
    text-align: center;
    height: 14px;
    color: white;
    border-radius: 2px;
  }
  .other-type {
    background: #f29855;
    height: 14px;
    color: #f5f5f5;
    border-radius: 2px;
    font-size: 11px;
    padding: 0 3px;
    display: inline-block;
  }
  .product-name {
    height: 33px;
    overflow: hidden;
    margin-top: 3px;
    color: #666;
    line-height: 16px;
    &.wrap-text {
      height: inherit;
    }
  }
  .criterial {
    color: #666;
    font-weight: bold;
    margin-top: 5px;
    span {
      display: block;
    }
  }
  /deep/ .prices {
    line-height: 18px;
    align-items: flex-end;
    .old-price {
      color: #666;
    }
  }
  /deep/ .gg-rating .rate-num {
    margin-top: 1px;
    font-size: 12px;
    color: #666;
  }
  .readtrade {
    background-color: #bf9e6c;
    color: #fff;
    font-size: 1rem;
    display: inline-block;
    min-width: 40px;
    padding: 0 2px;
    height: 17px;
    line-height: 19px;
    border-radius: 5px;
    text-align: center;
    margin-left: 5px;
    a {
      color: #fff;
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 300px;">
      <SystemProductVert :product="product" />
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          product: {
            category:1,
            chart:"0,0,14921,14921,14921,14921,29876,29876,40295,40295,40295,55215,68824,83769,100639,100639",
            detailUrl:"/systemtrade/fx/14861",
            id:14861,
            name:"Prospect_FX_AUDNZD",
            prices:[{
              price:15000
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
