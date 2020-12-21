<template>
  <div class="product-BjNGX">
    <div class="flex">
      <div class="product-wrapper pos-rel">
        <rank-number v-if="rank" :size="30" :number="rank" class="pos-abs"/>
        <google-line-chart class="img-chart" :size="[76, 76]" :data="product.chart"/>
      </div>
      <div class="product-detail ml-15">
        <span class="category flex mid center" :style="{ 'background-color': categoryColors[product.category || 1], 'font-size': product.category == 18 ? '9px' : '11px'}">
          {{ $t('c' + (product.category || 1)) }}
        </span>
        <gogo-link class="cursor-pointer product-name wrap-text" :target="product.detailUrl" :title="product.name">{{ product.name }}</gogo-link>
        <Prices :prices="product.prices" :is-vertical="true"/>
        <Rate :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
              :target="product.id"/>
      </div>
    </div>
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
    rank: {
      type: Number,
      default: 0,
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
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.product-BjNGX {
  .number {
    top: 0;
    left: 0;
    z-index: 1;
    font-size: 20px;
  }
  .product-detail {
    width: 100px;
    .category {
      width: 40px;
      height: 14px;
      color: white;
      border-radius: 2px;
    }
    .product-name {
      display: block;
      overflow: hidden;
      margin-top: 3px;
      color: #666;
      line-height: 16px;
    }
    /deep/ .prices {
      min-height: 30px;
      line-height: 16px;
      align-items: flex-end;
      margin-top: -2px;
      .old-price {
        color: #666;
      }
    }
    /deep/ .gg-rating {
      margin-top: -2px;
      .rate-num a {
        margin-top: 1px;
        font-size: 12px;
        color: #666;
      }
    }
  }
  .rate-return {
    color: #666;
  }
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 300px;">
      <ProductRankHorizontal04 :product="product" :rank="1"/>
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          product: {
            detailUrl:"http://fx-on.ex-cloud.biz/ebooks/detail/?id=14994",
            chart:"57526,55807,57847,57847,59794,59794,58120,61932,60554,60554,60554,60554,55872,55872,57719,57272,57272,57272,56921,51901,46911,47572,49552,49552,52702,52702,52702,53472,54780,54780,54780,55624,58116,60335,58676,58676,58676,55217,55217,56479,57575,57575,53140,53140,53140,54795,56585,56585,57597,55796,58438,56023,56023,56023,56012,57626,57626,55412,57190,57190,57190,53826,53826,55098,58005,58005,58005,58005,56645,52162,57151,57151,55236,55236,56560,54786,54786,54786,52541,53148,54205,52030,49824,49824,47569,49258,49258,46969,46969,46969",
            id:14994,
            name:"2億人をターゲットにする新規公開コインICO...",
            prices: [{
              price:1980
            }],
            typeId:3
          }
        }
      }
    }
  </script>
  ```
</docs>
