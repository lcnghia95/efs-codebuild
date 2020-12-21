<template>
  <LazyComp01 class="product-RkVn7" min-height="146px">
    <a class="flex mid p-3w" :href="product.detailUrl">
      <product-category :type="product.category" class="cate" />
      <div class="wrap-text name-RkVn7"><b>{{ product.name }}</b></div>
    </a>
    <hr />
    <div class="flex space-between p-3w">
      <div class="flex">
        <a :href="product.detailUrl">
          <GoogleLineChart class="img-chart" :size="[95, 95]" :data="product.chart" />
        </a>
        <div class="detail">
          <a :href="product.detailUrl">
            <div class="flex fs-35vw"><span class="block title-minw">{{ $t('1') }}</span>: {{ formatCurrency(product.profitTotal, product.currencyType) }}</div>
            <div class="flex fs-35vw"><span class="block title-minw">{{ $t('2') }}</span>: {{ formatNumber(product.profitRate || 0) }}％</div>
            <div class="flex fs-35vw mb-5"><span class="block title-minw">{{ $t('3') }}</span>: {{ formatNumber(product.winningRate || 0) }}％</div>
            <Prices :prices="product.prices" class="price-RkVn7" />
          </a>
          <Rate class="rate-RkVn7" :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
                :target="product.id"
          />
        </div>
      </div>
      <a class="right-content flex layout-col space-between" :target="product.detailUrl">
        <div>
          <div class="flex fs-35vw"><span class="block title-minw01">PF</span>: {{ formatPF(product.profitFactor) }}</div>
          <div class="flex fs-35vw"><span class="block title-minw01">{{ $t('4') }}</span>: {{ formatNumber(product.riskReturn) }}</div>
        </div>
        <img class="product-img" :src="'/img/products/' + product.id" alt="" />
      </a>
    </div>
  </LazyComp01>
</template>

<script>
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import ProductCategory from '@@/../components/product/ProductCategory'
import i18n from '@@/lang/components-mobile/product-horizontal03.json'
import { formatPF } from '@/utils/client/common'
import LazyComp01 from '@@/../components/LazyComp01.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    GoogleLineChart,
    Prices,
    Rate,
    ProductCategory,
    LazyComp01,
  },
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: {
    formatPF,
  },
}
</script>

<style lang="scss" scoped>
$textSize: 3vw;
.product-RkVn7 {
  border-radius: 5px;
  box-shadow: 0 0 5px 2px rgba(219, 219, 219, 1);
  a {
    color: #666;
    text-decoration: none;
  }
}
.p-3w {
  padding: 3vw;
}
.detail {
  margin-left: 3vw;
  a {
    display: block;
  }
}
.cate.category-29oa0 {
  margin-right: 2vw;
  flex: 0 0 auto;
  height: auto;
  width: 11vw;
  font-size: 3vw !important;
}
.title-minw {
  min-width: 11.5vw;
}
.title-minw01 {
  min-width: 15vw;
}
.fs-35vw {
  font-size: $textSize;
}
.img-chart {
  width: 20vw;
  height: 20vw;
}
.price-RkVn7 /deep/ {
  .price-cls {
    font-size: $textSize;
  }
}
.rate-RkVn7 /deep/ {
  font-size: $textSize;
  color: #999;
  .rate-num {
    color: #999;
  }
}
.product-img {
  width: 10vw;
  height: 10vw;
  align-self: flex-end;
}
.name-RkVn7 {
  font-size: 3.5vw;
  color: #2d2d2d;
}
hr {
  margin-top: 0;
  margin-bottom: 2vw;
}
</style>

<docs>
  ```vue
  <template>
    <div class="m-15">
      <ProductHorizontal03 :product="product"/>
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          product:
          {
            "id": 13038,
            "name": "MultiLogicShot_EA",
            "category": 1,
            "platform": 1,
            "prices": [
              {
                "price": 4000,
                "discountPrice": 2000
              }
            ],
            "review": {
              "stars": 3,
              "count": 9
            },
            "salesCount": 757,
            "profitRate": 9.09,
            "profitTotal": 113763,
            "currencyType": 1,
            "winningRate": 94.35,
            "profitFactor": 3.02,
            "riskReturn": 2.67,
            "chart": "0,0,0,-3610,-3610,-1499,135,-43819,-39079,-30040,-30040,-30040,-30040,-23841,-17310,-15473,-15473,-15473,-15473,-15473,-15473,-14608,-14608,-14608,-14608,-10544,-10544,-10544,-10544,-10544,-5996,-5996,-2398,15066,15066,15066,19866,30867,37554,37554,37554,37554,41304,44534,40130,40130,40130,40130,40130,40130,40130,51734,51734,51734,51734,52828,53047,53047,53047,53047,57473,62383,62383,62383,62383,62383,62383,62383,64823,64823,64823,64823,64823,64823,64823,64823,64823,64823,67392,67392,67392,73766,73766,73766,73766,89624,96424,96424,96424,96424,96424,83362,83362,83362,83362,83362,86516,92859,101670,103968,103968,103968,106591,108894,123681,113093,113093,113093,113093,108083,108083,108083,108083,108083,110413,110413,115195,117249,117249,117249,122517,122517,122517,127864,127864,127864,137013,141420,141420,130534,130534,130534,137314,137314,137314,139819,139819,139819,139819,130579,130579,130579,130579,130579,133629,133629,133629,133629,133629,133629,135462,141647,143397,143397,143397,143397,143397,143397,134157,134157,134157,134157,144957,148142,148142,151802,151802,151802,153408,153408,153408,159096,159096,159096,160094,160094,161803,122370,122370,122370,126800,131424,139441,139441,139441,139441,143641,141816,154984,154984,154984,154984,154984,154984,154984,154984,154984,154984,158187,158187,159097,162330,162330,162330,162330,171680,171680,178063,178063,178063,178063,178596,186176,213811,213811,213811,213811,231597,238797,238797,238797,238797,238797,238797,239447,241827,241827,241827,241827,241827,242932,242932,242932,242932,242932,242932,248172,248172,248172,248172,253207,250827,250827,254211,254211,254211,257726,259166,259166,268626,268626,268626,268626,269096,269096,275566,275566",
            "detailUrl": "/systemtrade/fx/13038"
          }
        }
      }

    }
  </script>
  ```
</docs>
