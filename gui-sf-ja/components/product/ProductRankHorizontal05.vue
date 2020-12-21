<template>
  <LazyComp01 class="flex product-hZNcL pb-15" min-height="150px">
    <div class="chart-wrapper pos-rel">
      <ProductStock
        v-if="product.chart && product.chart.length"
        :chart="product.chart"
        :option="{
          name: $t('7'),
          currency: $t('cur' + (product.currencyType || 1)),
        }"
      />
      <div v-else class="chart-empty"/>
      <rank-number
        v-if="number"
        :number="number"
        :size="35"
        :type="0"
        class="rank-number pos-abs"
      />
    </div>
    <div class="mt-5 ml-10 grow11 wrap-text">
      <div class="flex mid">
        <product-category :type="product.category" class="mr-5" />
        <span v-if="product.isReal" class="readtrade mr-5">REAL</span>
        <a
          :href="product.detailUrl"
          :title="product.name"
          class="wrap-text title ml-5"
        >
          <b>{{ product.name }}</b>
        </a>
      </div>
      <div class="flex space-between info">
        <div>
          <div>
            <span class="title01">{{ $t('1') }}</span>
            :&nbsp;
            {{
              product.profitTotal
                ? formatNumber(product.profitTotal) +
                  $t('cur' + (product.currencyType || 1))
                : '-'
            }}
          </div>
          <div>
            <span class="title01">{{ $t('2') }}</span>
            :&nbsp;
            {{
              product.profitRate
                ? formatNumber(product.profitRate.toFixed(2)) + '％'
                : '-'
            }}
          </div>
          <div>
            <span class="title01">{{ $t('3') }}</span>
            :&nbsp;
            {{ formatPercent(product.winningRate) }}
          </div>
        </div>
        <div>
          <div>
            <span class="title02">{{ $t('4') }}</span>
            :&nbsp;
            {{ formatPF(product.profitFactor) }}
          </div>
          <div>
            <span class="title02">{{ $t('5') }}</span>
            :&nbsp;
            {{ product.riskReturn ? product.riskReturn.toFixed(2) : '-' }}
          </div>
        </div>
      </div>
      <div class="flex space-between">
        <div class="flex layout-col price-rate">
          <Prices :prices="product.prices" />
          <Rate
            class="rate"
            :stars="product.review ? product.review.stars : 0"
            :number="product.review ? product.review.count : 0"
            :target="product.id"
            :alway-show="true"
          />
        </div>
        <Lzimg
          :data-src="'/img/products/' + product.id + '/small'"
          width="55"
          height="55"
          :alt="product.name"
        />
      </div>
    </div>
  </LazyComp01>
</template>

<script>
import ProductCategory from '@@/../components/product/ProductCategory'
import Rate from '@@/../components/product/Rate.vue'
import Prices from '@@/../components/prices/Prices.vue'
import i18n from '@@/lang/components-desktop/product-horizontal05.json'
import RankNumber from '@/components/icons/RankNumber.vue'
import { formatPF } from '@/utils/client/common'
import lazyLoadComponent from '@@/../common/js/lazy-load-component.js'
import Lzimg from '@@/../components/Lzimg.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

export default {
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
    number: {
      type: Number,
      default: 0,
    },
  },
  i18n: {
    messages: i18n,
  },
  components: {
    ProductCategory,
    Rate,
    Prices,
    ProductStock: lazyLoadComponent({
      componentFactory: () =>
        import('@@/../components/charts/ProductStock.vue'),
    }),
    RankNumber,
    Lzimg,
    LazyComp01,
  },
  methods: {
    formatPF,
    formatPercent(num = 0) {
      let n = parseFloat(num)
      return n.toFixed(2) + '%'
    },
  },
  created() {
    if (this.product.chart) {
      this.product.chart.sort((a, b) => (a[0] > b[0] ? 1 : -1))
    }
  },
}
</script>

<style lang="scss" scoped>
.product-hZNcL {
  border-bottom: 1px dotted #aaa;
  .chart-wrapper {
    flex: 0 0 212px;
    height: 130px;
  }
  .rank-number {
    top: 10px;
    left: 10px;
  }
}
.title {
  /deep/ a {
    font-size: 16px;
    &:hover {
      text-decoration: none;
    }
  }
  b {
    color: #666;
  }
}
.title01 {
  display: inline-block;
  min-width: 45px;
}
.title02 {
  display: inline-block;
  min-width: 155px;
}
.price-rate {
  justify-content: flex-end;
  /deep/ .old-price {
    color: #666;
  }
}
.info {
  color: #5b5b5b;
  margin-top: 3px;
}
.rate /deep/ {
  .rate-num {
    color: #5b5b5b;
  }
}
.chart-empty {
  height: 103px;
  width: 190px;
  font-size: 35px;
  border: 1px solid #e6e6e6;
  margin: 8px auto 0 auto;
  color: #888;
  background-image: url(/img/assets/pc/common/chart_nodata.jpg);
  background-size: 100% 100%;
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
    <div style="width: 600px;">
      <ProductRankHorizontal05 :product="product" rank="1"/>
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          product: {
            id: 8815,
            name: "一本勝ち",
            category: 1,
            platform: 1,
            prices: [{
              price: 50000
            }],
            review: {
              stars: 3,
              count: 39
            },
            salesCount: 1722,
            profitRate: 6.9,
            profitTotal: 64100,
            currencyType: 1,
            winningRate: 89.66,
            profitFactor: 1.41,
            riskReturn: 0.49,
            chart: [
              [
              1526828400000,
              2007000
              ],
              [
              1526914800000,
              2007000
              ],
              [
              1527001200000,
              2037400
              ],
              [
              1527087600000,
              2110300
              ],
              [
              1527174000000,
              2118600
              ],
              [
              1527260400000,
              2118600
              ],
              [
              1527433200000,
              2118600
              ],
              [
              1527519600000,
              2119200
              ],
              [
              1527606000000,
              2119000
              ],
              [
              1527692400000,
              2118200
              ],
              [
              1527778800000,
              2118200
              ],
              [
              1527865200000,
              2118200
              ],
              [
              1528038000000,
              2118200
              ],
              [
              1528124400000,
              2124300
              ],
              [
              1528210800000,
              2124300
              ],
              [
              1528297200000,
              2144000
              ],
              [
              1528383600000,
              2144200
              ],
              [
              1528470000000,
              2144200
              ],
              [
              1528642800000,
              2144200
              ],
              [
              1528729200000,
              2159500
              ],
              [
              1528815600000,
              2183700
              ],
              [
              1528902000000,
              2183700
              ],
              [
              1528988400000,
              2140800
              ],
              [
              1529074800000,
              2140800
              ],
              [
              1529247600000,
              2140800
              ],
              [
              1529334000000,
              2151300
              ],
              [
              1529420400000,
              2151300
              ],
              [
              1529506800000,
              2158700
              ],
              [
              1529593200000,
              2161700
              ],
            ],
            detailUrl: "/systemtrade/fx/8815"
          }
        }
      }
    }
  </script>
  ```
</docs>
