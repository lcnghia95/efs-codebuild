<template>
  <div class="product-BjNGXdi flex space-between pt-10" :title="product.name">
    <div class="flex">
      <gogo-link class="product-img pos-rel mb-10" :target="product.detailUrl">
        <rank-number v-if="rank" :number="rank" class="pos-abs" :size="24" />
        <google-line-chart class="img-chart" :size="[58, 58]" :data="product.chart" />
      </gogo-link>
      <div class="product-wrapper ml-15">
        <gogo-link :target="product.detailUrl">
          <div v-wrap-lines="2" class="cursor-pointer product-name word-break-all">
            <div class="">
              <span class="category text-center mr-5" :style="{ 'background-color': categoryColors[product.category || 1], 'font-size': product.category == 18 ? '9px' : '11px'}">
                {{ $t('c' + (product.category || 1)) }}
              </span>
              <span v-if="product.isReal" class="readtrade">REAL</span>
            </div>
            {{ product.name }}
          </div>
          <div v-if="showCriterial">
            <div class="criterial fs-12" v-if="product.profitRate">
              {{ product.profitRate }}%
            </div>
            <div class="criterial fs-12" v-if="product.profitTotal">
              {{ formatNumber(product.profitTotal) }}{{ product.currencyType ? $t('cur' + product.currencyType) : '円' }}
            </div>
            <div class="criterial fs-12" v-if="product.profitFactor">
              PF: {{ formatNumber(product.profitFactor) }}
            </div>
            <div class="criterial fs-12" v-if="product.riskReturn">
              {{ product.riskReturn }}%
            </div>
          </div>
          <span v-if="displayPips && product.pips">{{ formatNumber(product.pips) }} pips</span>
          <Prices :prices="product.prices" />
        </gogo-link>
        <Rate :alway-show="true" :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
              :target="product.id"
        />
        <div :style="{ 'color': platformColors[product.platform] }" v-if="product.platform">
          <b class="fs-12">{{ $t('platforms.' + (product.platform)) }}</b>
        </div>
      </div>
    </div>
    <gogo-link class="flex layout-col content-end mb-10" :target="product.detailUrl">
      <img :src="'/img/products/' + product.id + '/small'" width="30" height="30" alt="" class="img-border" />
    </gogo-link>
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
    rank: {
      type: Number,
      default: 0,
    },
    isHorizontal: {
      type: Boolean,
      default: false,
    },
    showCriterial: {
      type: Boolean,
      default: false,
    },
    displayPips: {
      type: Boolean,
      default: false
    },
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
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.product-BjNGXdi {
  a {
    text-decoration: none;
  }
  .product-wrapper {
    flex: 0 0 195px;
    a {
      display: block;
    }
  }
  &:hover {
    background: #f5f5f5;
    .product-name {
      text-decoration: underline;
    }
  }
  .product-img {
    flex: 0 0 60px;
  }
  .number {
    top: 0;
    left: 0;
    z-index: 1;
  }
  .product-name {
    overflow: hidden;
    height: 35px;
    margin-top: -1px;
    color: #666;
    line-height: 18px;
    .category {
      display: inline-block;
      min-width: 40px;
      padding: 0 2px;
      height: 14px;
      line-height: 15px;
      color: white;
      border-radius: 2px;
    }
  }
  .criterial {
    color: #666;
    font-weight: bold;
  }
  /deep/ .price-cls {
    justify-content: flex-end;
    flex-direction: row-reverse;
    .co-red {
      margin-left: 0;
    }
    .old-price {
      color: #666;
      margin-left: 5px;
    }
  }
  /deep/ .gg-rating {
    font-size: 12px;
    margin-top: -3px;
    .rate-num {
      font-size: 11px;
      color: #666;
    }
  }
  .img-border {
    border: 1px solid #d2d2d2;
  }
  .content-end {
    flex: 0 0 30px;
  }
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
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 300px;">
      <SystemProductHor :product="product" />
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
