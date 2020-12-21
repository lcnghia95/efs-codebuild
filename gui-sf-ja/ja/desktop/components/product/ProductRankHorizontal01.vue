<template>
  <a class="product-gfd6b flex mid mr-20 flex mid" :href="product.detailUrl" :title="product.name">
    <rank-number v-if="rank" :number="rank" :size="20" :type="1" class="rank-number" />
    <span class="product-name wrap-text" :title="product.name">{{ product.name }}</span>
  </a>
</template>

<script>
import RankNumber from '@/components/icons/RankNumber.vue'
import Prices from '@@/../components/prices/Prices.vue'

export default {
  components: {
    RankNumber,
    Prices,
  },
  props: {
    rank: {
      type: Number,
      default: 0,
    },
    product: {
      type: [Object, Array],
      default() {
        return {}
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.product-gfd6b {
  font-size: 13px;
  text-decoration: none;
  &:hover .product-name {
    text-decoration: underline;
  }
  .product-name {
    color: #666;
    flex: 0 1 auto;
    margin-left: 7px;
  }
  .rank-number {
    flex: 0 0 20px;
    font-size: 12px;
    font-weight: bold;
  }
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 300px;">
      <ProductRankHorizontal01 :product="product" :rank="1" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        product: {
          detailUrl: 'http://fx-on.ex-cloud.biz/ebooks/detail/?id=14994',
          chart: '57526,55807,57847,57847,59794,59794,58120,61932,60554,60554,60554,60554,55872,55872,57719,57272,57272,57272,56921,51901,46911,47572,49552,49552,52702,52702,52702,53472,54780,54780,54780,55624,58116,60335,58676,58676,58676,55217,55217,56479,57575,57575,53140,53140,53140,54795,56585,56585,57597,55796,58438,56023,56023,56023,56012,57626,57626,55412,57190,57190,57190,53826,53826,55098,58005,58005,58005,58005,56645,52162,57151,57151,55236,55236,56560,54786,54786,54786,52541,53148,54205,52030,49824,49824,47569,49258,49258,46969,46969,46969',
          id: 14994,
          name: '2億人をターゲットにする新規公開コインICO...',
          prices: [{
            price: 1980,
          }],
          typeId: 3,
        },
      }
    },
  }
  </script>
  ```
</docs>
